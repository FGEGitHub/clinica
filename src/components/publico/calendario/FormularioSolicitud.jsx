import React, { useState } from "react";
import { Box, TextField, Button, MenuItem } from "@mui/material";
import servicioDtc from "../../../services/pacientes";

const categorias = [
  { value: "consulta", label: "Consulta" },
  { value: "control", label: "Control" },
  { value: "urgencia", label: "Urgencia" },
];

const FormularioSolicitud = ({ turno, onSuccess }) => {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(false);

 const enviarSolicitud = async () => {
  if (!nombre || !dni || !telefono || !categoria) {
    alert("Complete todos los campos");
    return;
  }

  try {
    setLoading(true);

    const resp = await servicioDtc.solicitarturno({
      id_turno: turno.id,
      nombre,
      dni,
      telefono,
      categoria
    });
console.log("Respuesta de la solicitud:", resp);
    // 🔥 REDIRECCIÓN A MERCADO PAGO
    if (resp.pago_url) {
      window.location.href = resp.pago_url;
      return;
    }

    // fallback por si no hay pago
    onSuccess();

  } catch (error) {
    console.error(error);
    alert("Error al solicitar el turno");
  } finally {
    setLoading(false);
    setNombre("");
    setDni("");
    setTelefono("");
    setCategoria("");
  }
};


  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 420 }}>
      
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

      <Button variant="contained" onClick={enviarSolicitud} disabled={loading}>
        {loading ? "Enviando..." : "Confirmar solicitud"}
      </Button>
    </Box>
  );
};

export default FormularioSolicitud;
