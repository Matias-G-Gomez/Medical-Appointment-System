import React, { useState, useEffect, forwardRef } from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    TextField, 
    Button, 
    MenuItem,
    Grid,
    CircularProgress
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import { useAppContext } from '../context/AppContext';

const Appointment = forwardRef(({ data }, ref) => {
    const { obrasSociales, agregarCita, isDateTimeAvailable } = useAppContext();
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        correoElectronico: '',
        obraSocial: '',
        motivo: '',
        fechaCita: null,
        horaCita: ''
    });
    
    // Estado para trackear horarios ocupados
    const [horariosOcupados, setHorariosOcupados] = useState([]);
    const [cargandoHorarios, setCargandoHorarios] = useState(false);

    const services = [
        'Traumatología Deportiva',
        'Cirugía Ortopédica',
        'Fracturas y Lesiones',
        'Artroscopía',
        'Prótesis Articulares',
        'Rehabilitación'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value, fechaCita: null, horaCita: '' }));
        setHorariosOcupados([]); // Limpiar horarios ocupados al cambiar el motivo
    };

    // Cargar horarios ocupados cuando se selecciona una fecha
    const handleDateChange = async (date) => {
        setFormData(prev => ({ ...prev, fechaCita: date, horaCita: '' }));
        
        if (date) {
            setCargandoHorarios(true);
            const fechaStr = date.toISOString().split('T')[0];
            const ocupados = [];
            
            // Obtener horarios según el motivo (si no hay motivo, usar todos)
            const motivoActual = formData.motivo || 'Traumatología Deportiva';
            const horasDisponibles = getAvailableHours(motivoActual);
            
            // Verificar disponibilidad de cada horario
            for (const hora of horasDisponibles) {
                const disponible = await isDateTimeAvailable(fechaStr, hora);
                console.log(`Fecha: ${fechaStr}, Hora: ${hora}, Disponible: ${disponible}`);
                if (!disponible) {
                    ocupados.push(hora);
                }
            }
            
            console.log('Horarios ocupados:', ocupados);
            setHorariosOcupados(ocupados);
            setCargandoHorarios(false);
        } else {
            // Si no hay fecha, limpiar horarios ocupados
            setHorariosOcupados([]);
        }
    };

    // Recargar horarios cuando cambia el motivo y hay una fecha seleccionada
    useEffect(() => {
        if (formData.fechaCita && formData.motivo) {
            handleDateChange(formData.fechaCita);
        }
    }, [formData.motivo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.nombre || !formData.apellido || !formData.telefono || 
            !formData.correoElectronico || !formData.obraSocial || !formData.motivo ||
            !formData.fechaCita || !formData.horaCita) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }

        const nuevaCita = {
            nombre: formData.nombre,
            apellido: formData.apellido,
            telefono: formData.telefono,
            correoElectronico: formData.correoElectronico,
            obraSocial: formData.obraSocial,
            motivo: formData.motivo,
            fecha: formData.fechaCita.toISOString().split('T')[0],
            hora: formData.horaCita,
            fechaSolicitud: new Date().toISOString()
        };

        try {
            await agregarCita(nuevaCita);
            
            setFormData({
                nombre: '',
                apellido: '',
                telefono: '',
                correoElectronico: '',
                obraSocial: '',
                motivo: '',
                fechaCita: null,
                horaCita: ''
            });
            setHorariosOcupados([]);

            alert('¡Cita solicitada con éxito! Recibirá un email cuando el médico confirme su cita.');
        } catch (error) {
            console.error('Error:', error);
            if (error.message === 'El horario ya está ocupado') {
                alert('Lo sentimos, el horario seleccionado ya fue tomado por otro paciente. Por favor actualice la página y elija otro horario.');
            } else {
                alert('Error al solicitar la cita. Por favor intente nuevamente.');
            }
        }
    };

    const today = new Date();
    const twoWeeksLater = new Date(today);
    twoWeeksLater.setDate(today.getDate() + 14);

    const isWeekend = (date) => {
        const day = date.getDay();
        return day === 0 || day === 6;
    };

    const getAvailableHours = (motivo) => {
        // Todos los motivos tienen los mismos horarios disponibles
        return ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'];
    };

    const isDateAvailable = (date) => {
        return !isWeekend(date);
    };

    return (
        <Box ref={ref} id="appointment" sx={{ py: 8, bgcolor: '#fff' }}>
            <Container maxWidth="md">
                <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 700, color: '#1e3a8a', mb: 8, fontSize: { xs: '2rem', md: '3rem' } }}>
                    Reservar Cita
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, bgcolor: '#fff', borderRadius: 8, boxShadow: 1 }}>
                    <TextField
                        fullWidth
                        name="nombre"
                        label="Nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        name="apellido"
                        label="Apellido"
                        value={formData.apellido}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        name="telefono"
                        label="Teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        name="correoElectronico"
                        label="Correo Electrónico"
                        type="email"
                        value={formData.correoElectronico}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        select
                        fullWidth
                        name="obraSocial"
                        label="Obra Social"
                        value={formData.obraSocial}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    >
                        {obrasSociales.map((os) => (
                            <MenuItem key={os._id || os.id} value={os.nombre}>
                                {os.nombre}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        name="motivo"
                        label="Motivo de la Cita"
                        value={formData.motivo}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    >
                        {services.map((service) => (
                            <MenuItem key={service} value={service}>
                                {service}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={{ mb: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                            <DatePicker
                                label="Fecha de Cita *"
                                value={formData.fechaCita}
                                onChange={handleDateChange}
                                minDate={today}
                                maxDate={twoWeeksLater}
                                shouldDisableDate={(date) => !isDateAvailable(date)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        required: true
                                    }
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                    
                    {formData.fechaCita && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                Seleccione un horario *
                            </Typography>
                            {cargandoHorarios ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                                    <CircularProgress size={30} />
                                </Box>
                            ) : (
                                <Grid container spacing={1} sx={{ justifyContent: 'center' }}>
                                    {getAvailableHours(formData.motivo).map((hora) => (
                                        <Grid item key={hora}>
                                            <Button
                                                variant={formData.horaCita === hora ? 'contained' : 'outlined'}
                                                color="primary"
                                                onClick={() => setFormData(prev => ({ ...prev, horaCita: hora }))}
                                                sx={{ 
                                                    textTransform: 'none',
                                                    '&.Mui-disabled': {
                                                        backgroundColor: '#e0e0e0',
                                                        color: '#9e9e9e',
                                                        borderColor: '#bdbdbd'
                                                    }
                                                }}
                                                disabled={horariosOcupados.includes(hora)}
                                            >
                                                {hora}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                            {!cargandoHorarios && horariosOcupados.length > 0 && (
                                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary', textAlign: 'center' }}>
                                    Los horarios en gris ya están ocupados
                                </Typography>
                            )}
                        </Box>
                    )}
                    
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 1, width: '100%' }}>
                        Solicitar Cita
                    </Button>
                </Box>
            </Container>
        </Box>
    );
});

export default Appointment;