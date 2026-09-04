
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import servicio from "../../../services/pacientes";

export default function Parametros() {
  const [perfil, setPerfil] = useState({
    precio_consulta: "",
    tipo_consulta: "",
    consulta_paga: "No",
  });

  // Especialidades del médico
  const [especialidades, setEspecialidades] = useState([]);

  // Estado del modal
  const [openEspecialidad, setOpenEspecialidad] = useState(false);
  const [especialidad, setEspecialidad] = useState("");

  const traerPerfil = async () => {
    try {
      const usuario = JSON.parse(
        window.localStorage.getItem("loggedNoteAppUser")
      );

      if (!usuario?.id) {
        alert("No se pudo obtener el usuario");
        return;
      }

      const datos = await servicio.traerperfil(usuario.id);

      if (datos) {
        setPerfil({
          precio_consulta: datos.precio_consulta || "",
          tipo_consulta: datos.tipo_consulta || "",
          consulta_paga: datos.consulta_paga || "No",
        });

        // Cargar especialidades
        setEspecialidades(datos.especialidades || []);
      }
    } catch (error) {
      console.error("Error al traer perfil:", error);
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

      await servicio.actualizarParametros({
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

  // ==========================================
  // AGREGAR ESPECIALIDAD
  // ==========================================
  const guardarEspecialidad = async () => {
    if (!especialidad.trim()) {
      alert("Ingrese una especialidad");
      return;
    }

    try {
      const usuario = JSON.parse(
        window.localStorage.getItem("loggedNoteAppUser")
      );

      if (!usuario?.id) {
        alert("No se pudo obtener el usuario");
        return;
      }

      const resultado = await servicio.agregarEspecialidad({
        usuarioid: usuario.id,
        nombre: especialidad.trim(),
      });

      setOpenEspecialidad(false);
      setEspecialidad("");

      alert(resultado.message);

      // Volvemos a traer el perfil para actualizar la tabla
      await traerPerfil();
    } catch (error) {
      console.error("Error al agregar especialidad:", error);
      alert("Error al guardar la especialidad");
    }
  };

  // ==========================================
  // ELIMINAR ESPECIALIDAD
  // ==========================================
  const eliminarEspecialidad = async (idEspecialidad) => {
    const confirmar = window.confirm(
      "¿Está seguro que desea eliminar esta especialidad?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resultado = await servicio.eliminarEspecialidad(
        idEspecialidad
      );

      alert(resultado.message);

      // Volvemos a traer el perfil para actualizar la tabla
      await traerPerfil();
    } catch (error) {
      console.error("Error al eliminar especialidad:", error);
      alert("Error al eliminar la especialidad");
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
        {/* ENCABEZADO */}
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
          {/* ============================= */}
          {/* DATOS DE CONSULTA */}
          {/* ============================= */}

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

          {/* ============================= */}
          {/* ESPECIALIDADES */}
          {/* ============================= */}

          <Box
            sx={{
              mt: 5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Especialidades
            </Typography>

            <Button
              variant="contained"
              onClick={() => setOpenEspecialidad(true)}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              + Agregar especialidad
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* TABLA DE ESPECIALIDADES */}
          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>#</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Especialidad</strong>
                  </TableCell>

                  <TableCell align="center">
                    <strong>Acciones</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {especialidades.length > 0 ? (
                  especialidades.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        {index + 1}
                      </TableCell>

                      <TableCell>
                        {item.nombre}
                      </TableCell>

                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() =>
                            eliminarEspecialidad(item.id)
                          }
                          title="Eliminar especialidad"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{ py: 3 }}
                    >
                      No hay especialidades cargadas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* ============================= */}
          {/* GUARDAR PARÁMETROS */}
          {/* ============================= */}

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

      {/* ============================= */}
      {/* MODAL ESPECIALIDAD */}
      {/* ============================= */}

      <Dialog
        open={openEspecialidad}
        onClose={() => setOpenEspecialidad(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle fontWeight="bold">
          Agregar Especialidad
        </DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Especialidad"
            placeholder="Ej. Cardiología"
            value={especialidad}
            onChange={(e) =>
              setEspecialidad(e.target.value)
            }
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenEspecialidad(false);
              setEspecialidad("");
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={guardarEspecialidad}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

