import React from 'react';
import { Box, Container, Typography, Grid, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

export const About = ({ data }) => {
    return (
        <Box
        id="about"
        sx={{
            py: 10,
            bgcolor: '#f9fafb'
        }}
        >
        <Container maxWidth="lg">
            
            {/* Título de la sección */}
            <Typography 
            variant="h3" 
            align="center" 
            gutterBottom
            sx={{ 
                fontWeight: 700,
                mb: 2,
                color: '#1f2937'
            }}
            >
            Sobre Mí
            </Typography>

            <Typography 
            variant="body1" 
            align="center" 
            sx={{ 
                mb: 6, 
                color: '#6b7280',
                maxWidth: '700px',
                mx: 'auto',
                fontSize: '1.1rem'
            }}
            >
            {data?.paragraph || 'Médico traumatólogo con más de 15 años de experiencia dedicado al tratamiento integral de lesiones músculo-esqueléticas.'}
            </Typography>

            {/* Grid con dos columnas */}
            <Grid container spacing={4} justifyContent="center">
            
            {/* Columna 1: Formación Académica */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper 
                elevation={3} 
                sx={{ 
                    p: 4, 
                    height: '100%',
                    width: '100%',
                    maxWidth: { xs: '500px', md: '100%' },
                    borderRadius: 3,
                    transition: 'transform 0.3s',
                    '&:hover': {
                    transform: 'translateY(-5px)'
                    }
                }}
                >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <SchoolIcon sx={{ fontSize: 40, color: '#3b82f6', mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Formación Académica
                    </Typography>
                </Box>
                
                <List>
                    {data?.education?.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                        <WorkspacePremiumIcon sx={{ color: '#3b82f6' }} />
                        </ListItemIcon>
                        <ListItemText 
                        primary={item}
                        slotProps={{
                            primary: {
                            sx: { fontSize: '1rem', color: '#374151' }
                            }
                        }}
                        />
                    </ListItem>
                    ))}
                </List>
                </Paper>
            </Grid>

            {/* Columna 2: Especializaciones */}
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper 
                elevation={3} 
                sx={{ 
                    p: 4, 
                    height: '100%',
                    width: '100%',
                    maxWidth: { xs: '500px', md: '100%' },
                    borderRadius: 3,
                    transition: 'transform 0.3s',
                    '&:hover': {
                    transform: 'translateY(-5px)'
                    }
                }}
                >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <LocalHospitalIcon sx={{ fontSize: 40, color: '#10b981', mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Especializaciones
                    </Typography>
                </Box>
                
                <List>
                    {data?.specializations?.map((item, index) => (
                    <ListItem key={index} sx={{ px: 0, py: 1 }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                        <WorkspacePremiumIcon sx={{ color: '#10b981' }} />
                        </ListItemIcon>
                        <ListItemText 
                        primary={item}
                        slotProps={{
                            primary: {
                            sx: { fontSize: '1rem', color: '#374151' }
                            }
                        }}
                        />
                    </ListItem>
                    ))}
                </List>
                </Paper>
            </Grid>

            </Grid>

            {/* Sección de experiencia */}
            <Box 
            sx={{ 
                mt: 6, 
                p: 4, 
                bgcolor: '#eff6ff', 
                borderRadius: 3,
                textAlign: 'center'
            }}
            >
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 2, color: '#1e40af' }}>
                {data?.experience || '15+'} Años de Experiencia
            </Typography>
            <Typography variant="body1" sx={{ color: '#374151', fontSize: '1.1rem' }}>
                {data?.experienceText || 'Comprometido con la excelencia médica y el bienestar de mis pacientes.'}
            </Typography>
            </Box>

        </Container>
        </Box>
    );
};