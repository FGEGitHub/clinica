import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Box,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import servicioPacientes from "../../../services/pacientes";

const sectionStyle = {
  border: "1px solid #c62828",
  borderRadius: 1,
  mb: 3,
};

const sectionHeader = {
  backgroundColor: "#f8d7da",
  px: 2,
  py: 0.5,
  fontWeight: "bold",
  fontSize: 14,
  color: "#7f0000",
};

const sectionBody = {
  p: 2,
};

const PacienteNuevo = () => {
  const navigate = useNavigate();

const [paciente, setPaciente] = useState({
  nombre: "",
  apellido: "",
  dni: "",
  genero: "",
  fecha_nacimiento: "",
  fecha_ingreso: "",   // ✅ AGREGAR
  telefono: "",
  direccion: "",
  obra_social: "",
  numero_afiliado: "",
  email: "",
  observaciones: ""
});
const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    setPaciente({
      ...paciente,
      [e.target.name]: e.target.value
    });
  };
const camposRequeridos = [
  "apellido",
  "nombre",
  "dni",
  "genero",
  "fecha_nacimiento",
    "fecha_ingreso",   
    "direccion",
    "telefono",
    "email",
    "obra_social",
];
const handleGuardar = async () => {
  const esValido = validarCampos();

  if (!esValido) {
    const confirmar = window.confirm(
      "Faltan completar algunos datos importantes.\n\n¿Seguro que desea guardar la ficha sin completar todo?"
    );

    if (!confirmar) return;
  }

  try {
    await servicioPacientes.agregarPersona(paciente);
    navigate(-1);
  } catch (error) {
    console.error(error);
    alert("Error al guardar paciente");
  }
};
const validarCampos = () => {
  const nuevosErrores = {};

  camposRequeridos.forEach((campo) => {
    if (!paciente[campo] || paciente[campo].trim() === "") {
      nuevosErrores[campo] = true;
    }
  });

  setErrores(nuevosErrores);

  return Object.keys(nuevosErrores).length === 0;
};
  return (
    <Card sx={{ maxWidth: 1000, margin: "auto", mt: 4 }}>
      <CardContent>

        {/* TÍTULO */}
        <Typography
          variant="h6"
          align="center"
          sx={{ fontWeight: "bold", mb: 2 }}
          
        >
          HISTORIA CLÍNICA – DATOS DEL PACIENTE
        </Typography>

        {/* DATOS PERSONALES */}
        <Box sx={sectionStyle}>
          <Box sx={sectionHeader}>DATOS PERSONALES</Box>
          <Box sx={sectionBody}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Apellido" name="apellido" fullWidth size="small" error={!!errores.apellido}
                  value={paciente.apellido} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Nombre" name="nombre" fullWidth size="small" error={!!errores.nombre}
                  value={paciente.nombre} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField label="DNI" name="dni" fullWidth size="small" error={!!errores.dni}
                  value={paciente.dni} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField select label="Género" name="genero" fullWidth size="small" error={!!errores.genero}
                  value={paciente.genero} onChange={handleChange}>
                  <MenuItem value="F">Femenino</MenuItem>
                  <MenuItem value="M">Masculino</MenuItem>
                  <MenuItem value="X">Otro</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  type="date"
                  label="Fecha de nacimiento"
                  name="fecha_nacimiento"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  size="small"
                  value={paciente.fecha_nacimiento}
                  onChange={handleChange}
                  error={!!errores.fecha_nacimiento}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
  <TextField
    type="date"
    label="Fecha de ingreso"
    name="fecha_ingreso"
    InputLabelProps={{ shrink: true }}
    fullWidth
    size="small"
    value={paciente.fecha_ingreso}
    onChange={handleChange}
     error={!!errores.fecha_ingreso}
  />
</Grid>
            </Grid>
          </Box>
        </Box>

        {/* DOMICILIO Y CONTACTO */}
        <Box sx={sectionStyle}>
          <Box sx={sectionHeader}>DOMICILIO Y CONTACTO</Box>
          <Box sx={sectionBody}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Dirección" name="direccion" fullWidth size="small" error={!!errores.direccion}
                  value={paciente.direccion} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Teléfono" name="telefono" fullWidth size="small" error={!!errores.telefono}
                  value={paciente.telefono} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Email" name="email" fullWidth size="small" error={!!errores.email}
                  value={paciente.email} onChange={handleChange} />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* OBRA SOCIAL */}
        <Box sx={sectionStyle}>
          <Box sx={sectionHeader}>COBERTURA MÉDICA</Box>
          <Box sx={sectionBody}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Obra Social" name="obra_social" fullWidth size="small" error={!!errores.obra_social}
                  value={paciente.obra_social} onChange={handleChange} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="N° Afiliado" name="numero_afiliado" fullWidth size="small" error={!!errores.numero_afiliado}
                  value={paciente.numero_afiliado} onChange={handleChange} />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* OBSERVACIONES */}
        <Box sx={sectionStyle}>
          <Box sx={sectionHeader}>OBSERVACIONES CLÍNICAS</Box>
          <Box sx={sectionBody}>
            <TextField
              name="observaciones"
              multiline
              rows={4}
              fullWidth
              size="small"
              value={paciente.observaciones}
              onChange={handleChange}
              error={!!errores.observaciones}
            />
          </Box>
        </Box>
{Object.keys(errores).length > 0 && (
  <Typography color="error" sx={{ mb: 2 }}>
    Hay campos importantes sin completar
  </Typography>
)}
        {/* BOTONES */}
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button variant="outlined" sx={{ color: "black", borderColor: "black", fontSize: "0.70rem", backgroundColor: "#f8d7da" }} onClick={handleGuardar}>
            Guardar ficha
          </Button>
          <Button variant="outlined"  sx={{ color: "black", borderColor: "black", fontSize: "0.70rem", backgroundColor: "#f8d7da" }} onClick={() => navigate(-1)}>
            Cancelar
          </Button>
        </Box>

      </CardContent>
    </Card>
  );
};

export default PacienteNuevo;
