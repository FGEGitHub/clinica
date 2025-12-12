import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Paper,
  Grid,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { es } from "date-fns/locale";

import servicioDtc from "../../../services/pacientes";

const NuevoTurno = ({ id_paciente, traer }) => {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    id_paciente: id_paciente,
    fecha: null,
    hora: "",
    asistencia: "",
    observaciones: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleGuardar = async () => {
    try {
      const enviar = {
        ...form,
        fecha: form.fecha ? form.fecha.toISOString().split("T")[0] : null,
      };

      const r = await servicioDtc.crearturno(enviar);

      alert(r);
      traer();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error al crear turno");
    }
  };

  return (
    <>
      <Button  variant="outlined"
                                sx={{ color: "black", borderColor: "red", fontSize: "0.70rem"   , }} color="primary" onClick={handleClickOpen}>
        Nuevo Turno
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Crear Nuevo Turno </DialogTitle>

        <Paper
          sx={{
            background: "#fafafa",
            border: "1px dashed #ccc",
            p: 1,
            "&:hover": { border: "1px solid #ccc" },
          }}
        >
          <DialogContent>
            <Grid container spacing={2}>
              {/* Fecha */}
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                  <DatePicker
                    label="Fecha"
                    value={form.fecha}
                    onChange={(newValue) => setForm({ ...form, fecha: newValue })}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>

              {/* Hora */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hora (HH:MM)"
                  name="hora"
                  value={form.hora}
                  onChange={handleChange}
                />
              </Grid>

              {/* Asistencia */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="motivo"
                  name="motivo"
                  value={form.motivo}
                  onChange={handleChange}
                />
              </Grid>

              {/* Observaciones */}
              <Grid item xs={12}>
            <TextField
  fullWidth
  multiline
  rows={3}
  label="Observaciones"
  name="observaciones"
  value={form.observaciones}
  onChange={handleChange}
  inputProps={{ maxLength: 120 }}      // ⬅️ límite visual real
  helperText={`${form.observaciones.length}/120 caracteres`} // opcional
/>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Cancelar
            </Button>

            <Button variant="contained" onClick={handleGuardar}>
              Guardar
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </>
  );
};

export default NuevoTurno;
