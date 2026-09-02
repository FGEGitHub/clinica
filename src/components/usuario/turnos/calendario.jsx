import React, { useEffect, useState } from "react";
import { es } from "date-fns/locale";
import { startOfDay, format, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import AgendarTurno from "./AgendarTurno";
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
} from "@mui/material";

import servicioDtc from "../../../services/pacientes";

const CalendarioTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnosDelDia, setTurnosDelDia] = useState([]);
const [horaNueva, setHoraNueva] = useState("");
const [obsNueva, setObsNueva] = useState("");
const [loadingNuevo, setLoadingNuevo] = useState(false);
const [duracionNueva, setDuracionNueva] = useState(30);
  // --- CARGAR TURNOS ---
  const traerTurnos = async () => {
    try {
        const usuario = JSON.parse(
    window.localStorage.getItem("loggedNoteAppUser"))
      const data = await servicioDtc.traerturnosusuario(usuario.id); // debe devolver todos los turnos
      setTurnos(
        data.map((t) => ({
          ...t,
          fechaObj: startOfDay(parseISO(t.fecha)),
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };
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
};

  try {
    setLoadingNuevo(true);
    try {
  const usuario = JSON.parse(
    window.localStorage.getItem("loggedNoteAppUser")
  );

  await servicioDtc.nuevoturnodisp({
    ...nuevoTurno,
    id_usuario: usuario.id
  });

} catch (error) {
  console.error(error);
}

    // limpiar campos
    setHoraNueva("");
    setObsNueva("");

    // recargar turnos
    await traerTurnos();

    // refrescar lista del día actual
    cargarTurnosDelDia(selectedDate);
  } catch (error) {
    console.error(error);
    alert("Error al guardar turno");
  } finally {
    setLoadingNuevo(false);
  }
};

  useEffect(() => {
    traerTurnos();
  }, []);

  // --- Marcar días con turnos ---
  const diasConTurnos = turnos.map((t) => t.fechaObj);

  // --- Cuando selecciono un día ---
const cargarTurnosDelDia = (date) => {
  if (!date) return;
  setSelectedDate(date);
};
useEffect(() => {
  if (!selectedDate) return;

  const lista = turnos.filter(
    (t) =>
      startOfDay(parseISO(t.fecha)).getTime() ===
      startOfDay(selectedDate).getTime()
  );

  setTurnosDelDia(lista);
}, [turnos, selectedDate]);
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
      xs: 1,
      md: 2,
    },
    width: "100%",
    maxWidth: 1900,
    margin: "0 auto",
    overflowX: "hidden",
    height: {
      xs: "auto",
      md: "90vh",
    },
  }}
>
      {/* --- CALENDARIO --- */}
<Paper
  sx={{
    flex: { xs: "none", md: 1.5 },
    p: { xs: 2, md: 3 },
    minWidth: 0,
  }}
>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Calendario de Turnos
        </Typography>

 <Box
  sx={{
    width: "100%",
    display: "flex",
    justifyContent: "center",

    "& .rdp": {
      margin: 0,
      width: "100%",
      maxWidth: {
        xs: "100%",
        md: "850px",
      },
      "--rdp-accent-color": "#1976d2",
      "--rdp-background-color": "#e3f2fd",
    },

    /* CONTENEDOR DEL MES */
    "& .rdp-month": {
      width: "100%",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: {
        xs: "8px",
        md: "20px",
      },
      boxSizing: "border-box",
    },

    /* ENCABEZADO DEL MES */
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
      fontWeight: "700",
      color: "#1565c0",
      textTransform: "capitalize",
    },

    /* BOTONES ANTERIOR / SIGUIENTE */
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
      border: "1px solid #bbdefb",
      backgroundColor: "#e3f2fd",
      color: "#1565c0",
      transition: "all 0.2s ease",

      "&:hover": {
        backgroundColor: "#bbdefb",
        transform: "scale(1.05)",
      },
    },

    /* TABLA */
    "& .rdp-month_grid": {
      width: "100%",
    },

    "& .rdp-table": {
      width: "100%",
      maxWidth: "100%",
    },

    /* DÍAS DE LA SEMANA */
    "& .rdp-head_cell": {
      fontSize: {
        xs: "0.75rem",
        md: "1.1rem",
      },
      fontWeight: "700",
      color: "#546e7a",
      padding: {
        xs: "5px",
        md: "10px",
      },
      textTransform: "uppercase",
    },
