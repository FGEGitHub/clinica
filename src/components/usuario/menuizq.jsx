import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupIcon from '@mui/icons-material/Group';
import NfcIcon from '@mui/icons-material/Nfc';
import { useState, useEffect } from "react";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Navbar from './Navbar';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';



const initialWidth = 240; // Ancho inicial del menú
export default function MenuIzq2 ({children}) {
    const navigate = useNavigate();
  
    const [notificaciones, setNotificaciones] = useState();
    const [notificacioneslegajos, setNotificacioneslegajos] = useState();
    const [notificacionescbus, setNotificacionescbus] = useState();
    const [user, setUser] = useState();
    const [drawerWidth, setDrawerWidth] = useState(initialWidth);
    const [resizing, setResizing] = useState(false);
    const [menuVisible, setMenuVisible] = useState(true);
    ///////////////
///Funciones para ajustar el ancho 
const handleMouseDown = () => {
  setResizing(true);
};

const handleMouseMove = (e) => {
  if (resizing) {
    const newWidth = Math.max(200, Math.min(e.clientX, 500)); // Limita entre 200 y 500px
    setDrawerWidth(newWidth);
  }
};

const handleMouseUp = () => {
  setResizing(false);
};
useEffect(() => {
  if (resizing) {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  } else {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }
  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };
}, [resizing]);
    ///////////
    useEffect(() => {
      const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
      const useer = JSON.parse(loggedUserJSON)
      setUser(useer)

  }, [])
 
    const handleClick = (path) => {
        
        navigate(path);
      }; 
    

       const hanleLogout = () => {
       /* console.log('click')
        setUser(null)
        servicioUsuario.setToken(user.token) */
        window.localStorage.removeItem('loggedNoteAppUser')
        window.location.reload(true);
      } 
    const menuItems = [
        { 
          text: 'Ver Clientes', 
          icon: <GroupIcon style={{ color: "#1a303e" }} />, 
          path: '/usuario/clientes' 
        },
    
        {
          text: 'pacientes',
          icon: <NfcIcon style={{ color: "#1a303e" }} />,
          path:  '/usuario/pacientes',
        }
       
      ];

      const menuItems2 = [
     
         {
           text: 'Pacientes',
           icon: <NfcIcon color="primary" />,
           path:  '/usuario/pacientes',
         },
           {
           text: 'Pacientes',
           icon: <NfcIcon color="primary" />,
           path:  '/usuario/pacientes',
         }
         
         
      
       ];


    /*const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };
    return(
      <>
      <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          {menuVisible && (
              <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                },
              }}
              variant="permanent"
              anchor="left"
              >
                  <Navbar />
                  <Toolbar />
                
                  <List>
                  <Button variant="contained" onClick={toggleMenu} sx={{ mb: 2, backgroundColor: '#114c5f', '&:hover': { backgroundColor: '#0d3a49' } }}>
                  {menuVisible ? 'Ocultar Menú' : 'Mostrar Menú'}
              </Button>
          {user ? <>
          {user.nivel === 2 ? <> 
            {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => {
                handleClick(item.path)
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          </>: <>
          {menuItems2.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => {
                handleClick(item.path)
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          
          </>}
          </> :  <></>}
        </List>
                  
              </Drawer>
          )}

          <Box
              component="main"
              sx={{
                  flexGrow: 1,
                  bgcolor: 'background.default',
                  p: 3,
                 // marginLeft: menuVisible ? `${drawerWidth}px` : '0',
                  transition: 'margin 0.3s ease-in-out',
              }}
          >
              <Navbar />
              <Toolbar />
           
              {children}
          </Box>
      </Box>
  </>
  );*/
  const toggleMenu = () => {
  setMenuVisible(!menuVisible);
};

return (
  <>
    <Box sx={{background: '#fffff', display: 'flex'}}>
      <CssBaseline />

      {/* Drawer lateral */}
      {menuVisible && (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
             
              bgcolor: '#fffff',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Navbar />
          <Toolbar />
          <Divider />
          <List sx={{background: '#fffff'}}>
            {/* Botón solo dentro del Drawer cuando el menú está visible */}
           <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
  <IconButton
    onClick={toggleMenu}
    sx={{
      color: '#1a303e',
      '&:hover': {
        backgroundColor: 'transparent',
        color: '#0d3a49',
      },
    }}
  >
    <CloseIcon />
  </IconButton>
</Box>


            {user ? (
              user.nivel === 2 ? (
                menuItems.map((item) => (
                  <ListItem
                    button
                    key={item.text}
                    onClick={() => handleClick(item.path)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))
              ) : (
                menuItems2.map((item) => (
                  <ListItem
                    button
                    key={item.text}
                    onClick={() => handleClick(item.path)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItem>
                ))
              )
            ) : null}
          </List>
          <Divider />
        </Drawer>
      )}

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          transition: 'margin 0.3s ease-in-out',
        }}
      >
        <Navbar />
        <Toolbar />

        {/* Mostrar botón SOLO cuando el menú está oculto */}
        {!menuVisible && (
          <Button
            variant="contained"
            onClick={toggleMenu}
            sx={{
              mb: 2,
              backgroundColor: '#1a303e',
              '&:hover': { backgroundColor: '#0d3a49' },
            }}
          >
            Mostrar Menú
          </Button>
        )}

        {children}
      </Box>
    </Box>
  </>
);


}