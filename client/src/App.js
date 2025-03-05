import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Alert } from '@mui/material';
import axios from 'axios';

// Import components
import Header from './components/Header';
import ScannerCard from './components/ScannerCard';
import ScanConfigModal from './components/modals/ScanConfigModal';
import ResultsModal from './components/modals/ResultsModal';
import CustomSnackbar from './components/CustomSnackbar';

// Import utilities
import { parseResults } from './utils/resultParser';
import { API_URL } from './config/constants';
import { scannerConfig } from './config/scannerConfig';

function App() {
    // State management
    const [targetPath, setTargetPath] = useState('../vulnerable_code');
    const [output, setOutput] = useState('');
    const [parsedResults, setParsedResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
    const [serverStatus, setServerStatus] = useState('unknown');
    const [testingServer, setTestingServer] = useState(false);
    const [pdfGenerating, setPdfGenerating] = useState(false);
    const [scanModalOpen, setScanModalOpen] = useState(false);
    const [resultsModalOpen, setResultsModalOpen] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    // Check server status on component mount
    useEffect(() => {
        checkServerStatus();
    }, []);

    const checkServerStatus = async () => {
        setTestingServer(true);
        try {
            const response = await axios.get(`${API_URL}/api/test`, { timeout: 5000 });
            if (response.status === 200) {
                setServerStatus('online');
                setAlert({
                    open: true,
                    message: 'Connected to server successfully',
                    severity: 'success'
                });
            } else {
                setServerStatus('offline');
            }
        } catch (error) {
            console.error('Server connection error:', error);
            setServerStatus('offline');
            setAlert({
                open: true,
                message: `Cannot connect to server at ${API_URL}. Make sure the Flask server is running.`,
                severity: 'error'
            });
        } finally {
            setTestingServer(false);
        }
    };

    const handleScannerClick = (scannerType) => {
        if (scannerType === 'code') {
            setScanModalOpen(true);
        } else {
            setAlert({
                open: true,
                message: `${scannerType.charAt(0).toUpperCase() + scannerType.slice(1)} scanner is not implemented yet`,
                severity: 'info'
            });
        }
    };

    const handleScan = async () => {
        if (serverStatus !== 'online') {
            setAlert({
                open: true,
                message: 'Server is not connected. Please check server status first.',
                severity: 'warning'
            });
            return;
        }

        setLoading(true);
        setOutput('');
        setParsedResults([]);

        try {
            const response = await axios.post(`${API_URL}/api/scan`, {
                targetPath
            }, {
                timeout: 30000
            });

            if (response.data.success) {
                const outputText = response.data.output;
                setOutput(outputText);
                
                const parsedData = parseResults(outputText);
                setParsedResults(parsedData);
                
                setScanModalOpen(false);
                setResultsModalOpen(true);
                
                setAlert({
                    open: true,
                    message: response.data.error ? 'Scan completed with warnings' : 'Scan completed successfully',
                    severity: response.data.error ? 'warning' : 'success'
                });
            } else {
                setOutput(response.data.error);
                setAlert({
                    open: true,
                    message: 'Scan failed',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            let errorMessage = 'Error connecting to server';

            if (error.response) {
                errorMessage = `Server error: ${error.response.status} - ${error.response.data.error || 'Unknown error'}`;
                setOutput(JSON.stringify(error.response.data, null, 2));
            } else if (error.request) {
                errorMessage = 'No response from server. Make sure the server is running.';
            } else {
                errorMessage = `Request error: ${error.message}`;
            }

            setAlert({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    return (
        <Box sx={{ flexGrow: 1, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Header 
                serverStatus={serverStatus} 
                testingServer={testingServer} 
                checkServerStatus={checkServerStatus} 
            />

            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    {/* Left column - Scanners */}
                    <Grid item xs={12} md={6}>
                        {scannerConfig.left.map((scanner) => (
                            <ScannerCard
                                key={scanner.id}
                                title={scanner.title}
                                description={scanner.description}
                                icon={scanner.icon}
                                color={scanner.color}
                                buttonText={scanner.buttonText}
                                onClick={() => handleScannerClick(scanner.id)}
                            />
                        ))}
                    </Grid>

                    {/* Right column - Additional tools */}
                    <Grid item xs={12} md={6}>
                        {scannerConfig.right.map((scanner) => (
                            <ScannerCard
                                key={scanner.id}
                                title={scanner.title}
                                description={scanner.description}
                                icon={scanner.icon}
                                color={scanner.color}
                                buttonText={scanner.buttonText}
                                onClick={() => handleScannerClick(scanner.id)}
                            />
                        ))}
                    </Grid>
                </Grid>

                {serverStatus === 'offline' && (
                    <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
                        Server is not connected. Make sure the Flask server is running at {API_URL} and click "Check Server".
                    </Alert>
                )}
            </Container>

            <ScanConfigModal
                open={scanModalOpen}
                onClose={() => setScanModalOpen(false)}
                targetPath={targetPath}
                setTargetPath={setTargetPath}
                handleScan={handleScan}
                loading={loading}
                serverStatus={serverStatus}
            />

            <ResultsModal
                open={resultsModalOpen}
                onClose={() => setResultsModalOpen(false)}
                parsedResults={parsedResults}
                output={output}
                tabValue={tabValue}
                setTabValue={setTabValue}
                targetPath={targetPath}
                pdfGenerating={pdfGenerating}
                setPdfGenerating={setPdfGenerating}
                setAlert={setAlert}
            />

            <CustomSnackbar
                open={alert.open}
                message={alert.message}
                severity={alert.severity}
                onClose={handleCloseAlert}
            />
        </Box>
    );
}

export default App; 
