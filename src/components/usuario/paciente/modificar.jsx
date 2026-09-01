
import * as React from "react";
import { useState } from "react";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Divider,
  Typography,
  Box,
  IconButton,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import servicioDtc from "../../../services/pacientes";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { es } from "date-fns/locale";

export default function Modificar(props) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    id: props.id,

    // DATOS PERSONALES
    nombre: props.nombre || "",
    apellido: props.apellido || "",
    dni: props.dni || "",
    genero: props.genero || "",

    // CONTACTO
    telefono: props.telefono || "",
    direccion: props.direccion || "",

    // OBRA SOCIAL
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

  // =========================
  // CAMBIAR VALOR
  // =========================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // GUARDAR
  // =========================

  const handleGuardar = async () => {
    try {
      const dataEnviar = {
        ...form,

        fecha_nacimiento: form.fecha_nacimiento
          ? form.fecha_nacimiento
              .toISOString()
              .split("T")[0]
          : null,

        fecha_ingreso: form.fecha_ingreso
          ? form.fecha_ingreso
              .toISOString()
              .split("T")[0]
          : null,
      };

      const r =
        await servicioDtc.modificarusuario(dataEnviar);

      if (r?.ok === false) {
        alert(r.msg);
        return;
      }

      props.traer();

      setOpen(false);

    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al guardar los cambios.");
    }
  };

  // =========================
  // COMPONENTE DE SECCIÓN
  // =========================

  const Seccion = ({ titulo, descripcion, children }) => (
    <Box sx={{ mb: 4 }}>

      <Box sx={{ mb: 2 }}>

        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            color: "#263238",
            mb: descripcion ? 0.5 : 0,
          }}
        >
          {titulo}
        </Typography>

        {descripcion && (
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {descripcion}
          </Typography>
        )}

      </Box>

      <Divider sx={{ mb: 2.5 }} />

      {children}

    </Box>
  );

  return (
    <>
      {/* =========================
          BOTÓN MODIFICAR
      ========================= */}

      <Button
        variant="outlined"
        size="small"
        sx={{
          color: "black",
          borderColor: "black",
          fontSize: "0.75rem",
          textTransform: "none",
          "&:hover": {
            borderColor: "black",
            backgroundColor: "#f5f5f5",
          },
        }}
        onClick={() => setOpen(true)}
      >
        Modificar
      </Button>

      {/* =========================
          MODAL
      ========================= */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="xl"
        scroll="paper"
        PaperProps={{
          sx: {
            width: "95vw",
            maxWidth: "1450px",
            maxHeight: "94vh",
            borderRadius: 3,
            overflow: "hidden",
          },
        }}
      >

        {/* =========================
            ENCABEZADO
        ========================= */}

        <DialogTitle
          sx={{
            px: 4,
            py: 2.5,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
          }}
        >

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >

            <Box>

              <Typography
                variant="h5"
                fontWeight={700}
                color="text.primary"
              >
                Modificar ficha del paciente
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Actualice la información personal, de contacto,
                obra social y antecedentes.
              </Typography>

            </Box>

            <IconButton
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              sx={{
                border: "1px solid #ddd",
                "&:hover": {
                  backgroundColor: "#eeeeee",
                },
              }}
            >
              <CloseIcon />
            </IconButton>

          </Box>

        </DialogTitle>

        {/* =========================
            CONTENIDO
        ========================= */}

        <DialogContent
          dividers
          sx={{
            px: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            py: 3,
            backgroundColor: "#ffffff",
          }}
        >

          {/* =========================
              DATOS PERSONALES
          ========================= */}

          <Seccion
            titulo="Datos personales"
            descripcion="Información básica de identificación del paciente."
          >

            <Grid container spacing={2.5}>

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

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="DNI"
                  fullWidth
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  select
                  label="Género"
                  fullWidth
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
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

              <Grid item xs={12} sm={6} md={4}>

                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={es}
                >

                  <DatePicker
                    label="Fecha de nacimiento"
                    value={form.fecha_nacimiento}
                    format="dd/MM/yyyy"
                    onChange={(newValue) =>
                      setForm({
                        ...form,
                        fecha_nacimiento: newValue,
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

          </Seccion>

          {/* =========================
              CONTACTO
          ========================= */}

          <Seccion
            titulo="Información de contacto"
            descripcion="Datos utilizados para comunicarse con el paciente."
          >

            <Grid container spacing={2.5}>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Teléfono"
                  fullWidth
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <TextField
                  label="Dirección"
                  fullWidth
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                />
              </Grid>

            </Grid>

          </Seccion>

          {/* =========================
              OBRA SOCIAL
          ========================= */}

          <Seccion
            titulo="Obra social"
            descripcion="Información de cobertura médica y afiliación."
          >

            <Grid container spacing={2.5}>

              <Grid item xs={12} md={5}>
                <TextField
                  label="Obra social"
                  fullWidth
                  name="obra_social"
                  value={form.obra_social}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Número de afiliado"
                  fullWidth
                  name="numero_afiliado"
                  value={form.numero_afiliado}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={3}>

                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={es}
                >

                  <DatePicker
                    label="Fecha de ingreso"
                    value={form.fecha_ingreso}
                    format="dd/MM/yyyy"
                    onChange={(newValue) =>
                      setForm({
                        ...form,
                        fecha_ingreso: newValue,
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

          </Seccion>

          {/* =========================
              ANTECEDENTES
          ========================= */}

          <Seccion
            titulo="Antecedentes personales"
            descripcion="Información relevante sobre antecedentes y condiciones del paciente."
          >

            <Grid container spacing={2.5}>

              {/* FILA 1 */}

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

              {/* FILA 2 */}

              <Grid item xs={12} md={6}>

                <TextField
                  label="Tratamientos quirúrgicos"
                  fullWidth
                  multiline
                  rows={3}
                  name="tratamientos_quirurgicos"
                  value={form.tratamientos_quirurgicos}
                  onChange={handleChange}
                />

              </Grid>

              <Grid item xs={12} md={6}>

                <TextField
                  label="Medicación actual"
                  fullWidth
                  multiline
                  rows={3}
                  name="medicacion_actual"
                  value={form.medicacion_actual}
                  onChange={handleChange}
                />

              </Grid>

              {/* FILA 3 */}

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

              {/* FILA 4 */}

              <Grid item xs={12} md={6}>

                <TextField
                  label="Problemas de coagulación"
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
                    Sí
                  </MenuItem>

                  <MenuItem value="NO">
                    No
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
                    Sí
                  </MenuItem>

                  <MenuItem value="NO">
                    No
                  </MenuItem>

                </TextField>

              </Grid>

              {/* FILA 5 */}

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

              {/* FILA 6 */}

              <Grid item xs={12}>

                <TextField
                  label="Enfermedades sistémicas"
                  fullWidth
                  multiline
                  rows={3}
                  name="enfermedades_sistemicas"
                  value={form.enfermedades_sistemicas}
                  onChange={handleChange}
                />

              </Grid>

              {/* FILA 7 */}

              <Grid item xs={12} md={8}>

                <TextField
                  label="Enfermedades de transmisión sexual"
                  fullWidth
                  multiline
                  rows={3}
                  name="enfermedades_transmision_sexual"
                  value={form.enfermedades_transmision_sexual}
                  onChange={handleChange}
                />

              </Grid>

              <Grid item xs={12} md={4}>

                <TextField
                  label="HIV"
                  fullWidth
                  name="hiv"
                  value={form.hiv}
                  onChange={handleChange}
                />

              </Grid>

            </Grid>

          </Seccion>

        </DialogContent>

        {/* =========================
            BOTONES
        ========================= */}

        <DialogActions
          sx={{
            px: 4,
            py: 2,
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
            justifyContent: "flex-end",
            gap: 1.5,
          }}
        >

          <Button
            variant="outlined"
            color="error"
            onClick={() => setOpen(false)}
            sx={{
              textTransform: "none",
              minWidth: 110,
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleGuardar}
            sx={{
              textTransform: "none",
              minWidth: 160,
            }}
          >
            Guardar cambios
          </Button>

        </DialogActions>

      </Dialog>
    </>
  );
}

