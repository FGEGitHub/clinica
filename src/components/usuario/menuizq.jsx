import * as React from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Drawer,
  Toolbar,
  List,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  AppBar,
  useMediaQuery,
} from "@mui/material";
import serviciousuarios from "../../services/usuarios";
import MenuIcon from "@mui/icons-material/Menu";
import GroupIcon from "@mui/icons-material/Group";
import NfcIcon from "@mui/icons-material/Nfc";

import { useState, useEffect } from "react";

import Navbar from "./Navbar";

const drawerWidth = 240;

export default function MenuIzq2({ children }) {
  const navigate = useNavigate();

  const isMobile = useMediaQuery("(max-width:900px)");
const [colorNav, setColorNav] = useState("#1a303e");
const [colorFondo, setColorFondo] = useState("#f5f6f8");
  const [menuOpen, setMenuOpen] = useState(!isMobile);
  const [user, setUser] = useState(null);
const [config, setConfig] = useState({
  color_nav: "#1a303e",
  color_fondo: "#f5f6f8",
});
  useEffect(() => {
    setMenuOpen(!isMobile);
  }, [isMobile]);

 useEffect(() => {
  traerDatos();
}, []);

const traerDatos = async () => {
  const loggedUserJSON =
    window.localStorage.getItem("loggedNoteAppUser");

  if (!loggedUserJSON) return;

  const usuario = JSON.parse(loggedUserJSON);

  setUser(usuario);

  try {
    const datos = await serviciousuarios.traerusuario(
      usuario.usuario
    );

    if (datos && datos[0]) {
      setConfig({
        color_nav: datos[0].color_nav || "#1a303e",
        color_fondo: datos[0].color_fondo || "#f5f6f8",
      });
    }
  } catch (error) {
    console.error(error);
  }
};

  const handleClick = (item) => {
    // abrir en nueva pestaña
    if (item.newTab) {
      window.open(item.path, "_blank");
      return;
    }

    navigate(item.path);

    if (isMobile) {
      setMenuOpen(false);
    }
  };

  const menuItemsNivel2 = [
    {
      text: "Ver Clientes",
      icon: <GroupIcon />,
      path: "/usuario/clientes",
    },
    {
      text: "Pacientes",
      icon: <NfcIcon />,
      path: "/usuario/pacientes",
    },
  ];

  const menuItemsNivel1 = [
    {
      text: "Pacientes",
      icon: <NfcIcon />,
      path: "/usuario/pacientes",
    },
    {
      text: "Turnos",
      icon: <NfcIcon />,
      path: "/usuario/turnos",
    },
    {
      text: "Ir a Calendario publico",
      icon: <NfcIcon />,
      path: "/calendariopublico",
      
    },
      {
      text: "Perfil",
      icon: <NfcIcon />,
      path: "/usuario/perfil",
     
    },
       {
      text: "Config parametros",
      icon: <NfcIcon />,
      path: "/usuario/parametros",
     
    },
  ];

  const menuItems =
    user?.nivel === 2
      ? menuItemsNivel2
      : menuItemsNivel1;

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* ===== APPBAR MOBILE ===== */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={1}
          sx={{
            bgcolor: "#1a303e",
            color: "#fff",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setMenuOpen(true)}
              sx={{
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.12)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                },
              }}
            >
              <MenuIcon sx={{ color: "#fff" }} />
            </IconButton>

            <Box
              sx={{
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Menu
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* ===== DRAWER ===== */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#fff",
            borderRight: "1px solid #e5e7eb",
          },
        }}
      >
        {!isMobile && <Navbar colorNav={config.color_nav} />}

        <Toolbar />

        <Divider />

        <List sx={{ pt: 3 }}>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={() => handleClick(item)}
              sx={{
                borderRadius: 2,
                mx: 1.5,
                mb: 1,
                py: 1.2,
                cursor: "pointer",
                transition: "all 0.25s ease",

                "&:hover": {
                  bgcolor: "#f0f4f7",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#1a303e",
                  minWidth: 42,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>

      {/* ===== CONTENIDO ===== */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: {
            xs: 2,
            sm: 3,
          },
     bgcolor: config.color_fondo || "#f5f6f8",
          color: "#1a303e",
          width: "100%",
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}