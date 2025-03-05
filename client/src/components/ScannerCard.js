import React from 'react';
import { Card, CardContent, CardActions, Typography, Box, Button } from '@mui/material';

const scannerCardStyle = {
    mb: 3,
    borderRadius: 2,
    height: '10rem',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }
};

const scannerButtonStyle = {
    textTransform: 'none',
    borderRadius: '8px',
    fontWeight: 500,
    px: 3,
    py: 1
};

const ScannerCard = ({ title, description, icon, color, buttonText, onClick }) => {
    const Icon = icon;
    
    return (
        <Card sx={scannerCardStyle}>
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Icon sx={{ mr: 1.5, color: color.main, fontSize: 28 }} />
                    <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                    {description}
                </Typography>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    onClick={onClick}
                    sx={{
                        ...scannerButtonStyle,
                        bgcolor: color.main,
                        '&:hover': {
                            bgcolor: color.dark
                        }
                    }}
                >
                    {buttonText}
                </Button>
            </CardActions>
        </Card>
    );
};

export default ScannerCard; 