import * as React from "react";
import { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Grid,
  MenuItem,
  Divider,
  Typography,
} from "@mui/material";

import servicioDtc from "../../../services/pacientes";

// DatePicker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { es } from "date-fns/locale";

export default function Modificar(props) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    id: props.id,
    nombre: props.nombre || "",
    apellido: props.apellido || "",
    dni: props.dni || "",
    genero: props.genero || "",
    telefono: props.telefono || "",
    direccion: props.direccion || "",
    obra_social: props.obra_social || "",
    numero_afiliado: props.numero_afiliado || "",
    fecha_nacimiento: props.fecha_nacimiento
      ? new Date(props.fecha_nacimiento)
      : null,
    fecha_ingreso: props.fecha_ingreso
      ? new Date(props.fecha_ingreso)
      : null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      const dataEnviar = {
        ...form,
        fecha_nacimiento: form.fecha_nacimiento
          ? form.fecha_nacimiento.toISOString().split("T")[0]
          : null,
        fecha_ingreso: form.fecha_ingreso
          ? form.fecha_ingreso.toISOString().split("T")[0]
          : null,
      };

      const r = await servicioDtc.modificarusuario(dataEnviar);

      if (r?.ok === false) {
        alert(r.msg);
        return;
      }

      props.traer();
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        sx={{ color: "black", borderColor: "black", fontSize: "0.75rem" }}
        onClick={() => setOpen(true)}
      >
        Modificar
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Modificar ficha del paciente</DialogTitle>

        <Paper sx={{ p: 3 }}>
          <DialogContent>
            {/* DATOS PERSONALES */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Datos personales
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre"
                  fullWidth
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Apellido"
                  fullWidth
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="DNI"
                  fullWidth
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  select
                  label="Género"
                  fullWidth
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                >
                  <MenuItem value="">Sin especificar</MenuItem>
                  <MenuItem value="Masculino">Masculino</MenuItem>
                  <MenuItem value="Femenino">Femenino</MenuItem>
                  <MenuItem value="Otro">Otro</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} md={4}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={es}
                >
                  <DatePicker
                    label="Fecha de nacimiento"
                    value={form.fecha_nacimiento}
                    format="dd/MM/yyyy"
                    slotProps={{ textField: { fullWidth: true } }}
                    onChange={(newValue) =>
                      setForm({ ...form, fecha_nacimiento: newValue })
                    }
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            {/* CONTACTO */}
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mt: 4 }}
              gutterBottom
            >
              Contacto
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Teléfono"
                  fullWidth
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Dirección"
                  fullWidth
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            {/* OBRA SOCIAL */}
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mt: 4 }}
              gutterBottom
            >
              Datos de obra social
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Obra social"
                  fullWidth
                  name="obra_social"
                  value={form.obra_social}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Número de afiliado"
                  fullWidth
                  name="numero_afiliado"
                  value={form.numero_afiliado}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={es}
                >
                  <DatePicker
    label="Fecha de ingreso"
    value={form.fecha_ingreso}
    format="dd/MM/yyyy"
    onChange={(newValue) =>
      setForm({ ...form, fecha_ingreso: newValue })
    }
    slotProps={{
      textField: {
        fullWidth: true,
      },
    }}
  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ mt: 2 }}>
            <Button variant="contained" onClick={handleGuardar}>
              Guardar cambios
            </Button>
            <Button variant="outlined" color="error" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </>
  );
}
