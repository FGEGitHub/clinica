import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import { useParams , useNavigate } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";

import servicioDtc from "../../../services/pacientes";
import Modificar from "./modificar"
import Borrarusuaio from "./modalborrar";
import NuevoTurno from "./nuevoturno";
import BorrarTurno from "./modalborrarturno";

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
const FichaPersona = (props) => {
    const navigate = useNavigate();
  let params = useParams();
  let id = params.id;

  const [chico, setchico] = useState();
  const [turnos, setTurnos] = useState([]);
  const [usuario, setUsuario] = useState();
const [tab, setTab] = useState(0);
  useEffect(() => {
    traer();
  }, []);

  const calcularEdad = (fecha) => {
  if (!fecha) return "";
  const nacimiento = new Date(fecha);
  const hoy = new Date();

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
};


const handleTabChange = (event, newValue) => {
  setTab(newValue);
};

const formatFecha = (fecha) => {
  if (!fecha) return "";
  const [year, month, day] = fecha.split("-");
  return `${day}/${month}/${year}`;
}; 

  const traer = async () => {
    try {
      const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");
      if (loggedUserJSON) {
        const usuario = JSON.parse(loggedUserJSON);
        setUsuario(usuario);

        const novedades = await servicioDtc.datospaciente(
          id === undefined ? props.id : id
        );

        setchico(novedades[0][0]);
        setTurnos(novedades[2]);
      }
    } catch (error) {
      console.log(error);
    }
  };  

  if (!chico) return <>Cargando...</>;

  return (
    <>
      {/* -------------------------------- FICHA PRINCIPAL -------------------------------- */}
   {/* -------------------------------- FICHA PRINCIPAL -------------------------------- */}
<Box
  sx={{
    width: "100vw",
    height: "100vh",
    maxWidth: 1200,   // 👈 ancho fijo para TODAS las pestañas
    margin: "auto",
    mt: 4,
  }}
>
  <Paper elevation={3} sx={{ borderRadius: 2 }}>
   
  <CardContent>

    <Typography
      variant="h6"
      align="center"
      sx={{ fontWeight: "bold", mb: 2 }}
    >
      HISTORIA CLÍNICA – FICHA DEL PACIENTE
    </Typography>

    {/* ================= PESTAÑAS ================= */}
    <Tabs
      value={tab}
      onChange={handleTabChange}
      variant="fullWidth"
      sx={{
        mb: 3,
        "& .MuiTab-root": {
          fontWeight: "bold",
          border: "1px solid #c62828",
          borderBottom: "none",
          borderRadius: "6px 6px 0 0",
          backgroundColor: "#f8d7da",
        },
        "& .Mui-selected": {
          backgroundColor: "#ffffff",
        },
      }}
    >
      <Tab label="Datos del paciente" />
      <Tab label="Turnos" />
      <Tab label="Otros" />
    </Tabs>

    {/* ================= TAB DATOS ================= */}
    {tab === 0 && (
      <>
        {/* ===== DATOS PERSONALES ===== */}
        <Box sx={sectionStyle}>
          <Box sx={sectionHeader}>DATOS PERSONALES</Box>
          <Box sx={sectionBody}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Apellido" fullWidth size="small"
                  value={chico.apellido || ""} InputProps={{ readOnly: true }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Nombre" fullWidth size="small"
                  value={chico.nombre || ""} InputProps={{ readOnly: true }} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField label="DNI" fullWidth size="small"
                  value={chico.dni || ""} InputProps={{ readOnly: true }} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField label="Género" fullWidth size="small"
                  value={chico.genero || ""} InputProps={{ readOnly: true }} />
              </Grid>

         <Grid item xs={12} sm={4}>
  <TextField
    label="Fecha nacimiento"
    fullWidth
    size="small"
    value={formatFecha(chico.fecha_nacimiento)}
    InputProps={{ readOnly: true }}
  />
</Grid>

<Grid item xs={12} sm={2}>
  <TextField
    label="Edad"
    fullWidth
    size="small"
    value={calcularEdad(chico.fecha_nacimiento)}
    InputProps={{ readOnly: true }}
  />
</Grid>

              <Grid item xs={12} sm={4}>
                <TextField label="Fecha ingreso" fullWidth size="small"
                  value={formatFecha(chico.ingreso) || ""} InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* ===== CONTACTO ===== */}
        <Box sx={sectionStyle}>
          <Box sx={sectionHeader}>DOMICILIO Y CONTACTO</Box>
          <Box sx={sectionBody}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Dirección" fullWidth size="small"
                  value={chico.direccion || ""} InputProps={{ readOnly: true }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Teléfono" fullWidth size="small"
                  value={chico.telefono || ""} InputProps={{ readOnly: true }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="Email" fullWidth size="small"
                  value={chico.email || ""} InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* ===== COBERTURA ===== */}
        <Box sx={sectionStyle}>
          <Box sx={sectionHeader}>COBERTURA MÉDICA</Box>
          <Box sx={sectionBody}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Obra social" fullWidth size="small"
                  value={chico.obra_social || ""} InputProps={{ readOnly: true }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField label="N° afiliado" fullWidth size="small"
                  value={chico.numero_afiliado || ""} InputProps={{ readOnly: true }} />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* ===== BOTONES ===== */}
        <Box sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Modificar {...chico} traer={traer} />
          <Borrarusuaio id={chico.id} />
        </Box>
      </>
    )}

    {/* ================= TAB TURNOS ================= */}
    {tab === 1 && (
       <Box 
  sx={{ 
       width: "100%",
    mt: 4,
    p: 2,
    borderRadius: 2,
    backgroundColor: "#f7f7f7",   // Fondo suave del bloque turnos
    border: "1px solid #e0e0e0"
  }}
>
  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
    Turnos
  </Typography>
<Box sx={{ mb: 2 }}>
  <NuevoTurno id_paciente={chico.id} traer={traer} />
</Box>
  <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
    <Table>
      <TableHead>
        <TableRow sx={{ backgroundColor: "#e8ecef" }}>
          <TableCell><strong>Fecha</strong></TableCell>
              <TableCell><strong>Hora</strong></TableCell>
                  <TableCell><strong>motivo</strong></TableCell>
          <TableCell><strong>Asistencia</strong></TableCell>
          <TableCell><strong>Observaciones</strong></TableCell>
          <TableCell><strong>Atender</strong></TableCell>
          <TableCell><strong>Borrar</strong></TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {turnos.map((ob, index) => (
          <TableRow
            key={index}
            sx={{
              backgroundColor: index % 2 === 0 ? "#ffffff" : "#f2f5f7",
              "&:hover": {
                backgroundColor: "#dfe7ee",
                transition: "0.2s",
              },
            }}
          >
            <TableCell>
              {ob.fecha} 
              
            </TableCell>
             <TableCell>{ob.hora}</TableCell>
              <TableCell>{ob.motivo}</TableCell>
            <TableCell>{ob.asistencia}</TableCell>
            <TableCell>{ob.observaciones}</TableCell>
            <TableCell>
{/*   {ob.asistencia !== "Atendido" && ( */}
    <Button
      variant="contained"
      size="small"
      onClick={() => navigate(`/usuario/turno/${ob.id}`)}
    >
      Ver Consulta
    </Button>
{/*   )} */}
</TableCell>
             <TableCell>   <BorrarTurno id_turno={ob.id} traer={traer} /></TableCell>
         
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>
    )}

    {/* ================= TAB OTROS ================= */}
    {tab === 2 && (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Próximamente: antecedentes, diagnósticos, archivos, etc.
        </Typography>
      </Box>
    )}

    </CardContent>
  </Paper>
</Box>
      {/* -------------------------------- TABLA DE TURNOS -------------------------------- */}
  
    </>
  );
};

export default FichaPersona;
