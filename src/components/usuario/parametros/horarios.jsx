import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Divider,
  Chip,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const dias = [
  { id: 1, nombre: "Lunes", corto: "Lun" },
  { id: 2, nombre: "Martes", corto: "Mar" },
  { id: 3, nombre: "Miércoles", corto: "Mié" },
  { id: 4, nombre: "Jueves", corto: "Jue" },
  { id: 5, nombre: "Viernes", corto: "Vie" },
  { id: 6, nombre: "Sábado", corto: "Sáb" },
  { id: 7, nombre: "Domingo", corto: "Dom" },
];

const horas = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

const HorariosClinica = () => {

  const [horarios, setHorarios] = useState([]);

  // Agregar un horario
  const agregarHorario = (dia, hora) => {

    const existe = horarios.some(
      (h) =>
        h.dia === dia &&
        h.hora_inicio === hora
    );

    if (existe) {
      return;
    }

    const nuevoHorario = {
      id: Date.now(),
      dia,
      hora_inicio: hora,
      hora_fin: calcularHoraFin(hora),
      duracion: 30,
    };

    setHorarios((prev) => [
      ...prev,
      nuevoHorario,
    ]);
  };

  // Eliminar horario
  const eliminarHorario = (id) => {

    setHorarios((prev) =>
      prev.filter((h) => h.id !== id)
    );
  };

  // Por ahora sumamos 30 minutos
  const calcularHoraFin = (hora) => {

    const [h, m] = hora.split(":").map(Number);

    let minutos = h * 60 + m + 30;

    const nuevaHora = Math.floor(minutos / 60);
    const nuevosMinutos = minutos % 60;

    return `${String(nuevaHora).padStart(2, "0")}:${String(
      nuevosMinutos
    ).padStart(2, "0")}`;
  };

  const horariosDelDia = (dia) => {
    return horarios.filter(
      (h) => h.dia === dia
    );
  };

  return (

    <Box
      sx={{
        width: "100%",
        p: { xs: 1, md: 3 },
        background: "#f5f7fa",
        minHeight: "100vh",
      }}
    >

      {/* ENCABEZADO */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >

        <Box>

          <Typography
            variant="h5"
            fontWeight={700}
          >
            Horarios de atención
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Seleccioná los días y horarios disponibles
            para la clínica.
          </Typography>

        </Box>

        <Chip
          icon={<AccessTimeIcon />}
          label={`${horarios.length} horarios configurados`}
          color="primary"
          variant="outlined"
        />

      </Box>


      {/* CALENDARIO */}

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >

        {/* CABECERA DIAS */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "70px repeat(7, 1fr)",
            borderBottom: "1px solid #e5e7eb",
            position: "sticky",
            top: 0,
            background: "#fff",
            zIndex: 5,
          }}
        >

          <Box />

          {dias.map((dia) => (

            <Box
              key={dia.id}
              sx={{
                textAlign: "center",
                py: 2,
                borderLeft: "1px solid #e5e7eb",
              }}
            >

              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: 11, md: 14 },
                }}
              >
                {dia.nombre}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {horariosDelDia(dia.id).length} horarios
              </Typography>

            </Box>

          ))}

        </Box>


        {/* HORARIOS */}

        <Box
          sx={{
            maxHeight: "650px",
            overflowY: "auto",
          }}
        >

          {horas.map((hora) => (

            <Box
              key={hora}
              sx={{
                display: "grid",
                gridTemplateColumns: "70px repeat(7, 1fr)",
                minHeight: 55,
                borderBottom: "1px solid #f0f0f0",
              }}
            >

              {/* HORA */}

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "text.secondary",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {hora}
              </Box>


              {/* DIAS */}

              {dias.map((dia) => {

                const horario = horarios.find(
                  (h) =>
                    h.dia === dia.id &&
                    h.hora_inicio === hora
                );

                return (

                  <Box
                    key={dia.id}
                    sx={{
                      borderLeft:
                        "1px solid #f0f0f0",
                      p: 0.5,
                    }}
                  >

                    {!horario ? (

                      <Button
                        fullWidth
                        onClick={() =>
                          agregarHorario(
                            dia.id,
                            hora
                          )
                        }
                        sx={{
                          height: "100%",
                          minHeight: 45,
                          color: "#b0b7c3",
                          opacity: 0,
                          "&:hover": {
                            opacity: 1,
                            background:
                              "#f0f7ff",
                            color: "primary.main",
                          },
                        }}
                      >

                        <AddIcon fontSize="small" />

                      </Button>

                    ) : (

                      <Box
                        sx={{
                          height: "100%",
                          minHeight: 45,
                          borderRadius: 1.5,
                          background:
                            "linear-gradient(135deg, #1976d2, #42a5f5)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "space-between",
                          px: 1,
                          boxShadow:
                            "0 2px 6px rgba(25,118,210,.25)",
                        }}
                      >

                        <Box>

                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {horario.hora_inicio}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 10,
                              opacity: 0.85,
                            }}
                          >
                            {horario.hora_fin}
                          </Typography>

                        </Box>

                        <IconButton
                          size="small"
                          onClick={() =>
                            eliminarHorario(
                              horario.id
                            )
                          }
                          sx={{
                            color: "#fff",
                            "&:hover": {
                              background:
                                "rgba(255,255,255,.2)",
                            },
                          }}
                        >

                          <DeleteOutlineIcon
                            fontSize="small"
                          />

                        </IconButton>

                      </Box>

                    )}

                  </Box>

                );

              })}

            </Box>

          ))}

        </Box>

      </Paper>


      {/* RESUMEN */}

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Hacé click en un espacio libre para agregar
          un horario.
        </Typography>

        <Button
          variant="contained"
          disabled={horarios.length === 0}
          sx={{
            borderRadius: 2,
            px: 4,
          }}
        >
          Guardar horarios
        </Button>

      </Box>

    </Box>

  );
};

export default HorariosClinica;