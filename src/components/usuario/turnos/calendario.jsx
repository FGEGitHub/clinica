
import React, { useEffect, useState } from "react";
import { es } from "date-fns/locale";
import { startOfDay, format, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import AgendarTurno from "./AgendarTurno";
import { usePanelTheme } from "../menuizq";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Slider,
  Button,
  TextField,
  MenuItem,
  Chip,
  Divider,
} from "@mui/material";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";

import servicioDtc from "../../../services/pacientes";

const CalendarioTurnos = () => {

  // =========================================================
  // TEMA HEREDADO DEL COMPONENTE PADRE
  // =========================================================

  const { mode, colors } = usePanelTheme();
  const isDark = mode === "dark";

  const panel = {
    background: colors.card,
    text: colors.text,
    secondary: colors.secondary,
    border: colors.border,
    active: colors.active,
    primary: colors.primary,
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      color: panel.text,
      backgroundColor: isDark ? "#172235" : "#f8fafc",
      borderRadius: 2,
      "& fieldset": {
        borderColor: panel.border,
      },
      "&:hover fieldset": {
        borderColor: panel.primary,
      },
      "&.Mui-focused fieldset": {
        borderColor: panel.primary,
      },
    },
    "& .MuiInputLabel-root": {
      color: panel.secondary,
    },
    "& .MuiSvgIcon-root": {
      color: panel.secondary,
    },
  };

  const [turnos, setTurnos] = useState([]);
  const [horariosEstandar, setHorariosEstandar] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnosDelDia, setTurnosDelDia] = useState([]);

  const [horaNueva, setHoraNueva] = useState("");
  const [obsNueva, setObsNueva] = useState("");
  const [loadingNuevo, setLoadingNuevo] = useState(false);

  const [duracionNueva, setDuracionNueva] = useState(30);

  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadNueva, setEspecialidadNueva] = useState("");

  // =========================================================
  // TRAER TURNOS
  // =========================================================

  const traerTurnos = async () => {
    try {
      const usuario = JSON.parse(
        window.localStorage.getItem("loggedNoteAppUser")
      );

      const data = await servicioDtc.traerturnosusuario(usuario.id);

      const horarios = data?.[0] || [];
      const turnosAsignados = data?.[1] || [];

      setHorariosEstandar(horarios);

      setTurnos(
        turnosAsignados.map((t) => ({
          ...t,
          fechaObj: t.fecha
            ? startOfDay(parseISO(t.fecha))
            : null,
        }))
      );

    } catch (error) {
      console.error("Error trayendo turnos:", error);
    }
  };

  // =========================================================
  // GUARDAR NUEVO TURNO
  // =========================================================

  const guardarNuevoTurno = async () => {

    if (!selectedDate || !horaNueva) {
      alert("Seleccioná una fecha y una hora");
      return;
    }

    const nuevoTurno = {
      fecha: format(selectedDate, "yyyy-MM-dd"),
      hora: horaNueva,
      observaciones: obsNueva || "",
      duracion: Number(duracionNueva),
      especialidad: especialidadNueva,
    };

    try {
      setLoadingNuevo(true);

      const usuario = JSON.parse(
        window.localStorage.getItem("loggedNoteAppUser")
      );

      await servicioDtc.nuevoturnodisp({
        ...nuevoTurno,
        id_usuario: usuario.id,
      });

      setHoraNueva("");
      setObsNueva("");

      await traerTurnos();

    } catch (error) {
      console.error(error);
      alert("Error al guardar turno");
    } finally {
      setLoadingNuevo(false);
    }
  };

  // =========================================================
  // CALCULAR HORA FIN
  // =========================================================

  const calcularHoraFin = (horaInicio, duracion) => {

    const [horas, minutos] = horaInicio.split(":").map(Number);

    const fechaHora = new Date();

    fechaHora.setHours(horas, minutos, 0, 0);

    fechaHora.setMinutes(
      fechaHora.getMinutes() + Number(duracion)
    );

    return format(fechaHora, "HH:mm");
  };

  // =========================================================
  // GENERAR HORARIOS DEL DÍA
  // =========================================================

  const generarHorariosDelDia = (date) => {

    if (!date) return [];

    const fechaSeleccionada = format(date, "yyyy-MM-dd");

    const diaSemana =
      date.getDay() === 0 ? 7 : date.getDay();

    const horariosDelDia = horariosEstandar.filter(
      (h) => Number(h.dia) === diaSemana
    );

    const turnosExistentes = turnos.filter(
      (t) =>
        t.fecha &&
        format(parseISO(t.fecha), "yyyy-MM-dd") === fechaSeleccionada
    );

    const resultado = [];
    const horasAgregadas = new Set();

    horariosDelDia.forEach((horario) => {

      let horaActual = horario.hora_inicio;

      while (horaActual < horario.hora_fin) {

        const turnoExistente = turnosExistentes.find(
          (t) => t.hora === horaActual
        );

        if (turnoExistente) {

          resultado.push({
            ...turnoExistente,

            id_horario_estandar: horario.id,

            hora_inicio:
              turnoExistente.hora_inicio || horaActual,

            hora_fin:
              turnoExistente.hora_fin ||
              calcularHoraFin(horaActual, horario.duracion),

            duracion:
              turnoExistente.duracion ||
              Number(horario.duracion),

            especialidad:
              turnoExistente.especialidad ||
              horario.especialidad ||
              null,

            esDisponible: false,
            esExcepcional: false,
          });

          horasAgregadas.add(turnoExistente.hora);

        } else {

          resultado.push({
            id: `libre-${fechaSeleccionada}-${horaActual}`,

            id_horario_estandar: horario.id,

            fecha: fechaSeleccionada,
            hora: horaActual,
            hora_inicio: horaActual,

            hora_fin: calcularHoraFin(
              horaActual,
              horario.duracion
            ),

            duracion: Number(horario.duracion),

            consulta_paga: horario.consulta_paga,

            especialidad: horario.especialidad || null,

            esDisponible: true,
            esExcepcional: false,

            apellido: "",
            nombre: "",
          });
        }

        const [horas, minutos] = horaActual
          .split(":")
          .map(Number);

        const fechaHora = new Date();

        fechaHora.setHours(horas, minutos, 0, 0);

        fechaHora.setMinutes(
          fechaHora.getMinutes() + Number(horario.duracion)
        );

        horaActual = format(fechaHora, "HH:mm");
      }
    });

    // TURNOS EXCEPCIONALES

    turnosExistentes.forEach((turno) => {

      if (horasAgregadas.has(turno.hora)) return;

      resultado.push({
        ...turno,

        hora_inicio: turno.hora_inicio || turno.hora,

        hora_fin:
          turno.hora_fin ||
          calcularHoraFin(turno.hora, turno.duracion || 30),

        duracion: Number(turno.duracion) || 30,

        esDisponible: false,
        esExcepcional: true,
      });
    });

    resultado.sort((a, b) =>
      a.hora.localeCompare(b.hora)
    );

    return resultado;
  };

  // =========================================================
  // INDICADORES DEL CALENDARIO
  // =========================================================

  const tieneTurnosExistentes = (date) => {

    if (!date) return false;

    const fecha = format(date, "yyyy-MM-dd");

    return turnos.some(
      (turno) =>
        turno.fecha &&
        format(parseISO(turno.fecha), "yyyy-MM-dd") === fecha
    );
  };

  const tieneTurnosHabituales = (date) => {

    if (!date) return false;

    const diaSemana =
      date.getDay() === 0 ? 7 : date.getDay();

    return horariosEstandar.some(
      (horario) => Number(horario.dia) === diaSemana
    );
  };

  const tieneTurnoExcepcional = (date) => {

    if (!date) return false;

    const fecha = format(date, "yyyy-MM-dd");

    const diaSemana =
      date.getDay() === 0 ? 7 : date.getDay();

    const horariosDelDia = horariosEstandar.filter(
      (h) => Number(h.dia) === diaSemana
    );

    const turnosDelDia = turnos.filter(
      (t) =>
        t.fecha &&
        format(parseISO(t.fecha), "yyyy-MM-dd") === fecha
    );

    if (turnosDelDia.length === 0) return false;

    return turnosDelDia.some((turno) => {

      return !horariosDelDia.some((horario) => {

        return (
          turno.hora >= horario.hora_inicio &&
          turno.hora < horario.hora_fin
        );

      });

    });
  };

  // =========================================================
  // CARGA INICIAL
  // =========================================================

  useEffect(() => {

    const cargarDatos = async () => {

      try {

        const usuario = JSON.parse(
          window.localStorage.getItem("loggedNoteAppUser")
        );

        const especialidadesData =
          await servicioDtc.traerespecialidades(usuario.id);

        setEspecialidades(especialidadesData);

        await traerTurnos();

      } catch (error) {

        console.error("Error al cargar especialidades:", error);

      }

    };

    cargarDatos();

  }, []);

  // =========================================================
  // SELECCIONAR DÍA
  // =========================================================

  const cargarTurnosDelDia = (date) => {

    if (!date) return;

    setSelectedDate(date);

  };

  // =========================================================
  // ACTUALIZAR TABLA
  // =========================================================

  useEffect(() => {

    if (!selectedDate) return;

    const lista = generarHorariosDelDia(selectedDate);

    setTurnosDelDia(lista);

  }, [turnos, horariosEstandar, selectedDate]);

  // =========================================================
  // CREAR TURNO DESDE TABLA
  // =========================================================

  const crearTurnoDesdeTabla = async (t) => {

    try {

      const usuario = JSON.parse(
        window.localStorage.getItem("loggedNoteAppUser")
      );

      await servicioDtc.nuevoturnodisp({
        fecha: t.fecha,
        hora: t.hora,
        duracion: t.duracion,
        especialidad: t.especialidad || "",
        observaciones: "",
        id_usuario: usuario.id,
      });

      await traerTurnos();

      alert("Turno creado. Ahora podés agendar el paciente.");

    } catch (error) {

      console.error(error);

      alert("No se pudo crear el turno");

    }

  };

  // =========================================================
  // ESTILOS DEL CALENDARIO
  // =========================================================

  const calendarStyles = {

    "& .rdp": {
      margin: 0,
      width: "100%",
      maxWidth: {
        xs: "100%",
        md: "850px",
      },
      "--rdp-accent-color": panel.primary,
      "--rdp-background-color": panel.active,
    },

    "& .rdp-month": {
      width: "100%",
      backgroundColor: panel.card,
      borderRadius: "16px",
      padding: {
        xs: "8px",
        md: "20px",
      },
      boxSizing: "border-box",
    },

    "& .rdp-month_caption": {
      height: {
        xs: "50px",
        md: "70px",
      },
    },

    "& .rdp-caption_label": {
      fontSize: {
        xs: "1.1rem",
        md: "2rem",
      },
      fontWeight: 700,
      color: panel.text,
      textTransform: "capitalize",
    },

    "& .rdp-button_previous, & .rdp-button_next": {
      width: {
        xs: "38px",
        md: "50px",
      },
      height: {
        xs: "38px",
        md: "50px",
      },
      borderRadius: "12px",
      border: `1px solid ${panel.border}`,
      backgroundColor: panel.active,
      color: panel.text,
      "&:hover": {
        backgroundColor: panel.border,
      },
    },

    "& .rdp-month_grid": {
      width: "100%",
    },

    "& .rdp-head_cell": {
      fontSize: {
        xs: "0.7rem",
        md: "1.1rem",
      },
      fontWeight: 700,
      color: panel.secondary,
      padding: {
        xs: "5px",
        md: "10px",
      },
      textTransform: "uppercase",
    },

    "& .rdp-cell": {
      padding: {
        xs: "2px",
        md: "6px",
      },
      textAlign: "center",
    },

    "& .rdp-day": {
      width: {
        xs: "36px",
        md: "85px",
      },
      height: {
        xs: "36px",
        md: "85px",
      },
      maxWidth: {
        xs: "36px",
        md: "85px",
      },
      padding: 0,
      margin: "0 auto",
      fontSize: {
        xs: "0.8rem",
        md: "1.35rem",
      },
      fontWeight: 500,
      borderRadius: "50%",
      color: panel.text,
    },

    "& .rdp-day_button": {
      width: {
        xs: "36px",
        md: "85px",
      },
      height: {
        xs: "36px",
        md: "85px",
      },
      maxWidth: {
        xs: "36px",
        md: "85px",
      },
      padding: 0,
      margin: "0 auto",
      borderRadius: "50%",
      fontSize: {
        xs: "0.8rem",
        md: "1.35rem",
      },
      color: panel.text,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },

    "& .rdp-day:hover:not([disabled])": {
      backgroundColor: panel.active,
      color: panel.text,
    },

    "& .rdp-selected .rdp-day_button": {
      backgroundColor: `${panel.primary} !important`,
      color: "#ffffff !important",
      fontWeight: 700,
      boxShadow: "0 4px 10px rgba(25,118,210,0.25)",
    },

    "& .rdp-today:not(.rdp-selected) .rdp-day_button": {
      color: panel.primary,
      fontWeight: 700,
      border: `2px solid ${panel.primary}`,
    },

    "& .dia-con-turnos": {
      position: "relative",
    },

    "& .dia-con-turnos::before": {
      content: '"*"',
      position: "absolute",
      top: {
        xs: "1px",
        md: "5px",
      },
      left: {
        xs: "12px",
        md: "32px",
      },
      fontSize: {
        xs: "16px",
        md: "24px",
      },
      fontWeight: 900,
      color: "#4caf50",
      lineHeight: 1,
      zIndex: 2,
    },

    "& .dia-con-turnos-existentes": {
      position: "relative",
    },

    "& .dia-con-turnos-existentes::before": {
      content: '"*"',
      position: "absolute",
      top: {
        xs: "1px",
        md: "5px",
      },
      right: {
        xs: "12px",
        md: "32px",
      },
      fontSize: {
        xs: "16px",
        md: "24px",
      },
      fontWeight: 900,
      color: "#2196f3",
      lineHeight: 1,
      zIndex: 2,
    },

    "& .dia-con-excepcional": {
      position: "relative",
    },

    "& .dia-con-excepcional::after": {
      content: '"*"',
      position: "absolute",
      top: {
        xs: "1px",
        md: "5px",
      },
      right: {
        xs: "2px",
        md: "8px",
      },
      fontSize: {
        xs: "16px",
        md: "24px",
      },
      fontWeight: 900,
      color: "#f57c00",
      lineHeight: 1,
      zIndex: 2,
    },

    "& .rdp-outside": {
      opacity: 0.35,
    },

    "& .rdp-disabled": {
      opacity: 0.3,
    },

  };

  // =========================================================
  // RENDER
  // =========================================================

  return (

    <Box
      sx={{
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        gap: 3,
        p: {
          xs: 0,
          sm: 1,
          md: 2,
        },
        width: "100%",
        maxWidth: 1900,
        margin: "0 auto",
        overflowX: "hidden",
        alignItems: "stretch",
      }}
    >

      {/* =====================================================
          CALENDARIO
      ===================================================== */}

      <Paper
        sx={{
          flex: {
            xs: "none",
            md: 1.5,
          },
          p: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },
          minWidth: 0,
          backgroundColor: panel.background,
          color: panel.text,
          border: `1px solid ${panel.border}`,
          borderRadius: 3,
          boxShadow: isDark
            ? "none"
            : "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >

        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 750,
            fontSize: {
              xs: 19,
              md: 25,
            },
          }}
        >
          Calendario de Turnos
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            ...calendarStyles,
          }}
        >

          <DayPicker
            locale={es}
            mode="single"
            selected={selectedDate}
            onSelect={cargarTurnosDelDia}
            modifiers={{
              tieneTurnos: tieneTurnosHabituales,
              tieneTurnosExistentes: tieneTurnosExistentes,
              tieneExcepcional: tieneTurnoExcepcional,
            }}
            modifiersClassNames={{
              tieneTurnos: "dia-con-turnos",
              tieneTurnosExistentes: "dia-con-turnos-existentes",
              tieneExcepcional: "dia-con-excepcional",
            }}
          />

        </Box>

        {/* LEYENDA */}

        <Divider sx={{ my: 2, borderColor: panel.border }} />

        <Box
          sx={{
            display: "flex",
            gap: {
              xs: 1.5,
              md: 3,
            },
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >

          <Typography variant="caption" sx={{ color: panel.text }}>
            <span style={{ color: "#4caf50" }}>●</span> Horario habitual
          </Typography>

          <Typography variant="caption" sx={{ color: panel.text }}>
            <span style={{ color: "#2196f3" }}>●</span> Turno existente
          </Typography>

          <Typography variant="caption" sx={{ color: panel.text }}>
            <span style={{ color: "#f57c00" }}>●</span> Fuera de horario
          </Typography>

        </Box>

      </Paper>

      {/* =====================================================
          TABLA DE TURNOS
      ===================================================== */}

      <Paper
        sx={{
          flex: {
            xs: "none",
            md: 1,
          },
          minWidth: 0,
          p: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },
          backgroundColor: panel.background,
          color: panel.text,
          border: `1px solid ${panel.border}`,
          borderRadius: 3,
          boxShadow: isDark
            ? "none"
            : "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >

        {/* ENCABEZADO */}

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            gap: 1,
            mb: 2,
          }}
        >

          <Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 750,
                color: panel.text,
              }}
            >
              Turnos del día
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: panel.secondary }}
            >
              {selectedDate
                ? format(selectedDate, "dd/MM/yyyy")
                : "--/--/----"}
            </Typography>

          </Box>

          <Chip
            icon={<AccessTimeIcon />}
            label={`${turnosDelDia.length} horarios`}
            sx={{
              color: panel.primary,
              bgcolor: isDark ? "#1e3a5f" : "#e8eefc",
              fontWeight: 700,
            }}
          />

        </Box>

        <Divider sx={{ mb: 2, borderColor: panel.border }} />

        {/* NUEVO TURNO */}

        <Typography
          sx={{
            mb: 2,
            fontWeight: 700,
            color: panel.text,
          }}
        >
          Agregar horario excepcional
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(2, minmax(0, 1fr))",
            },
            gap: 1.5,
            mb: 2,
          }}
        >

          <TextField
            type="time"
            label="Hora"
            value={horaNueva}
            onChange={(e) => setHoraNueva(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            size="small"
            sx={inputStyles}
          />

          <TextField
            select
            label="Especialidad"
            value={especialidadNueva}
            onChange={(e) => setEspecialidadNueva(e.target.value)}
            fullWidth
            size="small"
            sx={inputStyles}
          >

            <MenuItem value="">
              Seleccionar especialidad
            </MenuItem>

            {especialidades.map((especialidad) => (
              <MenuItem
                key={especialidad.id}
                value={especialidad.nombre}
              >
                {especialidad.nombre}
              </MenuItem>
            ))}

          </TextField>

          <TextField
            label="Observaciones"
            value={obsNueva}
            onChange={(e) => setObsNueva(e.target.value)}
            fullWidth
            size="small"
            sx={{
              ...inputStyles,
              gridColumn: {
                xs: "auto",
                sm: "1 / -1",
              },
            }}
          />

          <Box
            sx={{
              gridColumn: "1 / -1",
              px: 1,
              py: 1,
            }}
          >

            <Typography
              variant="body2"
              sx={{
                color: panel.text,
                fontWeight: 600,
                mb: 1,
              }}
            >
              Duración: {duracionNueva} minutos
            </Typography>

            <Slider
              value={duracionNueva}
              onChange={(event, newValue) =>
                setDuracionNueva(Number(newValue))
              }
              min={30}
              max={90}
              step={null}
              marks={[
                { value: 30, label: "30" },
                { value: 45, label: "45" },
                { value: 60, label: "60" },
                { value: 90, label: "90" },
              ]}
              valueLabelDisplay="auto"
              sx={{
                color: panel.primary,
                "& .MuiSlider-markLabel": {
                  color: panel.secondary,
                },
              }}
            />

          </Box>

          <Button
            onClick={guardarNuevoTurno}
            disabled={loadingNuevo}
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth
            sx={{
              gridColumn: "1 / -1",
              py: 1.3,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              backgroundColor: panel.primary,
              "&:hover": {
                backgroundColor: panel.primary,
                filter: "brightness(0.9)",
              },
            }}
          >
            {loadingNuevo ? "Guardando..." : "Nuevo turno"}
          </Button>

        </Box>

        <Divider sx={{ my: 2, borderColor: panel.border }} />

        {/* TABLA */}

        <Typography
          sx={{
            mb: 2,
            fontWeight: 700,
            color: panel.text,
          }}
        >
          Listado de horarios
        </Typography>

        <TableContainer
          sx={{
            width: "100%",
            overflowX: "auto",
            border: `1px solid ${panel.border}`,
            borderRadius: 2,
          }}
        >

          <Table
            size="small"
            sx={{
              minWidth: 520,
              "& .MuiTableCell-root": {
                color: panel.text,
                borderColor: panel.border,
                py: 1.5,
              },
              "& .MuiTableHead-root": {
                backgroundColor: panel.active,
              },
            }}
          >

            <TableHead>

              <TableRow>

                <TableCell>
                  <strong>Hora</strong>
                </TableCell>

                <TableCell>
                  <strong>Paciente</strong>
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

              {turnosDelDia.length > 0 ? (

                turnosDelDia.map((t, i) => (

                  <TableRow
                    key={t.id || i}
                    hover
                    sx={{
                      "&:hover": {
                        backgroundColor: panel.active,
                      },
                    }}
                  >

                    <TableCell>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >

                        <Typography
                          sx={{
                            fontWeight: 700,
                            fontSize: 14,
                          }}
                        >
                          {t.hora}
                        </Typography>

                        <Chip
                          size="small"
                          label={t.esDisponible ? "Disponible" : "Ocupado"}
                          color={t.esDisponible ? "success" : "default"}
                          sx={{
                            width: "fit-content",
                            fontSize: 11,
                          }}
                        />

                      </Box>

                    </TableCell>

                    <TableCell>
                      {t.esDisponible
                        ? "Sin asignar"
                        : `${t.apellido || ""} ${t.nombre || ""}`}
                    </TableCell>

                    <TableCell>
                      {t.especialidad || "Sin especialidad"}
                    </TableCell>

                    <TableCell align="center">

                      {t.esDisponible ? (

                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => crearTurnoDesdeTabla(t)}
                          sx={{
                            textTransform: "none",
                            fontWeight: 700,
                            borderRadius: 2,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Crear turno
                        </Button>

                      ) : (

                        <AgendarTurno
                          idTurno={t.id}
                          onAgendar={(data) => {
                            servicioDtc
                              .agendarapaciente(data)
                              .then(() => traerTurnos());
                          }}
                        />

                      )}

                    </TableCell>

                  </TableRow>

                ))

              ) : (

                <TableRow>

                  <TableCell
                    colSpan={4}
                    align="center"
                    sx={{
                      py: 5,
                      color: panel.secondary,
                    }}
                  >
                    No hay horarios configurados para este día.

                  </TableCell>

                </TableRow>

              )}

            </TableBody>

          </Table>

        </TableContainer>

      </Paper>

    </Box>

  );
};

export default CalendarioTurnos;
