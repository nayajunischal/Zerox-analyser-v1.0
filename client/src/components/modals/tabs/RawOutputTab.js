import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const RawOutputTab = ({ output }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom sx={{ color: '#1e293b', fontWeight: 600 }}>
                Raw Scan Output
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    bgcolor: '#f8fafc',
                    maxHeight: '500px',
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    borderRadius: 2,
                    border: '1px solid #e2e8f0',
                    color: '#475569',
                    fontSize: '0.875rem'
                }}
            >
                {output || 'No output available'}
            </Paper>
        </Box>
    );
};

export default RawOutputTab; 