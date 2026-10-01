
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  MenuItem,
  Button,
  Popover,
  Typography,
} from "@mui/material";

import servicioPacientes from "../../../services/pacientes";

const AgendarTurno = ({ idTurno, onAgendar }) => {
  const [pacientes, setPacientes] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [pacienteSel, setPacienteSel] = useState(null);
  const [especialidad, setEspecialidad] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  // Traer pacientes y especialidades
  useEffect(() => {
    const traerDatos = async () => {
      try {
        const usuario = JSON.parse(
          window.localStorage.getItem("loggedNoteAppUser")
        );

        // Traer pacientes
        const pacientesData =
          await servicioPacientes.traerpacientes(usuario.id);

        setPacientes(pacientesData);

        // Traer especialidades
        const especialidadesData =
          await servicioPacientes.traerespecialidades(usuario.id);

        setEspecialidades(especialidadesData);

      } catch (error) {
        console.error("Error cargando pacientes/especialidades", error);
      }
    };

    traerDatos();
  }, []);

  // Popover control
  const abrir = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const cerrar = () => {
    setAnchorEl(null);
  };

  // Confirmar agenda
  const handleAgendar = () => {
    if (!pacienteSel || !especialidad) {
      alert("Seleccione paciente y especialidad");
      return;
    }

    onAgendar({
      id_turno: idTurno,
      id_paciente: pacienteSel.id,
      especialidad: especialidad,
    });

    // Limpiar
    setPacienteSel(null);
    setEspecialidad("");

    cerrar();
  };

  return (
    <>
      {/* Botón visible en la tabla */}
      <Button
        variant="contained"
        size="small"
        onClick={abrir}
      >
        Agendar
      </Button>

      {/* Popover */}
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
          <Typography
            variant="subtitle1"
            fontWeight="bold"
          >
            Asignar paciente
          </Typography>

          {/* PACIENTE */}
          <Autocomplete
            options={pacientes}
            getOptionLabel={(p) =>
              `${p.apellido} ${p.nombre}`
            }
            value={pacienteSel}
            onChange={(e, newValue) =>
              setPacienteSel(newValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Paciente"
                size="small"
              />
            )}
          />

          {/* ESPECIALIDAD */}
          <TextField
            select
            label="Especialidad"
            size="small"
            value={especialidad}
            onChange={(e) =>
              setEspecialidad(e.target.value)
            }
          >
            <MenuItem value="">
              Seleccionar especialidad
            </MenuItem>

            {especialidades.map((esp) => (
              <MenuItem
                key={esp.id}
                value={esp.nombre}
              >
                {esp.nombre}
              </MenuItem>
            ))}
          </TextField>

          {/* CONFIRMAR */}
          <Button
            variant="contained"
            onClick={handleAgendar}
          >
            Confirmar
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default AgendarTurno;
