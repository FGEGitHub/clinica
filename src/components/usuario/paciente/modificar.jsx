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

  // =========================
  // ANTECEDENTES PERSONALES
  // =========================

  hospitalizacion_2_anios:
    props.hospitalizacion_2_anios || "",

  atencion_medica_6_meses:
    props.atencion_medica_6_meses || "",

  tratamientos_quirurgicos:
    props.tratamientos_quirurgicos || "",

  medicacion_actual:
    props.medicacion_actual || "",

  alergias:
    props.alergias || "",

  grupo_sanguineo:
    props.grupo_sanguineo || "",

  antecedentes_hereditarios:
    props.antecedentes_hereditarios || "",

  problemas_coagulacion:
    props.problemas_coagulacion || "",

  fuma:
    props.fuma || "",

  embarazo:
    props.embarazo || "",

  anticonceptivos:
    props.anticonceptivos || "",

  presion_arterial:
    props.presion_arterial || "",

  hta:
    props.hta || "",

  enfermedades_sistemicas:
    props.enfermedades_sistemicas || "",

  enfermedades_transmision_sexual:
    props.enfermedades_transmision_sexual || "",

  hiv:
    props.hiv || "",
});

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });
  };

  const handleGuardar =
    async () => {

      try {

        const dataEnviar = {

          ...form,

          fecha_nacimiento:
            form.fecha_nacimiento
              ? form.fecha_nacimiento
                  .toISOString()
                  .split("T")[0]
              : null,

          fecha_ingreso:
            form.fecha_ingreso
              ? form.fecha_ingreso
                  .toISOString()
                  .split("T")[0]
              : null,
        };

        const r =
          await servicioDtc
          .modificarusuario(
            dataEnviar
          );

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
        sx={{
          color: "black",
          borderColor: "black",
          fontSize: "0.75rem",
        }}
        onClick={() =>
          setOpen(true)
        }
      >
        Modificar
      </Button>

      <Dialog
        open={open}
        onClose={() =>
          setOpen(false)
        }
        fullWidth
        maxWidth="md"
      >

        <DialogTitle>
          Modificar ficha del paciente
        </DialogTitle>

        <Paper sx={{ p: 3 }}>

          <DialogContent>

            {/* ========================= */}
            {/* DATOS PERSONALES */}
            {/* ========================= */}

            <Typography
              variant="subtitle1"
              fontWeight="bold"
              gutterBottom
            >
              Datos personales
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Grid
              container
              spacing={2}
            >

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  label="Nombre"
                  fullWidth
                  name="nombre"
                  value={form.nombre}
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  label="Apellido"
                  fullWidth
                  name="apellido"
                  value={form.apellido}
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={4}
              >
                <TextField
                  label="DNI"
                  fullWidth
                  name="dni"
                  value={form.dni}
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={4}
              >
                <TextField
                  select
                  label="Género"
                  fullWidth
                  name="genero"
                  value={form.genero}
                  onChange={
                    handleChange
                  }
                >
                  <MenuItem value="">
                    Sin especificar
                  </MenuItem>

                  <MenuItem value="Masculino">
                    Masculino
                  </MenuItem>

                  <MenuItem value="Femenino">
                    Femenino
                  </MenuItem>

                  <MenuItem value="Otro">
                    Otro
                  </MenuItem>

                </TextField>
              </Grid>

              <Grid
                item
                xs={12}
                md={4}
              >

                <LocalizationProvider
                  dateAdapter={
                    AdapterDateFns
                  }
                  adapterLocale={es}
                >

                  <DatePicker
                    label="Fecha de nacimiento"
                    value={
                      form.fecha_nacimiento
                    }
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                    onChange={(
                      newValue
                    ) =>
                      setForm({
                        ...form,
                        fecha_nacimiento:
                          newValue,
                      })
                    }
                  />

                </LocalizationProvider>

              </Grid>

            </Grid>

            {/* ========================= */}
            {/* CONTACTO */}
            {/* ========================= */}

            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mt: 4 }}
              gutterBottom
            >
              Contacto
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Grid
              container
              spacing={2}
            >

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  label="Teléfono"
                  fullWidth
                  name="telefono"
                  value={
                    form.telefono
                  }
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  label="Dirección"
                  fullWidth
                  name="direccion"
                  value={
                    form.direccion
                  }
                  onChange={
                    handleChange
                  }
                />
              </Grid>

            </Grid>

            {/* ========================= */}
            {/* OBRA SOCIAL */}
            {/* ========================= */}

            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mt: 4 }}
              gutterBottom
            >
              Datos de obra social
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Grid
              container
              spacing={2}
            >

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  label="Obra social"
                  fullWidth
                  name="obra_social"
                  value={
                    form.obra_social
                  }
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
              >
                <TextField
                  label="Número afiliado"
                  fullWidth
                  name="numero_afiliado"
                  value={
                    form.numero_afiliado
                  }
                  onChange={
                    handleChange
                  }
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
              >

                <LocalizationProvider
                  dateAdapter={
                    AdapterDateFns
                  }
                  adapterLocale={es}
                >

                  <DatePicker
                    label="Fecha ingreso"
                    value={
                      form.fecha_ingreso
                    }
                    format="dd/MM/yyyy"
                    onChange={(
                      newValue
                    ) =>
                      setForm({
                        ...form,
                        fecha_ingreso:
                          newValue,
                      })
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

            {/* ========================= */}
            {/* ANTECEDENTES */}
            {/* ========================= */}

            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ mt: 4 }}
              gutterBottom
            >
              Antecedentes personales
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Grid
              container
              spacing={2}
            >

              <Grid item xs={12} md={6}>
                <TextField
                  label="Hospitalización últimos 2 años"
                  fullWidth
                  name="hospitalizacion_2_anios"
                  value={form.hospitalizacion_2_anios}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Atención médica últimos 6 meses"
                  fullWidth
                  name="atencion_medica_6_meses"
                  value={form.atencion_medica_6_meses}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Tratamientos quirúrgicos"
                  fullWidth
                  multiline
                  rows={2}
                  name="tratamientos_quirurgicos"
                  value={form.tratamientos_quirurgicos}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Medicación actual"
                  fullWidth
                  multiline
                  rows={2}
                  name="medicacion_actual"
                  value={form.medicacion_actual}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Alergias"
                  fullWidth
                  name="alergias"
                  value={form.alergias}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Grupo sanguíneo"
                  fullWidth
                  name="grupo_sanguineo"
                  value={form.grupo_sanguineo}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Antecedentes hereditarios"
                  fullWidth
                  name="antecedentes_hereditarios"
                  value={form.antecedentes_hereditarios}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Problemas coagulación"
                  fullWidth
                  name="problemas_coagulacion"
                  value={form.problemas_coagulacion}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Fuma"
                  fullWidth
                  name="fuma"
                  value={form.fuma}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    Seleccionar
                  </MenuItem>

                  <MenuItem value="SI">
                    SI
                  </MenuItem>

                  <MenuItem value="NO">
                    NO
                  </MenuItem>

                </TextField>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  select
                  label="Embarazo"
                  fullWidth
                  name="embarazo"
                  value={form.embarazo}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    Seleccionar
                  </MenuItem>

                  <MenuItem value="SI">
                    SI
                  </MenuItem>

                  <MenuItem value="NO">
                    NO
                  </MenuItem>

                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Anticonceptivos"
                  fullWidth
                  name="anticonceptivos"
                  value={form.anticonceptivos}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Presión arterial"
                  fullWidth
                  name="presion_arterial"
                  value={form.presion_arterial}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="HTA"
                  fullWidth
                  name="hta"
                  value={form.hta}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Enfermedades sistémicas"
                  fullWidth
                  multiline
                  rows={2}
                  name="enfermedades_sistemicas"
                  value={form.enfermedades_sistemicas}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="ETS"
                  fullWidth
                  multiline
                  rows={2}
                  name="enfermedades_transmision_sexual"
                  value={form.enfermedades_transmision_sexual}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="HIV"
                  fullWidth
                  name="hiv"
                  value={form.hiv}
                  onChange={handleChange}
                />
              </Grid>

            </Grid>

          </DialogContent>

          <DialogActions sx={{ mt: 2 }}>

            <Button
              variant="contained"
              onClick={
                handleGuardar
              }
            >
              Guardar cambios
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() =>
                setOpen(false)
              }
            >
              Cancelar
            </Button>

          </DialogActions>

        </Paper>

      </Dialog>

    </>
  );
}