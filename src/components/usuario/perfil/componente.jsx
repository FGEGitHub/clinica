
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

  const [subiendoLogo, setSubiendoLogo] = useState(false);

  const traerPerfil = async () => {
    try {
      const usuario = JSON.parse(
        window.localStorage.getItem("loggedNoteAppUser")
      );

      if (!usuario?.id) {
        console.error("No se encontró el usuario");
        return;
      }

      const datos = await servicio.traerperfil(usuario.id);

      setPerfil(datos);
    } catch (error) {
      console.error("Error trayendo perfil:", error);
    }
  };

  useEffect(() => {
    traerPerfil();
  }, []);

  const handleChange = (e) => {
    setPerfil((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==============================
  // SUBIR LOGO
  // ==============================

  const handleLogo = async (e) => {
    const archivo = e.target.files?.[0];

    if (!archivo) return;

    const formatosPermitidos = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/svg+xml",
      "image/webp",
    ];

    if (!formatosPermitidos.includes(archivo.type)) {
      alert("Formato no permitido. Use PNG, JPG, SVG o WEBP.");
      return;
    }

    // Máximo 5 MB
    if (archivo.size > 5 * 1024 * 1024) {
      alert("El logo no puede superar los 5 MB.");
      return;
    }

    try {
      setSubiendoLogo(true);

      const usuario = JSON.parse(
        window.localStorage.getItem("loggedNoteAppUser")
      );

      if (!usuario?.id) {
        alert("No se encontró el usuario.");
        return;
      }

      const formData = new FormData();

      formData.append("logo", archivo);
      formData.append("id", usuario.id);

      const respuesta = await servicio.guardarlogo(formData);

      console.log("Respuesta guardar logo:", respuesta);

      if (respuesta.logodir) {
        setPerfil((prev) => ({
          ...prev,
          foto: respuesta.logodir,
        }));
      }

      alert("Logo actualizado correctamente");
    } catch (error) {
      console.error("Error subiendo logo:", error);

      alert(
        error?.response?.data?.error ||
          "Error al guardar el logo"
      );
    } finally {
      setSubiendoLogo(false);

      // Permite volver a seleccionar el mismo archivo
      e.target.value = "";
    }
  };

  // ==============================
  // GUARDAR PERFIL
  // ==============================

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
        {/* HEADER */}
        <Box
          sx={{
            background: `linear-gradient(
              90deg,
              ${perfil.color_nav},
              #1976d2
            )`,
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

            {/* ==============================
                LOGO
            ============================== */}

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
                  src={perfil.foto || ""}
                  variant="rounded"
                  sx={{
                    width: 180,
                    height: 180,
                    margin: "auto",
                    mb: 2,
                    border: "1px solid #ddd",
                  }}
                />

                <Button
                  variant="contained"
                  component="label"
                  disabled={subiendoLogo}
                >
                  {subiendoLogo
                    ? "Subiendo..."
                    : "Cambiar Logo"}

                  <input
                    hidden
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                    onChange={handleLogo}
                  />
                </Button>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  mt={2}
                >
                  PNG, JPG, SVG o WEBP
                </Typography>

                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  Máximo 5 MB
                </Typography>
              </Paper>
            </Grid>

            {/* ==============================
                DATOS GENERALES
            ============================== */}

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
                      value={perfil.nombre_clinica || ""}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contraseña"
                      name="password"
                      type="password"
                      value={perfil.password || ""}
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

          {/* PREVIEW */}

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


