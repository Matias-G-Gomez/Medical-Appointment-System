import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
  Avatar,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export const Navigation = ({ data, onLoginClick, onLogout, user, scrollToAppointment }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToSection = (href, linkName) => {
    // Si estamos en /admin, primero volver a /
    if (window.location.pathname === '/admin') {
      navigate('/');
      setTimeout(() => {
        if (linkName === 'Reservar Cita') {
          scrollToAppointment();
        } else {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    } else {
      if (linkName === 'Reservar Cita') {
        scrollToAppointment();
      } else {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
    setMobileOpen(false);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAdminPanel = () => {
    handleMenuClose();
    navigate('/admin');
  };

  const handleLogout = () => {
    handleMenuClose();
    if (onLogout) onLogout();
    navigate('/');
  };

  // Drawer para móvil
  const drawer = (
    <Box 
      sx={{ 
        textAlign: 'center',
        bgcolor: '#1976d2',
        height: '100%',
        color: 'white'
      }}
    >
      <Typography variant="h6" sx={{ my: 2, color: 'white' }}>
        {data?.brand || 'Dr. Marcos Gómez'}
      </Typography>
      
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      
      <List>
        {data?.links?.map((link) => (
          <ListItem key={link.name} disablePadding>
            <ListItemButton 
              onClick={() => scrollToSection(link.href, link.name)}
              sx={{
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <ListItemText primary={link.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      
      <List>
        {user ? (
          <>
            <ListItem disablePadding>
              <ListItemButton onClick={handleAdminPanel} sx={{ justifyContent: 'center', color: 'white' }}>
                <ListItemText primary="Panel Admin" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout} sx={{ justifyContent: 'center', color: 'white' }}>
                <ListItemText primary="Cerrar Sesión" />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={onLoginClick} sx={{ justifyContent: 'center', color: 'white' }}>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: '#1976d2', boxShadow: 'none' }}>
        <Toolbar>
          <LocalHospitalIcon sx={{ mr: 1, color: 'white' }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              color: 'white',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            {data?.brand || 'Dr. Marcos Gómez'}
          </Typography>

          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {data?.links?.map((link) => (
                <Button
                  key={link.name}
                  onClick={() => scrollToSection(link.href, link.name)}
                  sx={{ 
                    mx: 1, 
                    color: 'white', 
                    fontSize: '0.875rem',
                    '&:hover': { 
                      color: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)'
                    } 
                  }}
                >
                  {link.name}
                </Button>
              ))}
              {user ? (
                <>
                  <Button
                    color="inherit"
                    startIcon={
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'white', color: '#1976d2' }}>
                        {user.name.charAt(0)}
                      </Avatar>
                    }
                    onClick={handleMenuOpen}
                    sx={{ color: 'white' }}
                  >
                    {user.name.split(' ')[0]}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleAdminPanel}>
                      <AdminPanelSettingsIcon sx={{ mr: 1 }} />
                      Panel Admin
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1 }} />
                      Cerrar Sesión
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<AccountCircleIcon />}
                  onClick={onLoginClick}
                  sx={{
                    borderColor: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          ) : (
            <IconButton
              color="inherit"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
          disableEnforceFocus: true
        }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};