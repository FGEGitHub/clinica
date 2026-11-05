
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
  Collapse
} from '@mui/material';
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
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
// Especialidades desplegadas
const [filasAbiertas, setFilasAbiertas] = useState({});

// Modal de consultas
const [openConsulta, setOpenConsulta] = useState(false);

const [consultaActual, setConsultaActual] = useState({
  id: null,
  id_especialidad: null,
  nombre: ""
});

// Abrir o cerrar especialidad
const toggleFila = (id) => {
  setFilasAbiertas(prev => ({
    ...prev,
    [id]: !prev[id]
  }));
};

// Abrir modal para agregar
const agregarConsulta = (idEspecialidad) => {
  setConsultaActual({
    id: null,
    id_especialidad: idEspecialidad,
    nombre: ""
  });

  setOpenConsulta(true);
};

// Abrir modal para editar
const editarConsulta = (consulta) => {
  setConsultaActual({
    id: consulta.id,
    id_especialidad: consulta.id_especialidad,
    nombre: consulta.nombre
  });

  setOpenConsulta(true);
};

// Guardar consulta
const guardarConsulta = async () => {
  try {
    const usuario = JSON.parse(
      window.localStorage.getItem("loggedNoteAppUser")
    );

    if (!usuario?.id) {
      alert("No se pudo obtener el usuario");
      return;
    }

    if (!consultaActual.nombre.trim()) {
      alert("Ingrese el nombre de la consulta");
      return;
    }

    const data = {
      id_especialidad: consultaActual.id_especialidad,
      nombre: consultaActual.nombre.trim(),
      id_medico: usuario.id
    };

    let resultado;

    if (consultaActual.id) {
      resultado = await servicio.editarConsultaEspecialidad(
        consultaActual.id,
        data
      );
    } else {
      resultado = await servicio.agregarConsultaEspecialidad(data);
    }

    alert(resultado.data?.message || "Consulta guardada correctamente");

    setOpenConsulta(false);

    await traerPerfil();

  } catch (error) {
    console.error("Error al guardar consulta:", error);
    alert("Error al guardar la consulta");
  }
};

// Eliminar consulta
const eliminarConsulta = async (idConsulta) => {
  const confirmar = window.confirm(
    "¿Está seguro que desea eliminar esta consulta?"
  );

  if (!confirmar) return;

  try {
    const usuario = JSON.parse(
      window.localStorage.getItem("loggedNoteAppUser")
    );

    const resultado = await servicio.eliminarConsultaEspecialidad(
      idConsulta,
      usuario.id
    );

    alert(resultado.data?.message || "Consulta eliminada");

    await traerPerfil();

  } catch (error) {
    console.error("Error al eliminar consulta:", error);
    alert("Error al eliminar la consulta");
  }
};


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
    backgroundColor: "background.paper",
    color: "text.primary",
    borderColor: "divider",
  }}
>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell><strong>#</strong></TableCell>
        <TableCell><strong>Especialidad</strong></TableCell>
        <TableCell align="center"><strong>Consultas</strong></TableCell>
        <TableCell align="center"><strong>Acciones</strong></TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {especialidades.length > 0 ? (
        especialidades.map((item, index) => (
          <React.Fragment key={item.id}>

            {/* FILA PRINCIPAL */}
            <TableRow hover>
              <TableCell>
                {index + 1}
              </TableCell>

              <TableCell>
                <Typography fontWeight="bold">
                  {item.nombre}
                </Typography>
              </TableCell>

              <TableCell align="center">
                {item.consultas?.length || 0}
              </TableCell>

              <TableCell align="center">

                <IconButton
                  color="primary"
                  onClick={() => toggleFila(item.id)}
                  title="Ver consultas"
                >
                  {filasAbiertas[item.id]
                    ? <ExpandLessIcon />
                    : <ExpandMoreIcon />
                  }
                </IconButton>

                <IconButton
                  color="error"
                  onClick={() => eliminarEspecialidad(item.id)}
                  title="Eliminar especialidad"
                >
                  <DeleteIcon />
                </IconButton>

              </TableCell>
            </TableRow>

            {/* FILA DESPLEGABLE */}
            <TableRow>
              <TableCell
                colSpan={4}
                sx={{ p: 0, borderBottom: 0 }}
              >
                <Collapse
                  in={!!filasAbiertas[item.id]}
                  timeout="auto"
                  unmountOnExit
                >
             <Box
  sx={(theme) => ({
    p: 3,
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
    borderTop: `1px solid ${theme.palette.divider}`,
  })}
>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={2}
                    >
                      <Typography
                        fontWeight="bold"
                        color="primary"
                      >
                        Consultas de {item.nombre}
                      </Typography>

                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => agregarConsulta(item.id)}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2
                        }}
                      >
                        Agregar consulta
                      </Button>
                    </Box>

                    {item.consultas?.length > 0 ? (

                   <Table
  size="small"
  sx={{
    backgroundColor: "background.paper",
    "& .MuiTableCell-root": {
      borderColor: "divider",
      color: "text.primary",
    },
    "& .MuiTableHead-root .MuiTableCell-root": {
      fontWeight: "bold",
      backgroundColor: "action.hover",
    },
  }}
>
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <strong>Nombre de consulta</strong>
                            </TableCell>

                            <TableCell align="center">
                              <strong>Acciones</strong>
                            </TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {item.consultas.map(consulta => (
                            <TableRow key={consulta.id} hover>

                              <TableCell>
                                {consulta.nombre}
                              </TableCell>

                              <TableCell align="center">

                                <IconButton
                                  color="primary"
                                  size="small"
                                  title="Editar"
                                  onClick={() => editarConsulta(consulta)}
                                >
                                  <EditIcon />
                                </IconButton>

                                <IconButton
                                  color="error"
                                  size="small"
                                  title="Eliminar"
                                  onClick={() => eliminarConsulta(consulta.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>

                              </TableCell>

                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                    ) : (

                      <Typography
                        color="text.secondary"
                        textAlign="center"
                        py={2}
                      >
                        Esta especialidad todavía no tiene consultas cargadas.
                      </Typography>

                    )}

                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>

          </React.Fragment>
        ))

      ) : (

        <TableRow>
          <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
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
  open={openConsulta}
  onClose={() => setOpenConsulta(false)}
  fullWidth
  maxWidth="sm"
>
  <DialogTitle fontWeight="bold">
    {consultaActual.id
      ? "Modificar consulta"
      : "Agregar consulta"}
  </DialogTitle>

  <DialogContent>

    <TextField
      autoFocus
      fullWidth
      margin="dense"
      label="Nombre de la consulta"
      placeholder="Ej. Consulta presencial"
      value={consultaActual.nombre}
      onChange={(e) =>
        setConsultaActual(prev => ({
          ...prev,
          nombre: e.target.value
        }))
      }
    />

  </DialogContent>

  <DialogActions sx={{ p: 2 }}>

    <Button
      onClick={() => setOpenConsulta(false)}
    >
      Cancelar
    </Button>

    <Button
      variant="contained"
      onClick={guardarConsulta}
    >
      Guardar
    </Button>

  </DialogActions>
</Dialog>
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

