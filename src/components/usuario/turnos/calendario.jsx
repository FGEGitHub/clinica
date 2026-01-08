import React, { useEffect, useState } from "react";
import { es } from "date-fns/locale";
import { startOfDay, format, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

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

  useEffect(() => {
    traerTurnos();
  }, []);

  // --- Marcar días con turnos ---
  const diasConTurnos = turnos.map((t) => t.fechaObj);

  // --- Cuando selecciono un día ---
  const cargarTurnosDelDia = (date) => {
    if (!date) return; // ⬅️ CLAVE

    setSelectedDate(date);

    const lista = turnos.filter(
      (t) =>
        startOfDay(parseISO(t.fecha)).getTime() ===
        startOfDay(date).getTime()
    );

    setTurnosDelDia(lista);
  };

  return (
    <Box sx={{ display: "flex", gap: 3, p: 2, height: "90vh" }}>
      {/* --- CALENDARIO --- */}
      <Paper sx={{ flex: 1.3, p: 2 }}>
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
          }}
        />
      </Paper>

      {/* --- TABLA DE TURNOS DEL DÍA --- */}
      <Paper sx={{ flex: 1, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Turnos del día:{" "}
          {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "--/--/----"}
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hora</TableCell>
                <TableCell>Paciente</TableCell>
                <TableCell>Asistencia</TableCell>
                <TableCell>Observaciones</TableCell>
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
                    <TableCell>{t.observaciones}</TableCell>
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
