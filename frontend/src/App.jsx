import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { LoginDialog } from './components/LoginDialog';
import { AdminPanel } from './components/AdminPanel';
import { Header } from './components/Header';
import { About } from './components/About';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import Appointment from './components/Appointment';
import { AppProvider, useAppContext } from './context/AppContext';
import JsonData from './data/data.json';
import './App.css';

// Componente para la Landing Page
const LandingPage = ({ landingPageData, scrollToAppointment, appointmentRef }) => {
    return (
    <>
        <Header data={landingPageData.Header} scrollToAppointment={scrollToAppointment} />
        <About data={landingPageData.About} />
        <Services data={landingPageData.Services} />
        <Appointment ref={appointmentRef} data={landingPageData.Appointment} />
        <Contact data={landingPageData.Contact} />
    </>
    );
};

// Componente para proteger rutas (solo usuarios autenticados)
const ProtectedRoute = ({ user, children }) => {
    if (!user) {
    return <Navigate to="/" replace />;
    }
    return children;
};

// Componente interno que tiene acceso al contexto
const AppContent = () => {
    const { cargarCitas } = useAppContext();
    const [landingPageData, setLandingPageData] = useState({});
    const [loginOpen, setLoginOpen] = useState(false);
    const [user, setUser] = useState(null);
    const appointmentRef = useRef(null);
    
    useEffect(() => {
        setLandingPageData(JsonData);
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            cargarCitas();
        }
    }, []);

    const handleLogin = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token); 
        setLoginOpen(false);
        
        setTimeout(() => {
            cargarCitas();
        }, 100);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const scrollToAppointment = () => {
        if (appointmentRef.current) {
            appointmentRef.current.scrollIntoView({ behavior: 'smooth' });
        } else {
            const element = document.querySelector('#appointment');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <Router>
            <div className="App" style={{ backgroundColor: '#f5f7fa', fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}>
                <Navigation 
                    data={landingPageData.Navigation}
                    onLoginClick={() => setLoginOpen(true)}
                    onLogout={handleLogout}
                    user={user}
                    scrollToAppointment={scrollToAppointment}
                />
                
                <LoginDialog
                    open={loginOpen}
                    onClose={() => setLoginOpen(false)}
                    onLogin={handleLogin}
                />

                <Routes>
                    {/* Ruta principal - Landing Page */}
                    <Route 
                        path="/" 
                        element={
                            <LandingPage 
                                landingPageData={landingPageData}
                                scrollToAppointment={scrollToAppointment}
                                appointmentRef={appointmentRef}
                            />
                        } 
                    />

                    {/* Ruta para el panel admin - Solo accesible si está logueado */}
                    <Route 
                        path="/admin" 
                        element={
                            <ProtectedRoute user={user}>
                                <AdminPanel user={user} onClose={() => window.location.href = '/'} />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Redireccionar cualquier ruta no encontrada a la principal */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
};

// Componente principal que provee el contexto
const App = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
}

export default App;