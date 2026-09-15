import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/diente.jpeg";
import {
  AppBar,
  Button,
  Tabs,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DrawerNav from "./DrawerNav";
import servicioPacientes from "../../services/pacientes";

const Navbar = ({ colorNav }) => {

  const [usuario, setUsuario] = useState(null);
  const [logoUsuario, setLogoUsuario] = useState(logo);
  const [user, setUser] = useState(null);
  const [cargado, setCargado] = useState(false);

  const [value, setValue] = useState();
  const theme = useTheme();

  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  const islogo = {
    width: "100px",
  };

  const navigate = useNavigate();

  useEffect(() => {
    traer();
  }, []);

  const traer = async () => {
    try {

      const loggedUserJSON = window.localStorage.getItem(
        "loggedNoteAppUser"
      );

      // No hay usuario logueado
      if (!loggedUserJSON) {
        setUsuario(null);
        setLogoUsuario(logo);
        setCargado(true);
        return;
      }

      const usuarioLocal = JSON.parse(loggedUserJSON);

      console.log("👤 Usuario:", usuarioLocal);

      if (!usuarioLocal?.id) {
        setUsuario(null);
        setLogoUsuario(logo);
        setCargado(true);
        return;
      }

      // Guardamos usuario
      setUsuario(usuarioLocal);

      // ============================
      // TRAER LOGO
      // ============================

      const datosLogo = await servicioPacientes.traerLogo(
        usuarioLocal.id
      );

      console.log("🖼️ Logo recibido:", datosLogo);

      if (datosLogo?.logodir) {

        const API = import.meta.env.VITE_API_URL;

        setLogoUsuario(
          `${API.replace(/\/$/, "")}${datosLogo.logodir}`
        );

      } else {

        // No tiene logo
        setLogoUsuario(logo);

      }

    } catch (error) {

      console.error("❌ Error cargando usuario/logo:", error);

      // Si falla algo mostramos el logo por defecto
      setLogoUsuario(logo);

    } finally {

      setCargado(true);

    }
  };

  const handleClick = () => {
    navigate("/login");
  };

  const hanleLogout = () => {

    setUser(null);
    setUsuario(null);

    window.localStorage.removeItem("loggedNoteAppUser");

    setLogoUsuario(logo);

    navigate("/login");
  };

  const inicio = () => {
    navigate("/usuario2/clientes");
  };

  return (
    <React.Fragment>

      <AppBar
        sx={{
          background: colorNav
            ? `linear-gradient(
                90deg,
                ${colorNav} 0%,
                ${colorNav}CC 50%,
                ${colorNav}99 100%
              )`
            : "linear-gradient(90deg, #051821 0%, #051821 30%, #0b2a3a 45%, #01567c 65%, #148D8D 100%)",
        }}
      >

        <Toolbar>

          {/* LOGO */}
          <img
            style={islogo}
            src={logoUsuario}
            alt="logo"
          />

          {isMatch ? (

            <DrawerNav />

          ) : (

            <>

              <Tabs
                sx={{ marginLeft: "auto" }}
                indicatorColor="Secondary"
                textColor="inherit"
                value={value}
                onChange={(e, value) => setValue(value)}
              >

                {usuario && (
                  <Button
                    onClick={inicio}
                    sx={{ marginLeft: "10px" }}
                    variant="Outlined"
                  >
                  </Button>
                )}

                {cargado ? (

                  <div>

                    <Button
                      onClick={inicio}
                      sx={{ marginLeft: "10px" }}
                      variant="Outlined"
                    >
                    </Button>

                  </div>

                ) : (

                  <div></div>

                )}

              </Tabs>

              {/* USUARIO LOGUEADO */}
              {usuario ? (

                <div>

                  <Button
                    onClick={hanleLogout}
                    sx={{ marginLeft: "10px" }}
                    variant="Outlined"
                  >
                    Cerrar Sesión
                  </Button>

                </div>

              ) : (

                <div>

                  <Button
                    sx={{ marginLeft: "10px" }}
                    variant="Outlined"
                  >
                    Registrarse
                  </Button>

                  <Button
                    onClick={handleClick}
                    sx={{ marginLeft: "auto" }}
                    variant="Outlined"
                  >
                    Ingresar
                  </Button>

                </div>

              )}

            </>

          )}

        </Toolbar>

      </AppBar>

    </React.Fragment>
  );
};

export default Navbar;