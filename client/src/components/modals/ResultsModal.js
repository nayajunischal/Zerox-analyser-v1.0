import React, { useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, Button, IconButton, CircularProgress, Tabs, Tab, Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import html2pdf from 'html2pdf.js';

// Import components
import SummaryTab from './tabs/SummaryTab';
import DetailedResultsTab from './tabs/DetailedResultsTab';
import RawOutputTab from './tabs/RawOutputTab';

const ResultsModal = ({ open, onClose, parsedResults, output, tabValue, setTabValue, targetPath, pdfGenerating, setPdfGenerating, setAlert }) => {
    const resultsRef = useRef(null);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleDownloadPDF = () => {
        if (!resultsRef.current || !parsedResults.vulnerabilities?.length) {
            setAlert({
                open: true,
                message: 'No scan results to download',
                severity: 'warning'
            });
            return;
        }

        setPdfGenerating(true);
        
        const element = resultsRef.current;
        const opt = {
            margin: 10,
            filename: 'zerox_vulnerability_scan_report.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Add a title and timestamp to the PDF
        const title = document.createElement('div');
        title.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="color: #1976d2;">ZeroX Vulnerability Scan Report</h1>
                <p>Generated on: ${new Date().toLocaleString()}</p>
                <p>Target: ${targetPath}</p>
                <hr style="margin: 20px 0;" />
            </div>
        `;
        
        element.prepend(title);

        html2pdf()
            .from(element)
            .set(opt)
            .save()
            .then(() => {
                setPdfGenerating(false);
                setAlert({
                    open: true,
                    message: 'PDF report downloaded successfully',
                    severity: 'success'
                });
                
                element.removeChild(title);
            })
            .catch(error => {
                console.error('PDF generation error:', error);
                setPdfGenerating(false);
                setAlert({
                    open: true,
                    message: 'Failed to generate PDF report',
                    severity: 'error'
                });
                
                element.removeChild(title);
            });
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                p: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AssessmentIcon sx={{ mr: 1.5, color: '#0284c7', fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
                        Vulnerability Scan Results
                    </Typography>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{ color: '#64748b' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        aria-label="results tabs"
                        sx={{
                            bgcolor: '#f8fafc',
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 500,
                                fontSize: '0.95rem'
                            }
                        }}
                    >
                        <Tab label="Summary" />
                        <Tab label="Detailed Results" />
                        <Tab label="Raw Output" />
                    </Tabs>
                </Box>

                <Box ref={resultsRef} sx={{ p: 3 }}>
                    {tabValue === 0 && (
                        <SummaryTab parsedResults={parsedResults} />
                    )}
                    
                    {tabValue === 1 && (
                        <DetailedResultsTab parsedResults={parsedResults} />
                    )}
                    
                    {tabValue === 2 && (
                        <RawOutputTab output={output} />
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                <Button
                    variant="contained"
                    startIcon={pdfGenerating ? <CircularProgress size={20} /> : <PictureAsPdfIcon />}
                    onClick={handleDownloadPDF}
                    disabled={pdfGenerating || !parsedResults.vulnerabilities?.length}
                    sx={{
                        textTransform: 'none',
                        borderRadius: '8px',
                        fontWeight: 500,
                        px: 3
                    }}
                >
                    {pdfGenerating ? 'Generating Report...' : 'Download PDF Report'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResultsModal; 