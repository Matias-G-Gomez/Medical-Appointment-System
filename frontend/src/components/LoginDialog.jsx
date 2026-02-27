import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Alert,
    IconButton,
    InputAdornment,
    Typography,
    Paper,
    CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { API_URL } from '../config';

export const LoginDialog = ({ open, onClose, onLogin }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            // Llamo al back con fetch
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: credentials.email,
                    password: credentials.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Guarda token y usuario en localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                // Llama a la función onLogin del componente padre
                onLogin(data.user, data.token);
                
                // Cierra el diálogo
                onClose();
                
                // Limpia campos
                setCredentials({ email: '', password: '' });
                setError('');
            } else {
                setError(data.message || 'Credenciales inválidas');
            }
        } catch (error) {
            console.error('Error en login:', error);
            setError('Error al conectar con el servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                    Acceso al Sistema
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
        
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    onKeyDown={handleKeyPress}
                    disabled={loading}
                    sx={{ mb: 2, mt: 1 }}
                    slotProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <PersonIcon />
                            </InputAdornment>
                        )
                    }}
                />
                
                <TextField
                    fullWidth
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    onKeyDown={handleKeyPress}
                    disabled={loading}
                    sx={{ mb: 3 }}
                    slotProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleLogin}
                    disabled={loading}
                    sx={{ mb: 2 }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
                </Button>
                
                <Paper elevation={0} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    <Typography variant="caption">
                        <strong>Acceso Restringido</strong><br/>
                        Dr. Marcos Gómez y secretarias<br/>
                    </Typography>
                </Paper>
            </DialogContent>
        </Dialog>
    );
};