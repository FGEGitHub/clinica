import { useState } from "react";
import {
  Card, CardContent, Typography, Divider,
  TextField, Button, Box
} from "@mui/material";
import servicioDtc from "../../../services/pacientes";

export default function FormularioConsulta({ turnoSeleccionado, traer, cerrar,  id_paciente,    }) {

  const [consulta, setConsulta] = useState({
    fecha: "",
    motivo: "",
    evolucion: "",
    tratamiento: ""
  });

  const guardarConsulta = async () => {
    try {
      await servicioDtc.guardarConsulta({
        id_paciente: id_paciente,   
        id_turno: turnoSeleccionado?.id || "sin_turno",
        motivo: consulta.motivo,
        evolucion: consulta.evolucion,
        tratamiento: consulta.tratamiento,
        fecha: consulta.fecha,
      });

      alert("Consulta guardada");
      traer();
      cerrar();
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    }
  };

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Nueva Consulta
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <TextField
          label="Fecha de la consulta"
          type="datetime-local"
          fullWidth
          sx={{ mb: 2 }}
          value={consulta.fecha}
          onChange={(e) =>
            setConsulta({ ...consulta, fecha: e.target.value })
          }
          InputLabelProps={{ shrink: true }}
        />

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
          label="Tratamiento"
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 3 }}
          value={consulta.tratamiento}
          onChange={(e) =>
            setConsulta({ ...consulta, tratamiento: e.target.value })
          }
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={cerrar}>Cancelar</Button>
          <Button variant="contained" onClick={guardarConsulta}>
            Guardar consulta
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
