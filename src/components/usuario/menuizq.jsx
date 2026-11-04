
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useMemo, createContext, useContext } from "react";

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
  Typography,
  Avatar,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Switch,
} from "@mui/material";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import GroupIcon from "@mui/icons-material/Group";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PublicIcon from "@mui/icons-material/Public";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LogoutIcon from "@mui/icons-material/Logout";

import serviciousuarios from "../../services/usuarios";

// CONTEXTO GLOBAL DEL TEMA
const PanelThemeContext = createContext();

export const usePanelTheme = () => useContext(PanelThemeContext);

const drawerWidth = 280;

export default function MenuIzq2({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useMediaQuery("(max-width:900px)");

  const [menuOpen, setMenuOpen] = useState(!isMobile);
  const [user, setUser] = useState(null);

  // ==============================
  // TEMA DIA / NOCHE
  // ==============================

  const [mode, setMode] = useState(
    () => localStorage.getItem("vita-theme") || "dark"
  );

  const isDark = mode === "dark";

  const toggleTheme = () => {
    setMode((prev) =>
      prev === "dark" ? "light" : "dark"
    );
  };

  useEffect(() => {
    localStorage.setItem("vita-theme", mode);
  }, [mode]);

  const colors = {
    background: isDark ? "#0f172a" : "#f1f5f9",
    sidebar: isDark ? "#0f172a" : "#ffffff",
    active: isDark ? "#1e293b" : "#e8eefc",
    border: isDark ? "#1e293b" : "#e2e8f0",
    primary: "#3155c9",
    text: isDark ? "#f8fafc" : "#172033",
    secondary: isDark ? "#94a3b8" : "#64748b",
    muted: isDark ? "#64748b" : "#64748b",
    card: isDark ? "#1e293b" : "#ffffff",
  };

  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#3155c9",
          },
          background: {
            default: colors.background,
            paper: colors.card,
          },
          text: {
            primary: colors.text,
            secondary: colors.secondary,
          },
        },
        shape: {
          borderRadius: 10,
        },
      }),
    [mode]
  );

  // ==============================
  // RESPONSIVE
  // ==============================

  useEffect(() => {
    setMenuOpen(!isMobile);
  }, [isMobile]);

  // ==============================
  // DATOS USUARIO
  // ==============================

  useEffect(() => {
    traerDatos();
  }, []);

  const traerDatos = async () => {
    const loggedUserJSON =
      window.localStorage.getItem("loggedNoteAppUser");

    if (!loggedUserJSON) return;

    try {
      const usuario = JSON.parse(loggedUserJSON);
      setUser(usuario);

      await serviciousuarios.traerusuario(
        usuario.usuario
      );

    } catch (error) {
      console.error("Error obteniendo usuario:", error);
    }
  };

  // ==============================
  // NAVEGACION
  // ==============================

  const handleClick = (item) => {
    if (!item.path) return;

    if (item.newTab) {
      window.open(item.path, "_blank", "noopener,noreferrer");

      if (isMobile) {
        setMenuOpen(false);
      }

      return;
    }

    navigate(item.path);

    if (isMobile) {
      setMenuOpen(false);
    }
  };

  // ==============================
  // CERRAR SESION
  // ==============================

  const handleLogout = () => {
    setUser(null);

    window.localStorage.removeItem("loggedNoteAppUser");

    setMenuOpen(false);

    navigate("/login");
  };

  // ==============================
  // MENUS POR NIVEL
  // ==============================

  const menuItemsNivel2 = [
    {
      text: "Ver Clientes",
      icon: <GroupIcon />,
      path: "/usuario/clientes",
    },
    {
      text: "Pacientes",
      icon: <MedicalServicesIcon />,
      path: "/usuario/pacientes",
    },
  ];

  const menuItemsNivel1 = [
    {
      text: "Pacientes",
      icon: <GroupIcon />,
      path: "/usuario/pacientes",
    },
    {
      text: "Turnos",
      icon: <CalendarMonthIcon />,
      path: "/usuario/turnos",
    },
    {
      text: "Calendario público",
      icon: <PublicIcon />,
      path: user?.id
        ? `/calendariop/${user.id}`
        : null,
      newTab: true,
    },
    {
      text: "Perfil",
      icon: <PersonIcon />,
      path: "/usuario/perfil",
    },
    {
      text: "Config. parámetros",
      icon: <SettingsIcon />,
      path: "/usuario/parametros",
    },
    {
      text: "Mis horarios",
      icon: <ScheduleIcon />,
      path: "/usuario/horarios",
    },
  ];

  const menuItems =
    user?.nivel === 2
      ? menuItemsNivel2
      : menuItemsNivel1;

  // ==============================
  // DATOS PERFIL
  // ==============================

  const nombreUsuario =
    user?.nombre ||
    user?.usuario ||
    "Usuario";

  const iniciales = nombreUsuario
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const nombreClinica =
    user?.clinica || "Clínica";

  const esActivo = (path) => {
    if (!path) return false;

    return (
      location.pathname === path ||
      location.pathname.startsWith(path + "/")
    );
  };

  // ==============================
  // RENDER
  // ==============================

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />

      <PanelThemeContext.Provider
        value={{
          mode,
          isDark,
          colors,
          toggleTheme,
        }}
      >
        <Box
          sx={{
            display: "flex",
            minHeight: "100vh",
            width: "100%",
            bgcolor: colors.background,
            color: colors.text,
            transition: "background-color 0.25s ease",
          }}
        >

          {/* APPBAR MOBILE */}

          {isMobile && (
            <AppBar
              position="fixed"
              elevation={0}
              sx={{
                bgcolor: colors.sidebar,
                color: colors.text,
                borderBottom: `1px solid ${colors.border}`,
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
            >
              <Toolbar
                sx={{
                  minHeight: "64px !important",
                  px: 2,
                }}
              >
                <IconButton
                  onClick={() => setMenuOpen(true)}
                  edge="start"
                  sx={{
                    color: colors.text,
                    mr: 1,
                  }}
                >
                  <MenuIcon />
                </IconButton>

                <AddIcon
                  sx={{
                    color: colors.primary,
                    fontSize: 28,
                    mr: 0.5,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 750,
                    color: colors.text,
                  }}
                >
                  Consultorio
                </Typography>
              </Toolbar>
            </AppBar>
          )}

          {/* DRAWER */}

          <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              width: isMobile ? undefined : drawerWidth,
              flexShrink: 0,

              "& .MuiDrawer-paper": {
                width: isMobile
                  ? `min(${drawerWidth}px, calc(100vw - 48px))`
                  : drawerWidth,

                boxSizing: "border-box",
                bgcolor: colors.sidebar,
                color: colors.text,
                borderRight: `1px solid ${colors.border}`,
                overflowX: "hidden",
                transition: "background-color 0.25s ease",
              },
            }}
          >

            {/* LOGO */}

            <Box
              sx={{
                height: 60,
                minHeight: 60,
                display: "flex",
                alignItems: "center",
                px: 2.5,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <AddIcon
                sx={{
                  color: colors.primary,
                  fontSize: 30,
                  mr: 1,
                }}
              />

              <Typography
                sx={{
                  fontSize: 23,
                  fontWeight: 750,
                  letterSpacing: "-0.5px",
                  color: colors.text,
                }}
              >
                Consultorio
              </Typography>
            </Box>

            {/* PERFIL */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                px: 2.7,
                py: 3,
                gap: 2,
                borderBottom: `1px solid ${colors.border}`,
              }}
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "#293c9e",
                  color: "#fff",
                  fontSize: 22,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {iniciales || "U"}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    color: colors.text,
                    fontWeight: 650,
                    fontSize: 17,
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {nombreUsuario}
                </Typography>

                <Typography
                  sx={{
                    color: colors.secondary,
                    fontSize: 14,
                  }}
                >
                  Profesional
                </Typography>

                <Typography
                  sx={{
                    color: "#4263d6",
                    fontSize: 14,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {nombreClinica}
                </Typography>
              </Box>
            </Box>

            {/* MENU PRINCIPAL */}

            <Box sx={{ pt: 3 }}>
              <Typography
                sx={{
                  px: 2.7,
                  mb: 1.5,
                  fontSize: 13,
                  fontWeight: 750,
                  color: colors.muted,
                  letterSpacing: "0.7px",
                }}
              >
                MENÚ PRINCIPAL
              </Typography>

              <List sx={{ p: 0 }}>
                {menuItems.map((item) => {
                  const active = esActivo(item.path);

                  return (
                    <ListItemButton
                      key={item.text}
                      onClick={() => handleClick(item)}
                      disabled={!item.path}
                      sx={{
                        minHeight: 58,
                        px: 2.7,
                        borderRadius: 0,

                        bgcolor: active
                          ? colors.active
                          : "transparent",

                        transition: "all 0.2s ease",

                        "&:hover": {
                          bgcolor: colors.active,
                        },

                        "&.Mui-disabled": {
                          opacity: 0.4,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 48,
                          color: active
                            ? colors.text
                            : "#8b5cf6",

                          "& svg": {
                            fontSize: 22,
                          },
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: 15,
                          fontWeight: active ? 650 : 500,
                          color: active
                            ? colors.text
                            : colors.secondary,
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            </Box>

            {/* ESPACIO FLEXIBLE */}

            <Box sx={{ flexGrow: 1, minHeight: 30 }} />

            {/* MODO DIA / NOCHE */}

            <Divider
              sx={{
                borderColor: colors.border,
              }}
            />

            <List sx={{ py: 0.5 }}>
              <ListItemButton
                onClick={toggleTheme}
                sx={{
                  minHeight: 60,
                  px: 2.7,

                  "&:hover": {
                    bgcolor: colors.active,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 48 }}>
                  {isDark ? (
                    <LightModeIcon sx={{ color: "#eab308" }} />
                  ) : (
                    <DarkModeIcon sx={{ color: "#6366f1" }} />
                  )}
                </ListItemIcon>

                <ListItemText
                  primary={isDark ? "Modo claro" : "Modo oscuro"}
                  primaryTypographyProps={{
                    fontSize: 15,
                    color: colors.text,
                  }}
                />

                <Switch
                  checked={isDark}
                  onChange={toggleTheme}
                  onClick={(e) => e.stopPropagation()}
                  size="small"
                  color="primary"
                />
              </ListItemButton>
            </List>

            {/* CERRAR SESION */}

            <Divider
              sx={{
                borderColor: colors.border,
              }}
            />

            <List sx={{ py: 0.5 }}>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  minHeight: 68,
                  px: 2.7,

                  "&:hover": {
                    bgcolor: colors.active,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 48,
                    color: "#c08457",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>

                <ListItemText
                  primary="Cerrar Sesión"
                  primaryTypographyProps={{
                    fontSize: 15,
                    color: colors.secondary,
                    fontWeight: 500,
                  }}
                />
              </ListItemButton>
            </List>

          </Drawer>

          {/* CONTENIDO PRINCIPAL */}

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              minWidth: 0,
              width: isMobile
                ? "100%"
                : `calc(100% - ${drawerWidth}px)`,

              minHeight: "100vh",

              bgcolor: colors.background,
              color: colors.text,

              p: {
                xs: 1.5,
                sm: 2.5,
                md: 3,
              },

              transition: "background-color 0.25s ease",
            }}
          >
            {/* ESPACIO PARA APPBAR MOBILE */}

            {isMobile && (
              <Toolbar
                sx={{
                  minHeight: "64px !important",
                }}
              />
            )}

            {/* CHILDREN */}

            {children}

          </Box>
        </Box>
      </PanelThemeContext.Provider>
    </ThemeProvider>
  );
}
