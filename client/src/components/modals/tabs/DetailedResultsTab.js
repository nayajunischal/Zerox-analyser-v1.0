import React from 'react';
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Chip, Box } from '@mui/material';
import { getSeverityColor } from '../../../utils/resultParser';

const DetailedResultsTab = ({ parsedResults }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#1e293b', fontWeight: 600 }}>
                Detailed Vulnerability Report
            </Typography>
            
            <TableContainer component={Paper} sx={{ 
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                boxShadow: 'none'
            }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Severity</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>File</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Line</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Code</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>Details</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(parsedResults.vulnerabilities || []).map((vuln, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Chip 
                                        label={vuln.severity}
                                        sx={{
                                            bgcolor: getSeverityColor(vuln.severity),
                                            color: 'white',
                                            fontWeight: 500
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ color: '#475569' }}>{vuln.type}</TableCell>
                                <TableCell sx={{ color: '#475569' }}>{vuln.file}</TableCell>
                                <TableCell sx={{ color: '#475569' }}>{vuln.line}</TableCell>
                                <TableCell>
                                    <code style={{
                                        display: 'block',
                                        whiteSpace: 'pre-wrap',
                                        padding: '8px',
                                        backgroundColor: '#f8fafc',
                                        borderRadius: '4px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '0.85rem',
                                        color: '#475569'
                                    }}>
                                        {vuln.code}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <ul style={{ 
                                        margin: 0, 
                                        paddingLeft: 16,
                                        color: '#475569'
                                    }}>
                                        {vuln.details.map((detail, i) => (
                                            <li key={i}>{detail}</li>
                                        ))}
                                    </ul>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default DetailedResultsTab; 