/* CELDAS */
"& .rdp-cell": {
  padding: {
    xs: "2px",
    md: "6px",
  },
  textAlign: "center",
  verticalAlign: "middle",
},

/* DÍAS */
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
  fontWeight: "500",
  borderRadius: "50%",
  transition: "all 0.2s ease",
},

/* BOTÓN INTERNO DEL DÍA */
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
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
},
/* BOTÓN INTERNO DEL DÍA */
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
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  fontSize: {
    xs: "0.8rem",
    md: "1.35rem",
  },
},
    /* HOVER */
    "& .rdp-day:hover:not([disabled])": {
      backgroundColor: "#e3f2fd",
      color: "#1565c0",
      transform: "scale(1.08)",
    },

    /* DÍA SELECCIONADO */
    "& .rdp-selected .rdp-day_button": {
      backgroundColor: "#1976d2",
      color: "#ffffff",
      fontWeight: "700",
      boxShadow: "0 4px 10px rgba(25, 118, 210, 0.35)",
    },

    /* DÍA ACTUAL */
    "& .rdp-today:not(.rdp-selected) .rdp-day_button": {
      color: "#1976d2",
      fontWeight: "700",
      border: "2px solid #1976d2",
    },


/* DÍAS QUE TIENEN TURNOS */
"& .dia-con-turnos": {
  backgroundColor: "#c8e6c9 !important",
  color: "#1b5e20 !important",
  fontWeight: "700",
  borderRadius: "50%",
},

"& .rdp-selected.dia-con-turnos": {
  backgroundColor: "#1976d2 !important",
  color: "#ffffff !important",
},

    /* DÍAS FUERA DEL MES */
    "& .rdp-outside": {
      opacity: 0.35,
    },

    /* DÍAS DESHABILITADOS */
    "& .rdp-disabled": {
      opacity: 0.3,
    },
  }}
>
<DayPicker
  locale={es}
  mode="single"
  selected={selectedDate}
  onSelect={cargarTurnosDelDia}
  modifiers={{
    tieneTurnos: diasConTurnos,
  }}
  modifiersClassNames={{
    tieneTurnos: "dia-con-turnos",
  }}
/>
</Box>
      </Paper>

      {/* --- TABLA DE TURNOS DEL DÍA --- */}
<Paper sx={{ flex: { xs: "none", md: 1 }, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
          Turnos del día:{" "}
          {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "--/--/----"}
        </Typography>
<Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
  
  <input
    type="time"
    value={horaNueva}
    onChange={(e) => setHoraNueva(e.target.value)}
    style={{ padding: "8px", fontSize: "16px" }}
  />

  <input
    type="text"
    placeholder="Observaciones"
    value={obsNueva}
    onChange={(e) => setObsNueva(e.target.value)}
    style={{ padding: "8px", fontSize: "16px", flex: 1 }}
  />
<Box sx={{ width: 220, px: 1 }}>
  <Typography variant="body2">
    Duración: <strong>{duracionNueva} minutos</strong>

  </Typography>

  <Slider
  value={duracionNueva}
  onChange={(event, newValue) => {
    setDuracionNueva(Number(newValue));
  }}
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
/>
</Box>
  <button
    onClick={guardarNuevoTurno}
    disabled={loadingNuevo}
    style={{
      padding: "8px 16px",
      background: "#1976d2",
      color: "white",
      border: "none",
      cursor: "pointer",
      fontSize: "16px",
    }}
  >
    {loadingNuevo ? "Guardando..." : "Nuevo Turno"}
  </button>
</Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hora</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>Asistencia</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {turnosDelDia.length > 0 ? (
                turnosDelDia.map((t, i) => (
                  <TableRow key={i}>
                    <TableCell>{t.hora}</TableCell>
                    <TableCell>
                      {t.apellido} {t.nombre}
                    </TableCell>
                    <TableCell>{t.asistencia}</TableCell>
                <TableCell>
  <AgendarTurno
    idTurno={t.id}
    onAgendar={(data) => {
      servicioDtc.agendarapaciente(data)
        .then(() => traerTurnos());
    }}
  />
</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No hay turnos para este día.
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
