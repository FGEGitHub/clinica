import * as React from "react";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import servicioDtc from "../../../services/pacientes";
import { useState } from "react";
import { Paper, Grid } from "@mui/material";

// DatePicker
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { es } from "date-fns/locale";

export default function Modificar(props) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    id: props.id,
    nombre: props.nombre,
    apellido: props.apellido,
    dni: props.dni,
    telefono: props.telefono,
    domicilio: props.domicilio,
    fecha_nacimiento: props.fecha_nacimiento
      ? new Date(props.fecha_nacimiento)
      : null,
    fecha_ingreso: props.fecha_ingreso ? new Date(props.fecha_ingreso) : null,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
      alert(r);

      props.traer();
      setOpen(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        Modificar
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Modificar datos</DialogTitle>

        <Paper sx={{ p: 2 }}>
          <DialogContent>
            <Grid container spacing={2}>
              {/* Nombre */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Nombre"
                  fullWidth
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                />
              </Grid>

              {/* Apellido */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Apellido"
                  fullWidth
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                />
              </Grid>

              {/* DNI */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="DNI"
                  fullWidth
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                />
              </Grid>

              {/* Teléfono */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Teléfono"
                  fullWidth
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </Grid>

              {/* Dirección */}
              <Grid item xs={12} md={12}>
                <TextField
                  label="Dirección"
                  fullWidth
                  name="domicilio"
                  value={form.domicilio}
                  onChange={handleChange}
                />
              </Grid>

              {/* Fecha de nacimiento */}
              <Grid item xs={12} md={6}>
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={es}
                >
                  <DatePicker
                    label="Fecha de nacimiento"
                    value={form.fecha_nacimiento}
                    format="dd/MM/yyyy"
                    onChange={(newValue) =>
                      setForm({ ...form, fecha_nacimiento: newValue })
                    }
                  />
                </LocalizationProvider>
              </Grid>

              {/* Fecha de ingreso */}
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
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button variant="contained" onClick={handleGuardar}>
              Guardar
            </Button>
            <Button variant="outlined" color="error" onClick={handleClose}>
              Cancelar
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </>
  );
}
