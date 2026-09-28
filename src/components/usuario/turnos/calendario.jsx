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
const [horariosEstandar, setHorariosEstandar] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnosDelDia, setTurnosDelDia] = useState([]);
const [horaNueva, setHoraNueva] = useState("");
const [obsNueva, setObsNueva] = useState("");
const [loadingNuevo, setLoadingNuevo] = useState(false);
const [duracionNueva, setDuracionNueva] = useState(30);
const [especialidades, setEspecialidades] = useState([]);
const [especialidadNueva, setEspecialidadNueva] = useState("");
  // --- CARGAR TURNOS ---
const traerTurnos = async () => {
  try {
    const usuario = JSON.parse(
      window.localStorage.getItem("loggedNoteAppUser")
    );

    const data = await servicioDtc.traerturnosusuario(usuario.id);

    console.log("RESPUESTA TURNOS:", data);

    // ==============================
    // 0 = HORARIOS CONFIGURADOS
    // 1 = TURNOS ASIGNADOS
    // ==============================

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

const calcularHoraFin = (
  horaInicio,
  duracion
) => {
  const [horas, minutos] =
    horaInicio
      .split(":")
      .map(Number);

  const fechaHora = new Date();

  fechaHora.setHours(
    horas,
    minutos,
    0,
    0
  );

  fechaHora.setMinutes(
    fechaHora.getMinutes() +
      Number(duracion)
  );

  return format(
    fechaHora,
    "HH:mm"
  );
};


const generarHorariosDelDia = (date) => {
  if (!date) return [];

  // JavaScript:
  // 0 = domingo
  // 1 = lunes
  // ...
  // 6 = sábado

  // Tu BD:
  // 1 = lunes
  // 2 = martes
  // ...
  // 7 = domingo

  const diaSemana =
    date.getDay() === 0
      ? 7
      : date.getDay();

  // Horarios configurados para ese día
  const horariosDelDia = horariosEstandar.filter(
    (h) => Number(h.dia) === diaSemana
  );

  // Turnos que ya existen para esa fecha
  const turnosExistentes = turnos.filter(
    (t) =>
      t.fecha &&
      format(parseISO(t.fecha), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
  );

  const resultado = [];

  horariosDelDia.forEach((horario) => {
    let horaActual = horario.hora_inicio;

    while (horaActual < horario.hora_fin) {

      // ¿Este horario ya está ocupado?
      const turnoExistente = turnosExistentes.find(
        (t) => t.hora === horaActual
      );

      // ==============================
      // SI YA EXISTE EL TURNO
      // ==============================

      if (turnoExistente) {
        resultado.push({
          ...turnoExistente,

          id_horario_estandar: horario.id,

          hora_inicio:
            turnoExistente.hora_inicio ||
            horaActual,

          hora_fin:
            turnoExistente.hora_fin ||
            calcularHoraFin(
              horaActual,
              horario.duracion
            ),

          duracion:
            turnoExistente.duracion ||
            Number(horario.duracion),

          especialidad:
            turnoExistente.especialidad ||
            horario.especialidad ||
            null,

          esDisponible: false,
        });
      }

      // ==============================
      // SI ESTÁ LIBRE
      // ==============================

      else {
        resultado.push({
          id: `libre-${format(
            date,
            "yyyy-MM-dd"
          )}-${horaActual}`,

          id_horario_estandar: horario.id,

          fecha: format(
            date,
            "yyyy-MM-dd"
          ),

          hora: horaActual,

          hora_inicio: horaActual,

          hora_fin: calcularHoraFin(
            horaActual,
            horario.duracion
          ),

          duracion: Number(
            horario.duracion
          ),

          consulta_paga:
            horario.consulta_paga,

          especialidad:
            horario.especialidad || null,

          esDisponible: true,

          // Para que la tabla pueda mostrarlo
          apellido: "",
          nombre: "",
        });
      }

      // ==============================
      // AVANZAR SEGÚN DURACIÓN
      // ==============================

      const [horas, minutos] =
        horaActual
          .split(":")
          .map(Number);

      const fechaHora = new Date();

      fechaHora.setHours(
        horas,
        minutos,
        0,
        0
      );

      fechaHora.setMinutes(
        fechaHora.getMinutes() +
          Number(horario.duracion)
      );

      horaActual = format(
        fechaHora,
        "HH:mm"
      );
    }
  });

  return resultado;
};


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

  // --- Marcar días con turnos ---
const tieneDisponibilidad = (date) => {
  if (!date) return false;

  const diaSemana =
    date.getDay() === 0
      ? 7
      : date.getDay();

  return horariosEstandar.some(
    (h) =>
      Number(h.dia) === diaSemana
  );
};

  // --- Cuando selecciono un día ---
const cargarTurnosDelDia = (date) => {
  if (!date) return;
  setSelectedDate(date);
};
useEffect(() => {
  if (!selectedDate) return;

  const lista =
    generarHorariosDelDia(selectedDate);

  setTurnosDelDia(lista);

}, [
  turnos,
  horariosEstandar,
  selectedDate
]);
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
    backgroundColor: "#242426",
    color: "#f4f4f5",
    border: "1px solid #36363a",
    borderRadius: 2,
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

  "--rdp-accent-color": "#3b82f6",
  "--rdp-background-color": "#343438",
},

    /* CONTENEDOR DEL MES */
  "& .rdp-month": {
  width: "100%",
  backgroundColor: "#2b2b2e",
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
  color: "#e4e4e7",

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
    tieneTurnos: tieneDisponibilidad,
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
<select
  value={especialidadNueva}
  onChange={(e) => setEspecialidadNueva(e.target.value)}
  style={{
    padding: "8px",
    fontSize: "16px",
    minWidth: "220px"
  }}
>
  <option value="">Seleccionar especialidad</option>

  {especialidades.map((especialidad) => (
    <option
      key={especialidad.id}
      value={especialidad.nombre}
    >
      {especialidad.nombre}
    </option>
  ))}
</select>
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

      <TableRow key={t.id || i}>

        <TableCell>
          <strong>
            {t.hora}
          </strong>
        </TableCell>

        <TableCell>
          {t.esDisponible
            ? "Disponible"
            : `${t.apellido || ""} ${
                t.nombre || ""
              }`}
        </TableCell>

        <TableCell>
          {t.especialidad ||
            "Sin especialidad"}
        </TableCell>

        <TableCell>

      {t.esDisponible ? (
  <button
    onClick={async () => {
      try {
        const usuario = JSON.parse(
          window.localStorage.getItem("loggedNoteAppUser")
        );

        // Primero creamos el turno real
        await servicioDtc.nuevoturnodisp({
          fecha: t.fecha,
          hora: t.hora,
          duracion: t.duracion,
          especialidad: t.especialidad || "",
          observaciones: "",
          id_usuario: usuario.id,
        });

        // Volvemos a traer los turnos para obtener
        // el ID real que generó el backend
        await traerTurnos();

        alert("Turno creado. Ahora podés agendar el paciente.");
      } catch (error) {
        console.error(error);
        alert("No se pudo crear el turno");
      }
    }}
    style={{
      padding: "7px 14px",
      background: "#2e7d32",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: "bold",
    }}
  >
    Agendar
  </button>
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
      >
        No hay horarios configurados
        para este día.
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
