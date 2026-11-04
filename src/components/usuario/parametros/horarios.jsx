
import React, { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SaveIcon from "@mui/icons-material/Save";

import serviciosHorarios from "../../../services/pacientes";

const dias = [
  { id: 1, nombre: "Lunes", corto: "Lun" },
  { id: 2, nombre: "Martes", corto: "Mar" },
  { id: 3, nombre: "Miércoles", corto: "Mié" },
  { id: 4, nombre: "Jueves", corto: "Jue" },
  { id: 5, nombre: "Viernes", corto: "Vie" },
  { id: 6, nombre: "Sábado", corto: "Sáb" },
  { id: 7, nombre: "Domingo", corto: "Dom" },
];

const horas = [
  "08:00", "08:30",
  "09:00", "09:30",
  "10:00", "10:30",
  "11:00", "11:30",
  "12:00", "12:30",
  "13:00", "13:30",
  "14:00", "14:30",
  "15:00", "15:30",
  "16:00", "16:30",
  "17:00", "17:30",
  "18:00", "18:30",
  "19:00", "19:30",
  "20:00",
];

const categorias = [
  "Consulta",
  "Control",
  "Primera vez",
];

const duraciones = [
  { label: "30 minutos", value: 30 },
  { label: "60 minutos", value: 60 },
  { label: "90 minutos", value: 90 },
  { label: "120 minutos", value: 120 },
];

const HorariosClinica = ({ darkMode, colors = {} }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const modoOscuro = darkMode ?? theme.palette.mode === "dark";

  // =====================================================
  // PALETA DE COLORES
  // =====================================================

  const paletaBase = modoOscuro
    ? {
        fondo: "#242426",
        superficie: "#2b2b2e",
        encabezado: "#343438",
        texto: "#f4f4f5",
        secundario: "#a1a1aa",
        borde: "#36363a",
        hover: "#36363b",
        input: "#242426",
        primario: "#60a5fa",
        bloque: "#263f5c",
        bloqueTexto: "#bfdbfe",
        ocupado: "#343438",
        ocupadoTexto: "#a1a1aa",
        success: "#14532d",
        successTexto: "#bbf7d0",
      }
    : {
        fondo: "#ffffff",
        superficie: "#ffffff",
        encabezado: "#f1f5f9",
        texto: "#222222",
        secundario: "#64748b",
        borde: "#e2e8f0",
        hover: "#f8fafc",
        input: "#ffffff",
        primario: "#2563eb",
        bloque: "#dbeafe",
        bloqueTexto: "#1d4ed8",
        ocupado: "#f1f5f9",
        ocupadoTexto: "#94a3b8",
        success: "#dcfce7",
        successTexto: "#166534",
      };

  const c = { ...paletaBase, ...colors };

  // =====================================================
  // ESTADOS
  // =====================================================

  const [horarios, setHorarios] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [mensaje, setMensaje] = useState({
    open: false,
    tipo: "success",
    texto: "",
  });

  const [modalAbierto, setModalAbierto] = useState(false);

  const [nuevoHorario, setNuevoHorario] = useState({
    dia: null,
    hora_inicio: "",
    categoria: "",
    duracion: 30,
  });

  // =====================================================
  // ESTILOS COMUNES
  // =====================================================

  const estilosInput = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: c.input,
      color: c.texto,
      borderRadius: 2,

      "& fieldset": {
        borderColor: c.borde,
      },

      "&:hover fieldset": {
        borderColor: c.secundario,
      },

      "&.Mui-focused fieldset": {
        borderColor: c.primario,
      },
    },

    "& .MuiInputLabel-root": {
      color: c.secundario,
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: c.primario,
    },

    "& .MuiSelect-icon": {
      color: c.secundario,
    },
  };

  // =====================================================
  // MENSAJES
  // =====================================================

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({
      open: true,
      tipo,
      texto,
    });
  };

  // =====================================================
  // TRAER HORARIOS
  // =====================================================

  useEffect(() => {
    traerHorarios();
  }, []);

  const traerHorarios = async () => {
    try {
      setCargando(true);

      const loggedUserJSON =
        window.localStorage.getItem("loggedNoteAppUser");

      if (!loggedUserJSON) {
        mostrarMensaje("error", "No hay usuario logueado");
        return;
      }

      const usuario = JSON.parse(loggedUserJSON);

      if (!usuario?.id) {
        mostrarMensaje("error", "No se encontró el ID del usuario");
        return;
      }

      setUsuarioId(usuario.id);

      const datos = await serviciosHorarios.traerHorarios(
        usuario.id
      );

      setHorarios(
        Array.isArray(datos)
          ? datos.map((h) => ({
              ...h,
              categoria: h.categoria || "Consulta",
              duracion: Number(h.duracion) || 30,
              nuevo: false,
            }))
          : []
      );
    } catch (error) {
      console.error("Error trayendo horarios:", error);

      mostrarMensaje(
        "error",
        "No se pudieron cargar los horarios"
      );
    } finally {
      setCargando(false);
    }
  };

  // =====================================================
  // CONVERTIR HORA A MINUTOS
  // =====================================================

  const convertirMinutos = (hora) => {
    if (!hora || !hora.includes(":")) return 0;

    const [h, m] = hora.split(":").map(Number);

    return h * 60 + m;
  };

  // =====================================================
  // CALCULAR HORA FIN
  // =====================================================

  const calcularHoraFin = (hora, duracion) => {
    const inicio = convertirMinutos(hora);
    const minutos = inicio + Number(duracion);

    const nuevaHora = Math.floor(minutos / 60);
    const nuevosMinutos = minutos % 60;

    return `${String(nuevaHora).padStart(2, "0")}:${String(
      nuevosMinutos
    ).padStart(2, "0")}`;
  };

  // =====================================================
  // VERIFICAR SOLAPAMIENTO
  // =====================================================

  const haySolapamiento = (dia, horaInicio, duracion) => {
    const inicioNuevo = convertirMinutos(horaInicio);
    const finNuevo = inicioNuevo + Number(duracion);

    return horarios.some((h) => {
      if (Number(h.dia) !== Number(dia)) {
        return false;
      }

      const inicioExistente = convertirMinutos(h.hora_inicio);
      const finExistente = convertirMinutos(h.hora_fin);

      return (
        inicioNuevo < finExistente &&
        finNuevo > inicioExistente
      );
    });
  };

  // =====================================================
  // OBTENER HORARIO QUE OCUPA UNA CELDA
  // =====================================================

  const horarioOcupando = (dia, hora) => {
    const minutos = convertirMinutos(hora);

    return horarios.find((h) => {
      if (Number(h.dia) !== Number(dia)) {
        return false;
      }

      const inicio = convertirMinutos(h.hora_inicio);
      const fin = convertirMinutos(h.hora_fin);

      return minutos > inicio && minutos < fin;
    });
  };

  // =====================================================
  // ABRIR MODAL
  // =====================================================

  const abrirModalHorario = (dia, hora) => {
    if (horarioOcupando(dia, hora)) {
      return;
    }

    const existe = horarios.some(
      (h) =>
        Number(h.dia) === Number(dia) &&
        h.hora_inicio === hora
    );

    if (existe) {
      return;
    }

    setNuevoHorario({
      dia,
      hora_inicio: hora,
      categoria: categorias[0],
      duracion: 30,
    });

    setModalAbierto(true);
  };

  // =====================================================
  // CERRAR MODAL
  // =====================================================

  const cerrarModal = () => {
    setModalAbierto(false);

    setNuevoHorario({
      dia: null,
      hora_inicio: "",
      categoria: "",
      duracion: 30,
    });
  };

  // =====================================================
  // CONFIRMAR NUEVO HORARIO
  // =====================================================

  const confirmarHorario = () => {
    const {
      dia,
      hora_inicio,
      categoria,
      duracion,
    } = nuevoHorario;

    if (!dia || !hora_inicio) {
      return;
    }

    if (!categoria) {
      mostrarMensaje("error", "Seleccioná una categoría");
      return;
    }

    const hora_fin = calcularHoraFin(
      hora_inicio,
      duracion
    );

    // No permitir superar el último horario de atención.
    if (convertirMinutos(hora_fin) > convertirMinutos("20:30")) {
      mostrarMensaje(
        "error",
        "El horario supera el límite de atención de las 20:30"
      );
      return;
    }

    if (haySolapamiento(dia, hora_inicio, duracion)) {
      mostrarMensaje(
        "error",
        "El horario se superpone con otro turno"
      );
      return;
    }

    const nuevo = {
      id: null,
      dia,
      hora_inicio,
      hora_fin,
      duracion: Number(duracion),
      categoria,
      nuevo: true,
    };

    setHorarios((prev) => [...prev, nuevo]);

    cerrarModal();
  };

  // =====================================================
  // ELIMINAR HORARIO
  // =====================================================

  const eliminarHorario = async (horario) => {
    try {
      if (!horario.id) {
        setHorarios((prev) =>
          prev.filter(
            (h) =>
              !(
                Number(h.dia) === Number(horario.dia) &&
                h.hora_inicio === horario.hora_inicio
              )
          )
        );

        return;
      }

      await serviciosHorarios.eliminarHorario(horario.id);

      setHorarios((prev) =>
        prev.filter((h) => h.id !== horario.id)
      );

      mostrarMensaje(
        "success",
        "Horario eliminado correctamente"
      );
    } catch (error) {
      console.error("Error eliminando horario:", error);

      mostrarMensaje(
        "error",
        "No se pudo eliminar el horario"
      );
    }
  };

  // =====================================================
  // GUARDAR HORARIOS
  // =====================================================

  const guardarHorarios = async () => {
    try {
      if (!usuarioId) {
        mostrarMensaje("error", "No se encontró el usuario");
        return;
      }

      if (horarios.length === 0) {
        mostrarMensaje("error", "No hay horarios para guardar");
        return;
      }

      setGuardando(true);

      const datos = {
        usuario_id: usuarioId,

        horarios: horarios.map((h) => ({
          dia: h.dia,
          hora_inicio: h.hora_inicio,
          hora_fin: h.hora_fin,
          duracion: Number(h.duracion),
          categoria: h.categoria,
        })),
      };

      await serviciosHorarios.guardarHorarios(datos);

      mostrarMensaje(
        "success",
        "Horarios guardados correctamente"
      );

      await traerHorarios();
    } catch (error) {
      console.error("Error guardando horarios:", error);

      mostrarMensaje(
        "error",
        "No se pudieron guardar los horarios"
      );
    } finally {
      setGuardando(false);
    }
  };

  // =====================================================
  // HORARIOS DE UN DÍA
  // =====================================================

  const horariosDelDia = (dia) => {
    return horarios.filter(
      (h) => Number(h.dia) === Number(dia)
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (cargando) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: c.fondo,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =====================================================
  // VISTA PRINCIPAL
  // =====================================================

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        minHeight: "100vh",
        p: { xs: 1, sm: 2, md: 3 },
        backgroundColor: c.fondo,
        color: c.texto,
        overflowX: "hidden",
      }}
    >
      {/* ENCABEZADO */}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 2.5 },
          mb: 2,
          borderRadius: 3,
          backgroundColor: c.superficie,
          border: `1px solid ${c.borde}`,
          color: c.texto,
          display: "flex",
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: { xs: 19, md: 23 },
              mb: 0.5,
            }}
          >
            Horarios de atención
          </Typography>

          <Typography
            sx={{
              fontSize: 13,
              color: c.secundario,
            }}
          >
            Seleccioná los días, horarios, categorías y duración de los turnos.
          </Typography>
        </Box>

        <Chip
          icon={
            <AccessTimeIcon
              sx={{ color: `${c.primario} !important` }}
            />
          }
          label={`${horarios.length} horarios configurados`}
          sx={{
            backgroundColor: c.encabezado,
            color: c.texto,
            border: `1px solid ${c.borde}`,
            fontWeight: 700,
          }}
        />
      </Paper>

      {/* REFERENCIAS */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: 0.5,
              backgroundColor: c.bloque,
              border: `1px solid ${c.primario}`,
            }}
          />
          <Typography sx={{ fontSize: 12, color: c.secundario }}>
            Horario configurado
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: 0.5,
              backgroundColor: c.ocupado,
              border: `1px solid ${c.borde}`,
            }}
          />
          <Typography sx={{ fontSize: 12, color: c.secundario }}>
            Horario ocupado
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <AddIcon sx={{ fontSize: 15, color: c.primario }} />
          <Typography sx={{ fontSize: 12, color: c.secundario }}>
            Espacio disponible
          </Typography>
        </Box>
      </Box>

      {/* GRILLA */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${c.borde}`,
          backgroundColor: c.superficie,
        }}
      >
        <Box
          sx={{
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Box
            sx={{
              minWidth: isMobile ? 850 : "100%",
            }}
          >
            {/* CABECERA */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "65px repeat(7, minmax(0, 1fr))",
                borderBottom: `1px solid ${c.borde}`,
                position: "sticky",
                top: 0,
                backgroundColor: c.encabezado,
                zIndex: 5,
              }}
            >
              <Box />

              {dias.map((dia) => (
                <Box
                  key={dia.id}
                  sx={{
                    textAlign: "center",
                    py: { xs: 1.5, md: 2 },
                    borderLeft: `1px solid ${c.borde}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: 12, md: 14 },
                      color: c.texto,
                    }}
                  >
                    {isMobile ? dia.corto : dia.nombre}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 10,
                      color: c.secundario,
                    }}
                  >
                    {horariosDelDia(dia.id).length} horarios
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* FILAS HORARIAS */}

            <Box
              sx={{
                maxHeight: { xs: "65vh", md: 650 },
                overflowY: "auto",
              }}
            >
              {horas.map((hora) => (
                <Box
                  key={hora}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "65px repeat(7, minmax(0, 1fr))",
                    minHeight: 58,
                    borderBottom: `1px solid ${c.borde}`,
                  }}
                >
                  {/* HORA */}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: c.secundario,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {hora}
                  </Box>

                  {/* DÍAS */}

                  {dias.map((dia) => {
                    const horario = horarios.find(
                      (h) =>
                        Number(h.dia) === Number(dia.id) &&
                        h.hora_inicio === hora
                    );

                    const ocupadoPor = horarioOcupando(
                      dia.id,
                      hora
                    );

                    return (
                      <Box
                        key={dia.id}
                        sx={{
                          borderLeft: `1px solid ${c.borde}`,
                          p: 0.5,
                          minWidth: 0,
                        }}
                      >
                        {/* CELDA LIBRE */}

                        {!horario && !ocupadoPor ? (
                          <Button
                            fullWidth
                            onClick={() =>
                              abrirModalHorario(dia.id, hora)
                            }
                            aria-label={`Agregar horario ${dia.nombre} ${hora}`}
                            sx={{
                              height: "100%",
                              minHeight: 48,
                              minWidth: 0,
                              color: c.primario,
                              opacity: { xs: 0.7, md: 0 },
                              transition: "all 0.2s ease",
                              "&:hover": {
                                opacity: 1,
                                backgroundColor: c.hover,
                              },
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </Button>
                        ) : horario ? (
                          /* HORARIO CONFIGURADO */

                          <Box
                            sx={{
                              height: "100%",
                              minHeight: 48,
                              borderRadius: 1.5,
                              backgroundColor: c.bloque,
                              color: c.bloqueTexto,
                              border: `1px solid ${c.primario}`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              px: { xs: 0.5, md: 1 },
                              gap: 0.25,
                              minWidth: 0,
                            }}
                          >
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                              <Typography
                                sx={{
                                  fontSize: { xs: 10, md: 11 },
                                  fontWeight: 800,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {horario.hora_inicio}
                                {" - "}
                                {horario.hora_fin}
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 9,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {horario.categoria}
                              </Typography>

                              <Typography
                                sx={{
                                  fontSize: 9,
                                  opacity: 0.8,
                                }}
                              >
                                {horario.duracion} min
                              </Typography>
                            </Box>

                            <IconButton
                              size="small"
                              aria-label="Eliminar horario"
                              onClick={() => eliminarHorario(horario)}
                              sx={{
                                color: c.bloqueTexto,
                                p: 0.25,
                                "&:hover": {
                                  backgroundColor: modoOscuro
                                    ? "rgba(255,255,255,0.12)"
                                    : "rgba(0,0,0,0.08)",
                                },
                              }}
                            >
                              <DeleteOutlineIcon
                                sx={{ fontSize: 16 }}
                              />
                            </IconButton>
                          </Box>
                        ) : (
                          /* BLOQUE OCUPADO POR DURACIÓN */

                          <Box
                            sx={{
                              height: "100%",
                              minHeight: 48,
                              borderRadius: 1.5,
                              backgroundColor: c.ocupado,
                              color: c.ocupadoTexto,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              px: 0.5,
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: { xs: 9, md: 10 },
                                fontWeight: 600,
                              }}
                            >
                              Ocupado
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* ACCIONES */}

      <Paper
        elevation={0}
        sx={{
          mt: 2,
          p: { xs: 2, md: 2.5 },
          borderRadius: 3,
          backgroundColor: c.superficie,
          border: `1px solid ${c.borde}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: c.texto,
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            Configuración de horarios
          </Typography>

          <Typography
            sx={{
              color: c.secundario,
              fontSize: 12,
            }}
          >
            Los cambios se aplicarán al guardar.
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth={isMobile}
          startIcon={
            guardando ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <SaveIcon />
            )
          }
          disabled={guardando || horarios.length === 0}
          onClick={guardarHorarios}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.2,
            fontWeight: 800,
            textTransform: "none",
          }}
        >
          {guardando ? "Guardando..." : "Guardar horarios"}
        </Button>
      </Paper>

      {/* MODAL NUEVO HORARIO */}

      <Dialog
        open={modalAbierto}
        onClose={cerrarModal}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            backgroundColor: c.fondo,
            color: c.texto,
            border: `1px solid ${c.borde}`,
            borderRadius: 3,
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>
          Agregar horario
        </DialogTitle>

        <Divider sx={{ borderColor: c.borde }} />

        <DialogContent>
          <Box
            sx={{
              pt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* INFORMACIÓN */}

            <Box
              sx={{
                backgroundColor: c.encabezado,
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  color: c.secundario,
                }}
              >
                Día
              </Typography>

              <Typography fontWeight={800}>
                {dias.find((d) => d.id === nuevoHorario.dia)?.nombre}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  fontSize: 12,
                  color: c.secundario,
                }}
              >
                Hora de inicio
              </Typography>

              <Typography fontWeight={800}>
                {nuevoHorario.hora_inicio}
              </Typography>
            </Box>

            {/* CATEGORÍA */}

            <FormControl fullWidth sx={estilosInput}>
              <InputLabel>Categoría</InputLabel>

              <Select
                value={nuevoHorario.categoria}
                label="Categoría"
                onChange={(e) =>
                  setNuevoHorario((prev) => ({
                    ...prev,
                    categoria: e.target.value,
                  }))
                }
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria} value={categoria}>
                    {categoria}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* DURACIÓN */}

            <FormControl fullWidth sx={estilosInput}>
              <InputLabel>Duración</InputLabel>

              <Select
                value={nuevoHorario.duracion}
                label="Duración"
                onChange={(e) =>
                  setNuevoHorario((prev) => ({
                    ...prev,
                    duracion: Number(e.target.value),
                  }))
                }
              >
                {duraciones.map((duracion) => (
                  <MenuItem
                    key={duracion.value}
                    value={duracion.value}
                  >
                    {duracion.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* HORA FIN */}

            <Box
              sx={{
                backgroundColor: c.success,
                borderRadius: 2,
                p: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 12,
                  color: c.secundario,
                }}
              >
                El turno finalizará a las
              </Typography>

              <Typography
                fontWeight={900}
                sx={{ color: c.successTexto }}
              >
                {calcularHoraFin(
                  nuevoHorario.hora_inicio,
                  nuevoHorario.duracion
                )}
              </Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={cerrarModal}
            sx={{
              color: c.secundario,
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={confirmarHorario}
            sx={{
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Agregar horario
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}

      <Snackbar
        open={mensaje.open}
        autoHideDuration={3000}
        onClose={() =>
          setMensaje((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={mensaje.tipo}
          variant="filled"
          onClose={() =>
            setMensaje((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {mensaje.texto}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HorariosClinica;
