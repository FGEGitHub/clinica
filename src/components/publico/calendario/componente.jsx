import React, { useEffect, useState } from "react";
import { es } from "date-fns/locale";
import { startOfDay, parseISO, format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  MenuItem
} from "@mui/material";
import { useRef } from "react";
import servicioDtc from "../../../services/pacientes";
const categorias = [
  { value: "consulta", label: "Consulta" },
  { value: "control", label: "Control" },
  { value: "urgencia", label: "Urgencia" },
];
const PaginaTurnosPublica = () => {
  const [turnos, setTurnos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnosDelDia, setTurnosDelDia] = useState([]);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
  const [categoria, setCategoria] = useState("");
  const formularioRef = useRef(null);
  // formulario
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);
const [openExito, setOpenExito] = useState(false);
  // --- TRAER TURNOS DISPONIBLES ---
  const traerTurnos = async () => {
    const data = await servicioDtc.traerTurnosDisponibles();
    setTurnos(
      data.map((t) => ({
        ...t,
        fechaObj: startOfDay(parseISO(t.fecha)),
      }))
    );
  };

const scrollToFormulario = () => {
  setTimeout(() => {
    formularioRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 200);
};
  useEffect(() => {
    traerTurnos();
  }, []);

  // --- días marcados ---
  const diasConTurnos = turnos.map((t) => t.fechaObj);

  // --- al seleccionar día ---
  const cargarTurnosDelDia = (date) => {
    if (!date) return;
    setSelectedDate(date);
  };

  useEffect(() => {
    const lista = turnos.filter(
      (t) =>
        startOfDay(parseISO(t.fecha)).getTime() ===
        startOfDay(selectedDate).getTime()
    );
    setTurnosDelDia(lista);
  }, [turnos, selectedDate]);

  // --- enviar solicitud ---
  const solicitarTurno = async () => {
    if (!nombre || !dni || !telefono) {
      alert("Completá todos los datos 🙂");
      return;
    }

    const data = {
      id_turno: turnoSeleccionado.id,
      nombre,
      dni,
      telefono,
      categoria
    };

    try {
      setLoading(true);
      await servicioDtc.solicitarturno(data);

     setOpenExito(true);

      // limpiar
      setTurnoSeleccionado(null);
      setNombre("");
      setDni("");
      setTelefono("");

      traerTurnos();
    } catch (error) {
      alert("Error al enviar solicitud");
    } finally {
      setLoading(false);
    }
  };
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
  return (<>
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth:  "100%" , margin: "auto" }}>

      {/* ENCABEZADO */}
      <Typography
        variant="h3"
        align="center"
        fontWeight="bold"
        sx={{ color: "#1976d2" }}
      >
        Reservá tu turno online
      </Typography>

      <Typography align="center" sx={{ mb: 4, fontSize: "1.2rem" }}>
        Elegí un día, seleccioná tu horario y dejanos tus datos.  
        ¡Es rápido y sencillo!
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* CALENDARIO GRANDE */}
        <Paper sx={{ flex: 1.3, p: 2 }}>
          <DayPicker
            locale={es}
            mode="single"
            selected={selectedDate}
            onSelect={cargarTurnosDelDia}
            modifiers={{ tieneTurnos: diasConTurnos }}
            modifiersStyles={{
              tieneTurnos: {
                backgroundColor: "#81c784",
                color: "white",
                borderRadius: "50%",
              },
            }}
            styles={{
              caption: { fontSize: "1.8rem", fontWeight: "bold" },
              day: { fontSize: "1.2rem" },
            }}
          />
        </Paper>

        {/* TABLA DE HORARIOS */}
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Horarios disponibles para{" "}
            <strong>{format(selectedDate, "dd/MM/yyyy")}</strong>
          </Typography>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#e3f2fd" }}>
                  <TableCell><strong>Horario</strong></TableCell>
                  <TableCell><strong>Acción</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {turnosDelDia.length > 0 ? (
                  turnosDelDia.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.hora}</TableCell>
                      <TableCell>
                       <Button
  variant="contained"
  disabled={t.id_pacientee}
  sx={{
    backgroundColor: t.id_pacientee ? "#bdbdbd" : "#1976d2",
    "&:hover": {
      backgroundColor: t.id_pacientee ? "#bdbdbd" : "#115293"
    }
  }}
  onClick={() => {
    if (t.id_pacientee) return;
    setTurnoSeleccionado(t);
    scrollToFormulario();
  }}
>
  {t.id_pacientee  ? "Ocupado" : "Solicitar"}
</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No hay horarios disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* FORMULARIO */}
      {turnoSeleccionado && (
        <Paper sx={{ p: 3, mt: 4 }}  ref={formularioRef} >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Completá tus datos para confirmar el turno de las{" "}
            <strong>{turnoSeleccionado.hora}</strong>
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}>
            <TextField
              label="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <TextField
              label="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
            <TextField
              label="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
 <TextField
        select
        label="Motivo de consulta"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
      >
        {categorias.map((c) => (
          <MenuItem key={c.value} value={c.value}>
            {c.label}
          </MenuItem>
        ))}
      </TextField>
           <Button
              variant="contained"
              size="large"
              onClick={solicitarTurno}
              disabled={loading}
            >
              {loading ? "Enviando..." : "Confirmar solicitud"}
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
    <Dialog open={openExito} onClose={() => setOpenExito(false)}>
  <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
    🎉 ¡Solicitud enviada!
  </DialogTitle>

  <DialogContent sx={{ textAlign: "center", mt: 1 }}>
    <Typography sx={{ fontSize: "1.1rem" }}>
      Tu pedido de turno fue recibido correctamente.
    </Typography>

    <Typography sx={{ mt: 2 }}>
      📞 Nos comunicaremos contigo pronto para confirmar el horario.
    </Typography>

    <Typography sx={{ mt: 2, color: "#1976d2", fontWeight: "bold" }}>
      ¡Gracias por confiar en nosotros!
    </Typography>
  </DialogContent>

  <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
    <Button
      variant="contained"
     onClick={() => {
  setOpenExito(false);
  scrollToTop();
}}
    >
      Entendido
    </Button>
  </DialogActions>
</Dialog>
</>
  );
};

export default PaginaTurnosPublica;
