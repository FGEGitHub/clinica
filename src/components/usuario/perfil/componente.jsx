import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
} from "@mui/material";
import servicio from "../../../services/pacientes";

export default function PerfilClinica() {
  const [perfil, setPerfil] = useState({
    nombre_clinica: "",
    password: "",
    foto: "",
    color_nav: "#0d47a1",
    color_fondo: "#f5f5f5",
  });

  const traerPerfil = async () => {
    try {
          const usuario = JSON.parse(
    window.localStorage.getItem("loggedNoteAppUser"))
      const datos = await servicio.traerperfil(usuario.id);
      setPerfil(datos);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    traerPerfil();
  }, []);

  const handleChange = (e) => {
    setPerfil({
      ...perfil,
      [e.target.name]: e.target.value,
    });
  };

  const guardar = async () => {
    try {
      await servicio.actualizarPerfil(perfil);
      alert("Perfil guardado");
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 1200,
        margin: "auto",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(90deg, ${perfil.color_nav}, #1976d2)`,
            color: "#fff",
            p: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Configuración de Perfil
          </Typography>

          <Typography variant="body2">
            Personalización de la clínica
          </Typography>
        </Box>

        <Box p={4}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <Avatar
                  src={perfil.foto}
                  sx={{
                    width: 180,
                    height: 180,
                    margin: "auto",
                    mb: 2,
                  }}
                />

                <Button variant="contained" component="label">
                  Cambiar Logo
                  <input hidden type="file" />
                </Button>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={2}
                >
                  PNG, JPG o SVG
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={8}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                >
                  Datos Generales
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nombre de la Clínica"
                      name="nombre_clinica"
                      value={perfil.nombre_clinica}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contraseña"
                      name="password"
                      type="password"
                      value={perfil.password}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography mb={1}>
                      Color Barra de Navegación
                    </Typography>

                    <TextField
                      fullWidth
                      type="color"
                      name="color_nav"
                      value={perfil.color_nav}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography mb={1}>
                      Color de Fondo
                    </Typography>

                    <TextField
                      fullWidth
                      type="color"
                      name="color_fondo"
                      value={perfil.color_fondo}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>

                <Box
                  mt={4}
                  display="flex"
                  justifyContent="flex-end"
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={guardar}
                  >
                    Guardar Cambios
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          <Paper
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: perfil.color_fondo,
              border: "1px solid #ddd",
            }}
          >
            <Typography variant="h6">
              Vista previa del fondo
            </Typography>

            <Typography>
              Así se visualizará el color principal de fondo.
            </Typography>
          </Paper>
        </Box>
      </Paper>
    </Box>
  );
}