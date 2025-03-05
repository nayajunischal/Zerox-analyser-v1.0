import React from 'react';
import { AppBar, Toolbar, Typography, Chip, Button, CircularProgress } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';

const Header = ({ serverStatus, testingServer, checkServerStatus }) => {
    return (
        <AppBar position="static" sx={{
            bgcolor: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
        }}>
            <Toolbar>
                <Typography
                    variant="h5"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        color: '#1e293b',
                        fontWeight: 600
                    }}
                >
                    <SecurityIcon sx={{ mr: 1.5, color: '#0284c7' }} />
                    ZeroX Scanner
                </Typography>
                <Chip
                    label={serverStatus === 'online' ? 'Server Connected' :
                        serverStatus === 'offline' ? 'Server Disconnected' : 'Server Status Unknown'}
                    color={serverStatus === 'online' ? 'success' :
                        serverStatus === 'offline' ? 'error' : 'default'}
                    sx={{
                        mr: 2,
                        '& .MuiChip-label': {
                            fontWeight: 500
                        }
                    }}
                />
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={checkServerStatus}
                    startIcon={testingServer ? <CircularProgress size={20} color="inherit" /> : <NetworkCheckIcon />}
                    disabled={testingServer}
                    sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 500
                    }}
                >
                    {testingServer ? 'Checking...' : 'Check Server'}
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default Header; 