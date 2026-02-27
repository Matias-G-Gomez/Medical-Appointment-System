import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_URL } from '../config';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [citas, setCitas] = useState([]);
  const [obrasSociales, setObrasSociales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar las obras Sociales desde el backend al iniciar
  useEffect(() => {
    cargarObrasSociales();
    
    // Solo carga citas si hay un usuario logueado
    const token = localStorage.getItem('token');
    if (token) {
      cargarCitas();
    } else {
      setLoading(false);
    }
  }, []);

  // Función para cargar citas desde el backend
  const cargarCitas = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No hay token, no se cargan citas');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/citas`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCitas(data);
      } else {
        console.error('Error al cargar citas');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar obras sociales desde el backend
  const cargarObrasSociales = async () => {
    try {
      const response = await fetch(`${API_URL}/api/obras-sociales`);

      if (response.ok) {
        const data = await response.json();
        setObrasSociales(data);
      } else {
        console.error('Error al cargar obras sociales');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
    }
  };

  // Agrega una nueva cita (público, no requiere login)
  const agregarCita = async (nuevaCita) => {
    try {
      const response = await fetch(`${API_URL}/api/citas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevaCita)
      });

      const data = await response.json();

      if (response.ok) {
        // Solo agregar al estado si hay un token (usuario logueado)
        const token = localStorage.getItem('token');
        if (token) {
          setCitas(prev => [data.cita, ...prev]);
        }
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Error al crear la cita' };
      }

    } catch (error) {
      console.error('Error al agregar cita:', error);
      return { success: false, message: 'Error al conectar con el servidor' };
    }
  };

  // Actualiza el estado de una cita
  const actualizarEstadoCita = (id, nuevoEstado) => {
    setCitas(prev =>
      prev.map(cita =>
        cita._id === id ? { ...cita, estado: nuevoEstado } : cita
      )
    );
  };

  // Agrega una nueva obra social
  const agregarObraSocial = async (nombre) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_URL}/api/obras-sociales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nombre })
      });

      if (response.ok) {
        const data = await response.json();
        setObrasSociales(prev => [...prev, data.obraSocial]);
      } else {
        const error = await response.json();
        console.error('Error al agregar obra social:', error.message);
      }

    } catch (error) {
      console.error('Error al conectar con el backend:', error);
    }
  };

  // Elimina una obra social
  const eliminarObraSocial = async (id) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_URL}/api/obras-sociales/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setObrasSociales(prev => prev.filter(os => os._id !== id));
      } else {
        console.error('Error al eliminar obra social');
      }

    } catch (error) {
      console.error('Error al conectar con el backend:', error);
    }
  };

  // Verifica si una fecha/hora está disponible
  const isDateTimeAvailable = async (fecha, hora) => {
    try {
      const response = await fetch(`${API_URL}/api/citas/disponibilidad?fecha=${fecha}&hora=${hora}`);
      
      if (response.ok) {
        const data = await response.json();
        return data.disponible;
      }
      
      return false;
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      citas,
      obrasSociales,
      setObrasSociales,
      loading,
      agregarCita,
      actualizarEstadoCita,
      agregarObraSocial,
      eliminarObraSocial,
      isDateTimeAvailable,
      cargarCitas,
      cargarObrasSociales
    }}>
      {children}
    </AppContext.Provider>
  );
};