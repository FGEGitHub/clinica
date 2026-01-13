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
} from "@mui/material";

import servicioDtc from "../../../services/pacientes";

const CalendarioTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnosDelDia, setTurnosDelDia] = useState([]);
const [horaNueva, setHoraNueva] = useState("");
const [obsNueva, setObsNueva] = useState("");
const [loadingNuevo, setLoadingNuevo] = useState(false);
  // --- CARGAR TURNOS ---
  const traerTurnos = async () => {
    try {
      const data = await servicioDtc.traerturnos(); // debe devolver todos los turnos
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
  };

  try {
    setLoadingNuevo(true);
    await servicioDtc.nuevoturnodisp(nuevoTurno);

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
    flexDirection: { xs: "column", md: "row" }, // ⬅️ mobile abajo, PC al costado
    gap: 3,
    p: 2,
    height: { xs: "auto", md: "90vh" }, // ⬅️ en mobile que crezca natural
  }}
>
      {/* --- CALENDARIO --- */}
<Paper sx={{ flex: { xs: "none", md: 1.3 }, p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Calendario de Turnos
        </Typography>

        <DayPicker
          locale={es}
          mode="single"
          selected={selectedDate}
          onSelect={cargarTurnosDelDia}
          modifiers={{ tieneTurnos: diasConTurnos }}
          modifiersStyles={{
            tieneTurnos: { background: "#c8e6c9", borderRadius: "50%" },
          }}
          styles={{
            months: {
              width: "100%",
              height: "100%",
            },
            month: {
              fontSize: "1.5rem",
            },
            caption: {
              fontSize: "2rem",
              fontWeight: "bold",
              padding: "16px 0",
            },
            weekdays: {
              fontSize: "1.4rem",
            },
            weekday: {
              fontSize: "1.3rem",
              padding: "15px",
            },
            table: {
              width: "100%",
              height: "100%",
            },
            cell: {
              width: "90px",
              height: "90px",
              fontSize: "1.4rem",
            },
            day: {
              padding: "12px",
              margin: "4px",
              fontSize: "1.4rem",
              width: "100%",
              height: "100%",
            },
          }}jaja
        />
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
