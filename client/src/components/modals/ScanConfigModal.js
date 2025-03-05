import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Box, TextField, Button, IconButton, CircularProgress } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const ScanConfigModal = ({ open, onClose, targetPath, setTargetPath, handleScan, loading, serverStatus }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
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
                borderBottom: '1px solid #e2e8f0'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CodeIcon sx={{ mr: 1.5, color: '#0284c7' }} />
                    <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
                        Code Scanner Configuration
                    </Typography>
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{ color: '#64748b' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ color: '#475569', mb: 2, mt: 2 }}>
                    Enter the path to the code you want to scan for vulnerabilities:
                </Typography>
                <TextField
                    fullWidth
                    label="Target Path"
                    variant="outlined"
                    value={targetPath}
                    onChange={(e) => setTargetPath(e.target.value)}
                    sx={{
                        mb: 1,
                        '& .MuiOutlinedInput-root': {
                            borderRadius: '8px'
                        }
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: '#f8fafc' }}>
                <Button
                    variant="contained"
                    onClick={handleScan}
                    disabled={loading || serverStatus !== 'online'}
                    sx={{
                        textTransform: 'none',
                        borderRadius: '8px',
                        fontWeight: 500,
                        px: 4,
                        py: 1
                    }}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Scanning...
                        </>
                    ) : (
                        <>
                            <PlayArrowIcon sx={{ mr: 1 }} />
                            Run Scan
                        </>
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ScanConfigModal; 