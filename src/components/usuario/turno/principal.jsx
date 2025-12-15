import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import servicioDtc from "../../../services/pacientes";

const TurnoDetalle = () => {
  const { id } = useParams(); // idTurno
  const [loading, setLoading] = useState(true);

  const [turno, setTurno] = useState(null);
  const [paciente, setPaciente] = useState(null);
  const [consulta, setConsulta] = useState({
    motivo: "",
    evolucion: "",
    examen_fisico: "",
  });

  useEffect(() => {
    traerTurno();
  }, []);

  const traerTurno = async () => {
    try {
      const res = await servicioDtc.traerTurnoDetalle(id);

      /**
       * Backend recomendado:
       * res = {
       *   turno: {...},
       *   paciente: {...},
       *   consulta: {...} | null
       * }
       */

      setTurno(res.turno);
      setPaciente(res.paciente);

      if (res.consulta) {
        setConsulta(res.consulta);
      }

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const guardarConsulta = async () => {
    try {
      await servicioDtc.guardarConsulta({
        id_turno: turno.id,
        ...consulta,
      });

      alert("Consulta guardada");
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    }
  };

  if (loading) return <>Cargando consulta...</>;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      {/* =================== DATOS DEL TURNO =================== */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Atención del Turno
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Fecha"
                fullWidth
                value={turno.fecha}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Hora"
                fullWidth
                value={turno.hora}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Motivo del turno"
                fullWidth
                value={turno.motivo || ""}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Nombre"
                fullWidth
                value={paciente.nombre}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Apellido"
                fullWidth
                value={paciente.apellido}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* =================== CONSULTA =================== */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
            Consulta
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <TextField
            label="Motivo de consulta"
            fullWidth
            multiline
            rows={2}
            sx={{ mb: 2 }}
            value={consulta.motivo}
            onChange={(e) =>
              setConsulta({ ...consulta, motivo: e.target.value })
            }
          />

          <TextField
            label="Evolución"
            fullWidth
            multiline
            rows={4}
            sx={{ mb: 2 }}
            value={consulta.evolucion}
            onChange={(e) =>
              setConsulta({ ...consulta, evolucion: e.target.value })
            }
          />

          <TextField
            label="Examen físico"
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 3 }}
            value={consulta.examen_fisico}
            onChange={(e) =>
              setConsulta({ ...consulta, examen_fisico: e.target.value })
            }
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={guardarConsulta}>
              Guardar consulta
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TurnoDetalle;
