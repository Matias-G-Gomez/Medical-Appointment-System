import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  MenuItem
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { useAppContext } from '../context/AppContext';
import { API_URL } from '../config';

export const AdminPanel = ({ user, onClose }) => {
  const { citas, obrasSociales, setObrasSociales, eliminarObraSocial, cargarCitas } = useAppContext();
  
  // Estados
  const [tabValue, setTabValue] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [nuevaObraSocial, setNuevaObraSocial] = useState('');
  const [editandoObraSocial, setEditandoObraSocial] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    name: '',
    email: '',
    password: '',
    role: 'secretary'
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Cargar usuarios al montar (solo si es admin)
  useEffect(() => {
    if (user.role === 'admin') {
      cargarUsuarios();
    }
  }, [user.role]);

  // FUNCIONES DE USUARIOS 

  const cargarUsuarios = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else if (response.status === 403) {
        console.log('No tienes permisos para ver usuarios');
      } else {
        console.error('Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
    }
  };

  const handleCrearUsuario = async () => {
    const token = localStorage.getItem('token');

    // Validaciones
    if (!nuevoUsuario.name || !nuevoUsuario.email || !nuevoUsuario.password) {
      setSnackbar({
        open: true,
        message: 'Todos los campos son obligatorios',
        severity: 'error'
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(nuevoUsuario)
      });

      const data = await response.json();

      if (response.ok) {
        setUsuarios([...usuarios, data.user]);
        setNuevoUsuario({
          name: '',
          email: '',
          password: '',
          role: 'secretary'
        });
        setUserDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Usuario creado exitosamente',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: data.message || 'Error al crear usuario',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al crear usuario:', error);
      setSnackbar({
        open: true,
        message: 'Error al conectar con el servidor',
        severity: 'error'
      });
    }
  };

  const handleEliminarUsuario = async (id, name) => {
    if (!window.confirm(`¿Seguro que desea eliminar al usuario "${name}"?`)) {
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUsuarios(usuarios.filter(u => u._id !== id));
        setSnackbar({
          open: true,
          message: 'Usuario eliminado exitosamente',
          severity: 'success'
        });
      } else {
        const data = await response.json();
        setSnackbar({
          open: true,
          message: data.message || 'Error al eliminar usuario',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setSnackbar({
        open: true,
        message: 'Error al conectar con el servidor',
        severity: 'error'
      });
    }
  };

  // FUNCIONES DE CITAS

  const handleConfirmarCita = async (cita) => {
    try {
      const response = await fetch(`${API_URL}/api/citas/${cita._id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estado: 'confirmada' })
      });

      if (response.ok) {
        await cargarCitas();
        setSnackbar({
          open: true,
          message: `Cita confirmada y email enviado a ${cita.correoElectronico}`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error al confirmar cita',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al confirmar cita:', error);
      setSnackbar({
        open: true,
        message: 'Error al conectar con el servidor',
        severity: 'error'
      });
    }
  };

  const handleCancelarCita = async (cita) => {
    try {
      const response = await fetch(`${API_URL}/api/citas/${cita._id}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ estado: 'cancelada' })
      });

      if (response.ok) {
        await cargarCitas();
        setSnackbar({
          open: true,
          message: `Cita cancelada y email enviado a ${cita.correoElectronico}`,
          severity: 'info'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error al cancelar cita',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al cancelar cita:', error);
      setSnackbar({
        open: true,
        message: 'Error al conectar con el servidor',
        severity: 'error'
      });
    }
  };

  // FUNCIONES DE OBRAS SOCIALES

  const handleAgregarObraSocial = async () => {
    if (!nuevaObraSocial.trim()) return;

    // Verificar duplicados
    const existe = obrasSociales.some(os => 
      os.nombre.toLowerCase() === nuevaObraSocial.trim().toLowerCase()
    );

    if (existe) {
      setSnackbar({
        open: true,
        message: 'Esta obra social ya existe',
        severity: 'error'
      });
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/api/obras-sociales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: nuevaObraSocial.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setObrasSociales([...obrasSociales, data.obraSocial]);
        setNuevaObraSocial('');
        setDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Obra social agregada exitosamente',
          severity: 'success'
        });
      } else {
        const error = await response.json();
        setSnackbar({
          open: true,
          message: error.message || 'Error al agregar obra social',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al agregar obra social:', error);
      setSnackbar({
        open: true,
        message: 'Error al conectar con el servidor',
        severity: 'error'
      });
    }
  };

  const handleEditarObraSocial = async () => {
    if (!nuevaObraSocial.trim()) return;

    // Verificar duplicados (excepto la que estoy editando)
    const existe = obrasSociales.some(os => 
      os._id !== editandoObraSocial._id && 
      os.nombre.toLowerCase() === nuevaObraSocial.trim().toLowerCase()
    );

    if (existe) {
      setSnackbar({
        open: true,
        message: 'Ya existe una obra social con ese nombre',
        severity: 'error'
      });
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/api/obras-sociales/${editandoObraSocial._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre: nuevaObraSocial.trim() })
      });

      if (response.ok) {
        const data = await response.json();
        setObrasSociales(obrasSociales.map(os => 
          os._id === editandoObraSocial._id ? data.obraSocial : os
        ));
        setNuevaObraSocial('');
        setEditandoObraSocial(null);
        setDialogOpen(false);
        setSnackbar({
          open: true,
          message: 'Obra social actualizada exitosamente',
          severity: 'success'
        });
      } else {
        const error = await response.json();
        setSnackbar({
          open: true,
          message: error.message || 'Error al actualizar obra social',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error al actualizar obra social:', error);
      setSnackbar({
        open: true,
        message: 'Error al conectar con el servidor',
        severity: 'error'
      });
    }
  };

  const handleEliminarObraSocial = (id, nombre) => {
    if (window.confirm(`¿Seguro que desea eliminar la obra social "${nombre}"?`)) {
      eliminarObraSocial(id);
      setSnackbar({
        open: true,
        message: 'Obra social eliminada exitosamente',
        severity: 'success'
      });
    }
  };


  const abrirDialogAgregarOS = () => {
    setEditandoObraSocial(null);
    setNuevaObraSocial('');
    setDialogOpen(true);
  };

  const abrirDialogEditarOS = (os) => {
    setEditandoObraSocial(os);
    setNuevaObraSocial(os.nombre);
    setDialogOpen(true);
  };

  const cerrarDialogOS = () => {
    setDialogOpen(false);
    setNuevaObraSocial('');
    setEditandoObraSocial(null);
  };

  const abrirDialogAgregarUsuario = () => {
    setNuevoUsuario({
      name: '',
      email: '',
      password: '',
      role: 'secretary'
    });
    setUserDialogOpen(true);
  };

  const cerrarDialogUsuario = () => {
    setUserDialogOpen(false);
    setNuevoUsuario({
      name: '',
      email: '',
      password: '',
      role: 'secretary'
    });
  };


  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Panel de Administración
          </Typography>
          <Button variant="outlined" onClick={onClose}>
            Volver al sitio
          </Button>
        </Box>

        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 4 }}>
          <Tab label={`Citas (${citas.filter(c => c.estado === 'pendiente').length} pendientes)`} />
          <Tab label={`Obras Sociales (${obrasSociales.length})`} />
          {user.role === 'admin' && <Tab label={`Usuarios (${usuarios.length})`} />}
        </Tabs>

        {/* CITAS */}
        {tabValue === 0 && (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Paciente</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Teléfono</TableCell>
                  <TableCell>Fecha Cita</TableCell>
                  <TableCell>Hora</TableCell>
                  <TableCell>Motivo</TableCell>
                  <TableCell>Obra Social</TableCell>
                  <TableCell align="center">Estado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {citas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Typography variant="body2" sx={{ py: 4, color: 'text.secondary' }}>
                        No hay citas registradas
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  citas.map((cita) => (
                    <TableRow key={cita._id}>
                      <TableCell>{cita.nombre} {cita.apellido}</TableCell>
                      <TableCell>{cita.correoElectronico}</TableCell>
                      <TableCell>{cita.telefono}</TableCell>
                      <TableCell>{cita.fecha || 'No definida'}</TableCell>
                      <TableCell>{cita.hora || 'No definida'}</TableCell>
                      <TableCell>{cita.motivo}</TableCell>
                      <TableCell>{cita.obraSocial}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={cita.estado}
                          color={cita.estado === 'pendiente' ? 'warning' : cita.estado === 'confirmada' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        {cita.estado === 'pendiente' && (
                          <>
                            <IconButton
                              color="success"
                              onClick={() => handleConfirmarCita(cita)}
                              title="Confirmar cita"
                            >
                              <CheckIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => handleCancelarCita(cita)}
                              title="Cancelar cita"
                            >
                              <CloseIcon />
                            </IconButton>
                          </>
                        )}
                        {cita.estado === 'confirmada' && (
                          <IconButton
                            color="error"
                            onClick={() => handleCancelarCita(cita)}
                            title="Cancelar cita"
                          >
                            <CloseIcon />
                          </IconButton>
                        )}
                        {cita.estado === 'cancelada' && (
                          <Typography variant="caption" color="text.secondary">
                            Cancelada
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* OBRAS SOCIALES */}
        {tabValue === 1 && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={abrirDialogAgregarOS}
              >
                Agregar Obra Social
              </Button>
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Nombre</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {obrasSociales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="body2" sx={{ py: 4, color: 'text.secondary' }}>
                          No hay obras sociales registradas
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    obrasSociales.map((os, index) => (
                      <TableRow key={os._id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{os.nombre}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => abrirDialogEditarOS(os)}
                            title="Editar obra social"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleEliminarObraSocial(os._id, os.nombre)}
                            title="Eliminar obra social"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* USUARIOS - SOLO ADMIN (Médico) */}
        {tabValue === 2 && user.role === 'admin' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={abrirDialogAgregarUsuario}
              >
                Agregar Usuario
              </Button>
            </Box>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell align="center">Rol</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuarios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" sx={{ py: 4, color: 'text.secondary' }}>
                          No hay usuarios registrados
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    usuarios.map((usuario) => (
                      <TableRow key={usuario._id}>
                        <TableCell>{usuario.name}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell align="center">
                          <Chip
                            icon={usuario.role === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                            label={usuario.role === 'admin' ? 'Admin' : 'Secretaria'}
                            color={usuario.role === 'admin' ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          {usuario.role !== 'admin' && (
                            <IconButton
                              color="error"
                              onClick={() => handleEliminarUsuario(usuario._id, usuario.name)}
                              title="Eliminar usuario"
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
                          {usuario.role === 'admin' && (
                            <Typography variant="caption" color="text.secondary">
                              Admin principal
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>

      {/* Dialog para agregar/editar obra social */}
      <Dialog open={dialogOpen} onClose={cerrarDialogOS}>
        <DialogTitle>
          {editandoObraSocial ? 'Editar Obra Social' : 'Agregar Nueva Obra Social'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Nombre de la Obra Social"
            value={nuevaObraSocial}
            onChange={(e) => setNuevaObraSocial(e.target.value)}
            sx={{ mt: 2 }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                editandoObraSocial ? handleEditarObraSocial() : handleAgregarObraSocial();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialogOS}>Cancelar</Button>
          <Button 
            onClick={editandoObraSocial ? handleEditarObraSocial : handleAgregarObraSocial} 
            variant="contained"
            disabled={!nuevaObraSocial.trim()}
          >
            {editandoObraSocial ? 'Guardar' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para agregar usuario */}
      <Dialog open={userDialogOpen} onClose={cerrarDialogUsuario}>
        <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre Completo"
            value={nuevoUsuario.name}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={nuevoUsuario.email}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            value={nuevoUsuario.password}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Rol"
            value={nuevoUsuario.role}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })}
          >
            <MenuItem value="secretary">Secretaria</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDialogUsuario}>Cancelar</Button>
          <Button 
            onClick={handleCrearUsuario} 
            variant="contained"
            disabled={!nuevoUsuario.name || !nuevoUsuario.email || !nuevoUsuario.password}
          >
            Crear Usuario
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          severity={snackbar.severity} 
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};