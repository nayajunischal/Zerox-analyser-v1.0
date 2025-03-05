import React from 'react';
import { Typography, Grid, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box } from '@mui/material';

const SummaryTab = ({ parsedResults }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#1e293b', fontWeight: 600 }}>
                Scan Results Summary
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        bgcolor: '#f8fafc',
                        borderRadius: 2,
                        border: '1px solid #e2e8f0'
                    }}>
                        <Typography variant="h4" sx={{ color: '#0284c7', fontWeight: 600 }}>
                            {parsedResults.summary?.total || 0}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                            Total Vulnerabilities
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        bgcolor: '#fef2f2',
                        borderRadius: 2,
                        border: '1px solid #fee2e2'
                    }}>
                        <Typography variant="h4" sx={{ color: '#dc2626', fontWeight: 600 }}>
                            {parsedResults.summary?.bySeverity?.Critical || 0}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                            Critical
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        bgcolor: '#fff7ed',
                        borderRadius: 2,
                        border: '1px solid #ffedd5'
                    }}>
                        <Typography variant="h4" sx={{ color: '#ea580c', fontWeight: 600 }}>
                            {parsedResults.summary?.bySeverity?.High || 0}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                            High
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ 
                        p: 3, 
                        textAlign: 'center', 
                        bgcolor: '#f0fdf4',
                        borderRadius: 2,
                        border: '1px solid #dcfce7'
                    }}>
                        <Typography variant="h4" sx={{ color: '#16a34a', fontWeight: 600 }}>
                            {parsedResults.summary?.bySeverity?.Medium || 0}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', mt: 1 }}>
                            Medium
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ color: '#1e293b', fontWeight: 600, mt: 4 }}>
                Vulnerabilities by Type
            </Typography>
            
            <TableContainer component={Paper} sx={{ 
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                boxShadow: 'none'
            }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                                Vulnerability Type
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                Count
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.entries(parsedResults.summary?.byType || {}).map(([type, count]) => (
                            <TableRow key={type}>
                                <TableCell sx={{ color: '#475569' }}>{type}</TableCell>
                                <TableCell align="right" sx={{ color: '#475569' }}>{count}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default SummaryTab; 