import React, { useEffect, useState, Fragment } from "react";
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
import { useParams } from "react-router-dom";

import servicioDtc from "../../../services/pacientes";
import Modificar from "./modificar"
import Borrarusuaio from "./modalborrar";
import NuevoTurno from "./nuevoturno";

const FichaPersona = (props) => {
  let params = useParams();
  let id = params.id;

  const [chico, setchico] = useState();
  const [turnos, setTurnos] = useState([]);
  const [usuario, setUsuario] = useState();

  useEffect(() => {
    traer();
  }, []);

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
      <Card variant="outlined" sx={{ p: 2, mt: 2 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
            Información del paciente
          </Typography>

          <Grid container spacing={2}>
            {/* Nombre */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre"
                fullWidth
                value={chico.nombre || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Apellido */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Apellido"
                fullWidth
                value={chico.apellido || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* DNI */}
            <Grid item xs={12} md={6}>
              <TextField
                label="DNI"
                fullWidth
                value={chico.dni || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Teléfono */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Teléfono"
                fullWidth
                value={chico.telefono || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Dirección */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Dirección"
                fullWidth
                value={chico.domicilio || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Fecha nacimiento */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Fecha de nacimiento"
                fullWidth
                value={chico.fecha_nacimiento || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Fecha ingreso */}
            <Grid item xs={12} md={6}>
              <TextField
                label="Fecha de ingreso"
                fullWidth
                value={chico.primer_ingreso || chico.fecha_ingreso || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Observaciones */}
            <Grid item xs={12}>
              <TextField
                label="Observaciones"
                fullWidth
                multiline
                rows={2}
                value={chico.observaciones || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>

          {/* BOTONES */}
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Modificar
              {...chico}
              traer={async () => {
                const loggedUserJSON =
                  window.localStorage.getItem("loggedNoteAppUser");
                if (loggedUserJSON) {
                  const usuario = JSON.parse(loggedUserJSON);
                  const novedades_aux = await servicioDtc.datospaciente(
                    id === undefined ? props.id : id
                  );
                  setchico(novedades_aux[0][0]);
                }
              }}
            />

           <Borrarusuaio id={chico.id} />
          </Box>
        </CardContent>
      </Card>

      {/* -------------------------------- TABLA DE TURNOS -------------------------------- */}
    <Box 
  sx={{ 
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>
    </>
  );
};

export default FichaPersona;
