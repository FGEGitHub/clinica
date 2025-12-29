import * as React from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  AppBar,
  useMediaQuery,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import GroupIcon from '@mui/icons-material/Group';
import NfcIcon from '@mui/icons-material/Nfc';

import { useState, useEffect } from "react";
import Navbar from './Navbar';

const drawerWidth = 240;

export default function MenuIzq2({ children }) {
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:900px)');
  const [menuOpen, setMenuOpen] = useState(!isMobile);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setMenuOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser');
    if (loggedUserJSON) {
      setUser(JSON.parse(loggedUserJSON));
    }
  }, []);

  const handleClick = (path) => {
    navigate(path);
    if (isMobile) setMenuOpen(false); // UX clave
  };

  const menuItemsNivel2 = [
    { text: 'Ver Clientes', icon: <GroupIcon />, path: '/usuario/clientes' },
    { text: 'Pacientes', icon: <NfcIcon />, path: '/usuario/pacientes' },
  ];

  const menuItemsNivel1 = [
    { text: 'Pacientes', icon: <NfcIcon />, path: '/usuario/pacientes' },
    { text: 'Turnos', icon: <NfcIcon />, path: '/usuario/turnos' },
  ];

  const menuItems =
    user?.nivel === 2 ? menuItemsNivel2 : menuItemsNivel1;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f6f8', minHeight: '100vh' }}>
      <CssBaseline />

      {/* ===== APPBAR MOBILE ===== */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={1}
          sx={{
            bgcolor: '#1a303e',
            color: '#fff',
            borderBottom: '1px solid #e0e0e0',
          }}
        >
          <Toolbar>
            <IconButton edge="start" onClick={() => setMenuOpen(true)}>
              <MenuIcon   sx={{bgcolor: '#1a303e',
            color: '#fff', }}/>
            </IconButton>
            <Box sx={{ fontWeight: 600, fontSize: 16 }}>
              Menu
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* ===== DRAWER ===== */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#fff',
          },
        }}
      >
        {!isMobile && <Navbar />}
        <Toolbar />
        <Divider />

        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => handleClick(item.path)}
              sx={{
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
                '&:hover': {
                  bgcolor: '#f0f4f7',
                },
              }}
            >
              <ListItemIcon sx={{ color: '#1a303e' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* ===== CONTENIDO ===== */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: isMobile ? '64px' : 0,
        }}
      >
        {!isMobile && <Navbar />}
        {children}
      </Box>
    </Box>
  );
}
