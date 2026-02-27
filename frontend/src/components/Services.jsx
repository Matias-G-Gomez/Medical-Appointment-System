import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Grid, 
    Card, 
    CardContent
} from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HealingIcon from '@mui/icons-material/Healing';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import WheelchairPickupIcon from '@mui/icons-material/WheelchairPickup';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

export const Services = ({ data }) => {
    const iconMap = {
        'Traumatología Deportiva': <DirectionsRunIcon sx={{ fontSize: 60, color: '#3b82f6' }} />,
        'Cirugía Ortopédica': <LocalHospitalIcon sx={{ fontSize: 60, color: '#10b981' }} />,
        'Fracturas y Lesiones': <HealingIcon sx={{ fontSize: 60, color: '#8b5cf6' }} />,
        'Artroscopía': <AccessibilityNewIcon sx={{ fontSize: 60, color: '#ef4444' }} />,
        'Prótesis Articulares': <WheelchairPickupIcon sx={{ fontSize: 60, color: '#f59e0b' }} />,
        'Rehabilitación': <FitnessCenterIcon sx={{ fontSize: 60, color: '#6366f1' }} />,
    };

    // Manejar si data es undefined
    const services = data || [];

    return (
        <Box id="services" sx={{ py: 12, bgcolor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
            <Container maxWidth="lg">
                <Typography 
                    variant="h2" 
                    align="center" 
                    gutterBottom 
                    sx={{ fontWeight: 700, color: '#1e3a8a', mb: 8, fontSize: { xs: '2rem', md: '3rem' } }}
                >
                    Nuestros Servicios
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {services.map((service, index) => (
                        <Grid item xs={12} sm={6} md={6} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Card 
                                sx={{ 
                                    width: 350,
                                    height: 350,
                                    display: 'flex', 
                                    flexDirection: 'column', 
                                    alignItems: 'center', 
                                    textAlign: 'center', 
                                    p: 3, 
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                                    borderRadius: 2, 
                                    transition: 'transform 0.3s ease-in-out', 
                                    '&:hover': { transform: 'translateY(-5px)' },
                                    bgcolor: '#f9fafb'
                                }}
                            >
                                <Box sx={{ mb: 3, flexShrink: 0 }}>
                                    {iconMap[service.name]}
                                </Box>
                                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e40af', mb: 2 }}>
                                        {service.name}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#4b5563', flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                                        {service.text}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};