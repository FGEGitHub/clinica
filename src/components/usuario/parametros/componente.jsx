import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Divider,
} from "@mui/material";

import servicio from "../../../services/pacientes";

export default function Parametros() {
  const [perfil, setPerfil] = useState({
    precio_consulta: "",
    tipo_consulta: "",
    consulta_paga: "No",
  });

  const traerPerfil = async () => {
    try {
      const usuario = JSON.parse(
        window.localStorage.getItem("loggedNoteAppUser")
      );

      const datos = await servicio.traerperfil(usuario.id);

      if (datos) {
        setPerfil({
          precio_consulta: datos.precio_consulta || "",
          tipo_consulta: datos.tipo_consulta || "",
          consulta_paga: datos.consulta_paga || "No",
        });
      }
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
      const usuario = JSON.parse(
        window.localStorage.getItem("loggedNoteAppUser")
      );

      await servicio.actualizarPerfil({
        id: usuario.id,
        precio_consulta: perfil.precio_consulta,
        tipo_consulta: perfil.tipo_consulta,
        consulta_paga: perfil.consulta_paga,
      });

      alert("Parámetros actualizados correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        p: { xs: 2, md: 4 },
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
            background:
              "linear-gradient(90deg,#0b4f6c 0%, #148D8D 100%)",
            color: "#fff",
            p: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Parámetros del Sistema
          </Typography>

          <Typography variant="body2">
            Configuración de consultas y aranceles
          </Typography>
        </Box>

        <Box p={4}>
          <Typography
            variant="h6"
            fontWeight="bold"
            gutterBottom
          >
            Datos de Consulta
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Precio de Consulta"
                name="precio_consulta"
                type="number"
                value={perfil.precio_consulta}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tipo de Consulta"
                name="tipo_consulta"
                value={perfil.tipo_consulta}
                onChange={handleChange}
                placeholder="Presencial / Virtual"
              />
            </Grid>

<Grid item xs={12} sm={6} md={4}>
 <TextField
  select
  fullWidth
  variant="outlined"
  label="Consulta Paga"
  name="consulta_paga"
  value={perfil.consulta_paga}
  onChange={handleChange}
  sx={{
    minWidth: 220,
  }}
>
  <MenuItem value="Si">Sí</MenuItem>
  <MenuItem value="No">No</MenuItem>
</TextField>
</Grid>
          </Grid>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={guardar}
            >
              Guardar Parámetros
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}