import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Avatar,
  Link,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

import loginService from "../../services/login";
import servicioUsuario from "../../services/usuarios";

import marcas from "../../assets/imagenlogin.jpg";

const Login = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    usuario: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      "loggedNoteAppUser"
    );

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);

      switch (user.nivel) {
        case 1:
        case "1":
          navigate("/usuario/pacientes");
          break;

        default:
          break;
      }
    }
  }, [navigate]);

  const loginSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const user = await loginService.login({
        usuario: usuario.usuario,
        password: usuario.password,
      });

      window.localStorage.setItem(
        "loggedNoteAppUser",
        JSON.stringify(user)
      );

      servicioUsuario.setToken(user.token);

      switch (user.nivel) {
        case 1:
        case "1":
          navigate("/usuario/pacientes");
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error);
      alert("Error de credenciales");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        minHeight: "100vh",
        backgroundColor: "#002D57",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Grid
        item
        xs={12}
        md={10}
        lg={8}
      >
        <Card
          elevation={10}
          sx={{
            borderRadius: 5,
            overflow: "hidden",
            width: "100%",
          }}
        >
          <Grid container>
            {/* Imagen */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                backgroundColor: "#002D57",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: {
                  xs: 4,
                  md: 6,
                },
              }}
            >
              <Box
                component="img"
                src={marcas}
                alt="Logo"
                sx={{
                  width: "100%",
                  maxWidth: {
                    xs: 240,
                    sm: 320,
                    md: 420,
                  },
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Grid>

            {/* Formulario */}
            <Grid
              item
              xs={12}
              md={6}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
                p: {
                  xs: 3,
                  sm: 5,
                },
              }}
            >
              <Box
                component="form"
                onSubmit={loginSubmit}
                sx={{
                  width: "100%",
                  maxWidth: 360,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#002D57",
                      width: 56,
                      height: 56,
                      mb: 2,
                    }}
                  >
                    <LockOutlinedIcon />
                  </Avatar>

                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    BIENVENIDO
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: "gray",
                      textAlign: "center",
                    }}
                  >
                    Iniciar Sesión
                  </Typography>
                </Box>

                <TextField
                  fullWidth
                  margin="normal"
                  label="Usuario"
                  name="usuario"
                  value={usuario.usuario}
                  onChange={handleChange}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Contraseña"
                  type="password"
                  name="password"
                  value={usuario.password}
                  onChange={handleChange}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: {
                      xs: "flex-start",
                      sm: "center",
                    },
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    mt: 1,
                    gap: 1,
                  }}
                >
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    label="Recordarme"
                  />

                  <Link
                    href="#"
                    variant="body2"
                    underline="hover"
                  >
                    Recuperar contraseña
                  </Link>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 3,
                    py: 1.4,
                    borderRadius: 2,
                    backgroundColor: "#148D8D",
                    fontSize: "1rem",
                    fontWeight: "bold",
                    boxShadow: "none",
                    "&:hover": {
                      backgroundColor: "#0f7777",
                      boxShadow: "none",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress
                      size={24}
                      sx={{ color: "#fff" }}
                    />
                  ) : (
                    "Ingresar"
                  )}
                </Button>

                <Typography
                  variant="body2"
                  sx={{
                    mt: 3,
                    textAlign: "center",
                  }}
                >
                  ¿No estás registrado?
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Login;