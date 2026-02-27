import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

export const Header = ({ data, scrollToAppointment }) => {
    return (
        <Box
            id="header"
            sx={{
                minHeight: { xs: 'auto', md: '90vh' },
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #1960a8ff 25%, #327087ff 75%)',
                color: 'white',
                py: { xs: 6, md: 8 }
            }}
        >
            <Container maxWidth="lg" sx={{px: { xs: 2, sm: 3 }}}>
                <Grid container spacing={4} alignItems="center" justifyContent="center">
                    {/* COLUMNA 1: IMAGEN DEL DOCTOR */}
                    <Grid 
                        xs={12}
                        md={6}
                        order={{ xs: 1, md: 2 }}
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            mb: { xs: 3, md: 0 },
                            mt: {xs: 3, md: 0},
                            px: {xs: 0, md:2}
                        }}
                    >
                        <Box
                            component="img"
                            src={data?.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=500&fit=crop'}
                            alt="Dr. Marcos Gomez - Traumatólogo"
                            sx={{
                                width: '100%',
                                maxWidth: { xs: '280px', sm: '350px', md: '450px' },
                                height: 'auto',
                                borderRadius: 4,
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)',
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: { md: 'scale(1.02)' }
                                }
                            }}
                        />
                    </Grid>

                    {/* COLUMNA 2: TEXTO Y BOTÓN */}
                    <Grid 
                        xs={12}
                        md={6}
                        order={{ xs: 2, md: 1 }}
                        sx={{ 
                            textAlign: { xs: 'center', md: 'left' }, 
                            px: {xs: 0, md:2}
                        }}
                    >
                        <Typography 
                            variant="h1" 
                            component="h1"
                            sx={{ 
                                fontWeight: 700,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                            }}
                        >
                            {data?.title || 'Dr. Marcos Gomez'}
                        </Typography>
                        
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                mb: 3,
                                fontWeight: 400,
                                fontSize: { xs: '1.2rem', sm: '1.5rem' }
                            }}
                        >
                            {data?.subtitle || 'Médico Traumatólogo'}
                        </Typography>
                        
                        <Typography 
                            variant="body1" 
                            sx={{ 
                                mb: 4, 
                                fontSize: '1.1rem',
                                lineHeight: 1.8,
                                maxWidth: '500px',
                                mx: { xs: 'auto', md: 0 }
                            }}
                        >
                            {data?.paragraph || 'Especialista en tratamiento de lesiones músculo-esqueléticas, fracturas y cirugía ortopédica. Atención personalizada y resultados comprobados.'}
                        </Typography>
                        
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: { xs: 'center', md: 'flex-start' } 
                        }}>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={scrollToAppointment}
                                startIcon={<CalendarMonthIcon />}
                                sx={{
                                    bgcolor: 'white',
                                    color: '#667eea',
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    '&:hover': {
                                        bgcolor: '#f0f0f0',
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.3s'
                                    }
                                }}
                            >
                                Reservar Cita
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};