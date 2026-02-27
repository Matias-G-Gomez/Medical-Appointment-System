import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Grid, 
    Link,
    useMediaQuery,
    useTheme
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export const Contact = ({ data }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
        <Box
            component="footer"
            id="contact"
            sx={{ 
                bgcolor: '#1e3a8a', 
                color: '#ffffff', 
                py: 2,
                borderTop: '1px solid #e5e7eb'
            }}
        >
            <Container maxWidth="lg">
                {isMobile ? (
                    <Box sx={{ mt: 1 }}>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: 1, 
                            mb: 1.5,
                            minHeight: '70px'
                        }}>
                            <LocationOnIcon sx={{ fontSize: 28, color: '#93c5fd', mt: 0.5, flexShrink: 0 }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                                    Dirección
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: '0.85rem', lineHeight: 1.4 }}>
                                    Tte. Gral. Juan Domingo Perón 4190<br />
                                    C1199 - CABA, Buenos Aires, Argentina
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: 1, 
                            mb: 1.5,
                            minHeight: '70px'
                        }}>
                            <PhoneIcon sx={{ fontSize: 28, color: '#34d399', mt: 0.5, flexShrink: 0 }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                                    Contacto
                                </Typography>
                                <Link href="mailto:consultas@drgomez.com.ar" sx={{ 
                                    color: '#d1d5db', 
                                    textDecoration: 'none', 
                                    fontSize: '0.85rem', 
                                    display: 'block',
                                    lineHeight: 1.4,
                                    '&:hover': { color: '#93c5fd' } 
                                }}>
                                    consultas@drgomez.com.ar
                                </Link>
                                <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: '0.85rem', lineHeight: 1.4 }}>
                                    +54 11 4959-0200
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-start', 
                            gap: 1, 
                            mb: 1.5,
                            minHeight: '70px'
                        }}>
                            <AccessTimeIcon sx={{ fontSize: 28, color: '#a78bfa', mt: 0.5, flexShrink: 0 }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.95rem' }}>
                                    Horarios
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: '0.85rem', lineHeight: 1.4 }}>
                                    Lunes a Viernes: 9:00 - 18:00<br />
                                    <span style={{ color: '#9ca3af' }}>Con cita previa</span>
                                </Typography>
                            </Box>
                        </Box>
                        
                        <Box sx={{ height: 150, width: '100%', borderRadius: 1, overflow: 'hidden', border: '1px solid #4b5563' }}>
                            <iframe
                                title="Ubicación"
                                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d420342.2652363265!2d-58.4266663!3d-34.6060846!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca6665a52ca5%3A0xa08481f63a95b599!2sHospital%20Italiano%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1759007096914!5m2!1ses-419!2sar"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'brightness(0.95)' }}
                                allowFullScreen=""
                                loading="lazy"
                            />
                        </Box>
                    </Box>
                ) : (
                    <Grid container spacing={3} sx={{ mt: 0.5, justifyContent: 'center' }}>
                        <Grid xs={12} sm={6} md={3}>
                            <Box sx={{ mb: 1, textAlign: 'center' }}>
                                <LocationOnIcon sx={{ fontSize: 32, color: '#93c5fd', mb: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#ffffff', fontSize: '1rem' }}>
                                    Dirección
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.6, color: '#d1d5db', fontSize: '0.85rem' }}>
                                    Tte. Gral. Juan Domingo Perón 4190<br />
                                    C1199 - CABA, Buenos Aires, Argentina
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid xs={12} sm={6} md={3}>
                            <Box sx={{ mb: 1, textAlign: 'center' }}>
                                <PhoneIcon sx={{ fontSize: 32, color: '#34d399', mb: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#ffffff', fontSize: '1rem' }}>
                                    Contacto
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 0.5 }}>
                                    <Link href="mailto:consultas@drgomez.com.ar" sx={{ color: '#d1d5db', textDecoration: 'none', fontSize: '0.85rem', '&:hover': { color: '#93c5fd' } }}>
                                        consultas@drgomez.com.ar
                                    </Link>
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#d1d5db', fontSize: '0.85rem' }}>
                                    +54 11 4959-0200
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid xs={12} sm={6} md={3}>
                            <Box sx={{ mb: 1, textAlign: 'center' }}>
                                <AccessTimeIcon sx={{ fontSize: 32, color: '#a78bfa', mb: 1 }} />
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: '#ffffff', fontSize: '1rem' }}>
                                    Horarios
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.6, color: '#d1d5db', fontSize: '0.85rem' }}>
                                    Lunes a Viernes<br />
                                    9:00 - 18:00<br />
                                    <span style={{ color: '#9ca3af' }}>Con cita previa</span>
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid xs={12} sm={6} md={3}>
                            <Box sx={{ height: 150, width: '100%', borderRadius: 1, overflow: 'hidden', border: '1px solid #4b5563', textAlign: 'center' }}>
                                <iframe
                                    title="Ubicación"
                                    src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d420342.2652363265!2d-58.4266663!3d-34.6060846!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcca6665a52ca5%3A0xa08481f63a95b599!2sHospital%20Italiano%20de%20Buenos%20Aires!5e0!3m2!1ses-419!2sar!4v1759007096914!5m2!1ses-419!2sar"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, filter: 'brightness(0.95)' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                )}

                <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #4b5563', textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.8rem' }}>
                        © 2025 Dr. Marcos Gómez - Traumatología y Ortopedia. Todos los derechos reservados.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};