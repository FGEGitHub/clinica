import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  MenuItem,
  Button,
  Popover,
  Typography
} from "@mui/material";

import servicioPacientes from "../../../services/pacientes";

const categorias = [
  { value: "consulta", label: "Consulta" },
  { value: "control", label: "Control" },
  { value: "urgencia", label: "Urgencia" },
];

const AgendarTurno = ({ idTurno, onAgendar }) => {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSel, setPacienteSel] = useState(null);
  const [categoria, setCategoria] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // Traer pacientes
  useEffect(() => {
    const traer = async () => {
      try {
        const data = await servicioPacientes.traerpacientes();
        setPacientes(data);
      } catch (error) {
        console.error("Error cargando pacientes", error);
      }
    };
    traer();
  }, []);

  // Popover control
  const abrir = (event) => setAnchorEl(event.currentTarget);
  const cerrar = () => setAnchorEl(null);

  // Confirmar agenda
  const handleAgendar = () => {
    if (!pacienteSel || !categoria) {
      alert("Seleccione paciente y categoría");
      return;
    }

    onAgendar({
      id_turno: idTurno,
      id_paciente: pacienteSel.id,
      categoria: categoria
    });

    // limpiar y cerrar
    setPacienteSel(null);
    setCategoria("");
    cerrar();
  };

  return (
    <>
      {/* Botón visible en la tabla */}
      <Button variant="contained" size="small" onClick={abrir}>
        Agendar
      </Button>

      {/* Popover desplegable */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={cerrar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minWidth: 260,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Asignar paciente
          </Typography>

          <Autocomplete
            options={pacientes}
            getOptionLabel={(p) => `${p.apellido} ${p.nombre}`}
            value={pacienteSel}
            onChange={(e, newValue) => setPacienteSel(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Paciente" size="small" />
            )}
          />

          <TextField
            select
            label="Categoría"
            size="small"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            {categorias.map((c) => (
              <MenuItem key={c.value} value={c.value}>
                {c.label}
              </MenuItem>
            ))}
          </TextField>

          <Button variant="contained" onClick={handleAgendar}>
            Confirmar
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default AgendarTurno;
