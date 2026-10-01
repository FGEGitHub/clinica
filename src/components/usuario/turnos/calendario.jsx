
import React, { useEffect, useState } from "react";
import { es } from "date-fns/locale";
import { startOfDay, format, parseISO } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import AgendarTurno from "./AgendarTurno";

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
  Slider,
} from "@mui/material";

import servicioDtc from "../../../services/pacientes";

const CalendarioTurnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [horariosEstandar, setHorariosEstandar] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [turnosDelDia, setTurnosDelDia] = useState([]);

  const [horaNueva, setHoraNueva] = useState("");
  const [obsNueva, setObsNueva] = useState("");
  const [loadingNuevo, setLoadingNuevo] = useState(false);

  const [duracionNueva, setDuracionNueva] = useState(30);

  const [especialidades, setEspecialidades] = useState([]);
  const [especialidadNueva, setEspecialidadNueva] = useState("");

  // =========================================================
  // TRAER TURNOS Y HORARIOS
  // =========================================================

  const traerTurnos = async () => {
    try {
      const usuario = JSON.parse(
        window.localStorage.getItem("loggedNoteAppUser")
      );

      const data = await servicioDtc.traerturnosusuario(usuario.id);

      console.log("RESPUESTA TURNOS:", data);

      // data[0] = horarios habituales
      // data[1] = turnos asignados/creados

      const horarios = data?.[0] || [];
      const turnosAsignados = data?.[1] || [];

      console.log("HORARIOS ESTANDAR:", horarios);
      console.log("TURNOS:", turnosAsignados);

      setHorariosEstandar(horarios);

      setTurnos(
        turnosAsignados.map((t) => ({
          ...t,
          fechaObj: t.fecha
            ? startOfDay(parseISO(t.fecha))
            : null,
        }))
      );
    } catch (error) {
      console.error("Error trayendo turnos:", error);
    }
  };

  // =========================================================
  // GUARDAR NUEVO TURNO
  // =========================================================

  const guardarNuevoTurno = async () => {
    if (!selectedDate || !horaNueva) {
      alert("Seleccioná una fecha y una hora");
      return;
    }

    const nuevoTurno = {
      fecha: format(selectedDate, "yyyy-MM-dd"),
      hora: horaNueva,
      observaciones: obsNueva || "",
      duracion: Number(duracionNueva),
      especialidad: especialidadNueva,
    };

    try {
      setLoadingNuevo(true);

      const usuario = JSON.parse(
        window.localStorage.getItem("loggedNoteAppUser")
      );

      await servicioDtc.nuevoturnodisp({
        ...nuevoTurno,
        id_usuario: usuario.id,
      });

      setHoraNueva("");
      setObsNueva("");

      await traerTurnos();
    } catch (error) {
      console.error(error);
      alert("Error al guardar turno");
    } finally {
      setLoadingNuevo(false);
    }
  };

  // =========================================================
  // CALCULAR HORA FIN
  // =========================================================

  const calcularHoraFin = (horaInicio, duracion) => {
    const [horas, minutos] = horaInicio.split(":").map(Number);

    const fechaHora = new Date();

    fechaHora.setHours(horas, minutos, 0, 0);

    fechaHora.setMinutes(
      fechaHora.getMinutes() + Number(duracion)
    );

    return format(fechaHora, "HH:mm");
  };

  // =========================================================
  // GENERAR HORARIOS DEL DÍA
  // =========================================================

  const generarHorariosDelDia = (date) => {
    if (!date) return [];

    const fechaSeleccionada = format(
      date,
      "yyyy-MM-dd"
    );

    // Lunes = 1
    // ...
    // Domingo = 7

    const diaSemana =
      date.getDay() === 0
        ? 7
        : date.getDay();

    // Horarios habituales configurados para ese día
    const horariosDelDia =
      horariosEstandar.filter(
        (h) => Number(h.dia) === diaSemana
      );

    // Turnos existentes para esa fecha
    const turnosExistentes =
      turnos.filter(
        (t) =>
          t.fecha &&
          format(
            parseISO(t.fecha),
            "yyyy-MM-dd"
          ) === fechaSeleccionada
      );

    const resultado = [];

    const horasAgregadas = new Set();

    // =====================================================
    // 1. GENERAR HORARIOS HABITUALES
    // =====================================================

    horariosDelDia.forEach((horario) => {
      let horaActual = horario.hora_inicio;

      while (horaActual < horario.hora_fin) {
        const turnoExistente =
          turnosExistentes.find(
            (t) => t.hora === horaActual
          );

        // -------------------------------------------------
        // YA EXISTE UN TURNO EN ESA HORA
        // -------------------------------------------------

        if (turnoExistente) {
          resultado.push({
            ...turnoExistente,

            id_horario_estandar:
              horario.id,

            hora_inicio:
              turnoExistente.hora_inicio ||
              horaActual,

            hora_fin:
              turnoExistente.hora_fin ||
              calcularHoraFin(
                horaActual,
                horario.duracion
              ),

            duracion:
              turnoExistente.duracion ||
              Number(horario.duracion),

            especialidad:
              turnoExistente.especialidad ||
              horario.especialidad ||
              null,

            esDisponible: false,

            esExcepcional: false,
          });

          horasAgregadas.add(
            turnoExistente.hora
          );
        }

        // -------------------------------------------------
        // HORARIO HABITUAL LIBRE
        // -------------------------------------------------

        else {
          resultado.push({
            id: `libre-${fechaSeleccionada}-${horaActual}`,

            id_horario_estandar:
              horario.id,

            fecha: fechaSeleccionada,

            hora: horaActual,

            hora_inicio: horaActual,

            hora_fin: calcularHoraFin(
              horaActual,
              horario.duracion
            ),

            duracion: Number(
              horario.duracion
            ),

            consulta_paga:
              horario.consulta_paga,

            especialidad:
              horario.especialidad ||
              null,

            esDisponible: true,

            esExcepcional: false,

            apellido: "",
            nombre: "",
          });
        }

        // Avanzar según duración
        const [horas, minutos] =
          horaActual
            .split(":")
            .map(Number);

        const fechaHora = new Date();

        fechaHora.setHours(
          horas,
          minutos,
          0,
          0
        );

        fechaHora.setMinutes(
          fechaHora.getMinutes() +
            Number(horario.duracion)
        );

        horaActual = format(
          fechaHora,
          "HH:mm"
        );
      }
    });

    // =====================================================
    // 2. AGREGAR TURNOS EXCEPCIONALES
    // =====================================================

    turnosExistentes.forEach((turno) => {
      if (horasAgregadas.has(turno.hora)) {
        return;
      }

      resultado.push({
        ...turno,

        hora_inicio:
          turno.hora_inicio ||
          turno.hora,

        hora_fin:
          turno.hora_fin ||
          calcularHoraFin(
            turno.hora,
            turno.duracion || 30
          ),

        duracion:
          Number(turno.duracion) || 30,

        esDisponible: false,

        esExcepcional: true,
      });
    });

    // =====================================================
    // 3. ORDENAR
    // =====================================================

    resultado.sort((a, b) =>
      a.hora.localeCompare(b.hora)
    );

    return resultado;
  };
// 🔵 MARCAR DÍAS QUE TIENEN TURNOS EXISTENTES
const tieneTurnosExistentes = (date) => {
  if (!date) return false;

  const fecha = format(date, "yyyy-MM-dd");

  return turnos.some(
    (turno) =>
      turno.fecha &&
      format(
        parseISO(turno.fecha),
        "yyyy-MM-dd"
      ) === fecha
  );
}; 
  // =========================================================
  // CARGA INICIAL
  // =========================================================

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const usuario = JSON.parse(
          window.localStorage.getItem(
            "loggedNoteAppUser"
          )
        );

        const especialidadesData =
          await servicioDtc.traerespecialidades(
            usuario.id
          );

        setEspecialidades(
          especialidadesData
        );

        await traerTurnos();
      } catch (error) {
        console.error(
          "Error al cargar especialidades:",
          error
        );
      }
    };

    cargarDatos();
  }, []);

  // =========================================================
  // 🟢 MARCAR DÍAS CON HORARIOS HABITUALES
  // =========================================================
  //
  // IMPORTANTE:
  //
  // Antes esta función preguntaba si había un TURNO guardado
  // dentro de un horario habitual.
  //
  // Ahora solamente pregunta si ese día de la semana tiene
  // HORARIOS CONFIGURADOS.
  //
  // Por ejemplo:
  //
  // horariosEstandar:
  // lunes 08:00 - 12:00
  //
  // Todos los lunes del calendario quedan marcados,
  // aunque no tengan ningún turno creado.
  //
  // =========================================================

  const tieneTurnosHabituales = (date) => {
    if (!date) return false;

    const diaSemana =
      date.getDay() === 0
        ? 7
        : date.getDay();

    return horariosEstandar.some(
      (horario) =>
        Number(horario.dia) === diaSemana
    );
  };

  // =========================================================
  // 🟠 MARCAR DÍAS CON TURNOS EXCEPCIONALES
  // =========================================================

  const tieneTurnoExcepcional = (date) => {
    if (!date) return false;

    const fecha = format(
      date,
      "yyyy-MM-dd"
    );

    const diaSemana =
      date.getDay() === 0
        ? 7
        : date.getDay();

    const horariosDelDia =
      horariosEstandar.filter(
        (h) =>
          Number(h.dia) === diaSemana
      );

    const turnosDelDia =
      turnos.filter(
        (t) =>
          t.fecha &&
          format(
            parseISO(t.fecha),
            "yyyy-MM-dd"
          ) === fecha
      );

    if (turnosDelDia.length === 0) {
      return false;
    }

    return turnosDelDia.some(
      (turno) => {
        return !horariosDelDia.some(
          (horario) => {
            return (
              turno.hora >=
                horario.hora_inicio &&
              turno.hora <
                horario.hora_fin
            );
          }
        );
      }
    );
  };

  // =========================================================
  // SELECCIONAR DÍA
  // =========================================================

  const cargarTurnosDelDia = (date) => {
    if (!date) return;

    setSelectedDate(date);
  };

  // =========================================================
  // ACTUALIZAR TABLA
  // =========================================================

  useEffect(() => {
    if (!selectedDate) return;

    const lista =
      generarHorariosDelDia(
        selectedDate
      );

    setTurnosDelDia(lista);
  }, [
    turnos,
    horariosEstandar,
    selectedDate,
  ]);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Box
      sx={{
        display: "flex",

        flexDirection: {
          xs: "column",
          md: "row",
        },

        gap: 3,

        p: {
          xs: 1,
          md: 2,
        },

        width: "100%",

        maxWidth: 1900,

        margin: "0 auto",

        overflowX: "hidden",

        height: {
          xs: "auto",
          md: "90vh",
        },
      }}
    >
      {/* =====================================================
          CALENDARIO
      ===================================================== */}

      <Paper
        sx={{
          flex: {
            xs: "none",
            md: 1.5,
          },

          p: {
            xs: 2,
            md: 3,
          },

          minWidth: 0,

          backgroundColor: "#242426",

          color: "#f4f4f5",

          border:
            "1px solid #36363a",

          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: "bold",
          }}
        >
          Calendario de Turnos
        </Typography>

        <Box
          sx={{
            width: "100%",

            display: "flex",

            justifyContent:
              "center",

            "& .rdp": {
              margin: 0,

              width: "100%",

              maxWidth: {
                xs: "100%",
                md: "850px",
              },

              "--rdp-accent-color":
                "#3b82f6",

              "--rdp-background-color":
                "#343438",
            },

            "& .rdp-month": {
              width: "100%",

              backgroundColor:
                "#2b2b2e",

              borderRadius:
                "16px",

              padding: {
                xs: "8px",
                md: "20px",
              },

              boxSizing:
                "border-box",
            },

            "& .rdp-month_caption": {
              height: {
                xs: "50px",
                md: "70px",
              },
            },

            "& .rdp-caption_label": {
              fontSize: {
                xs: "1.1rem",
                md: "2rem",
              },

              fontWeight: "700",

              color: "#1565c0",

              textTransform:
                "capitalize",
            },

            "& .rdp-button_previous, & .rdp-button_next":
              {
                width: {
                  xs: "38px",
                  md: "50px",
                },

                height: {
                  xs: "38px",
                  md: "50px",
                },

                borderRadius:
                  "12px",

                border:
                  "1px solid #bbdefb",

                backgroundColor:
                  "#e3f2fd",

                color: "#1565c0",

                "&:hover": {
                  backgroundColor:
                    "#bbdefb",

                  transform:
                    "scale(1.05)",
                },
              },

            "& .rdp-month_grid": {
              width: "100%",
            },

            "& .rdp-table": {
              width: "100%",

              maxWidth:
                "100%",
            },

            "& .rdp-head_cell": {
              fontSize: {
                xs: "0.75rem",
                md: "1.1rem",
              },

              fontWeight: "700",

              color: "#546e7a",

              padding: {
                xs: "5px",
                md: "10px",
              },

              textTransform:
                "uppercase",
            },

            "& .rdp-cell": {
              padding: {
                xs: "2px",
                md: "6px",
              },

              textAlign:
                "center",

              verticalAlign:
                "middle",
            },

            "& .rdp-day": {
              width: {
                xs: "36px",
                md: "85px",
              },

              height: {
                xs: "36px",
                md: "85px",
              },

              maxWidth: {
                xs: "36px",
                md: "85px",
              },

              padding: 0,

              margin: "0 auto",

              fontSize: {
                xs: "0.8rem",
                md: "1.35rem",
              },

              fontWeight: "500",

              borderRadius:
                "50%",

              color: "#e4e4e7",
            },

            "& .rdp-day_button": {
              width: {
                xs: "36px",
                md: "85px",
              },

              height: {
                xs: "36px",
                md: "85px",
              },

              maxWidth: {
                xs: "36px",
                md: "85px",
              },

              padding: 0,

              margin: "0 auto",

              borderRadius:
                "50%",

              fontSize: {
                xs: "0.8rem",
                md: "1.35rem",
              },

              display: "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              position:
                "relative",
            },

            "& .rdp-day:hover:not([disabled])":
              {
                backgroundColor:
                  "#e3f2fd",

                color: "#1565c0",

                transform:
                  "scale(1.08)",
              },

            "& .rdp-selected .rdp-day_button":
              {
                backgroundColor:
                  "#1976d2",

                color:
                  "#ffffff",

                fontWeight: "700",

                boxShadow:
                  "0 4px 10px rgba(25, 118, 210, 0.35)",
              },

            "& .rdp-today:not(.rdp-selected) .rdp-day_button":
              {
                color:
                  "#1976d2",

                fontWeight: "700",

                border:
                  "2px solid #1976d2",
              },

            // =================================================
            // 🟢 DÍA CON HORARIO HABITUAL
            // =================================================

    // 🟢 DÍA CON HORARIO HABITUAL
"& .dia-con-turnos": {
  position: "relative",
},

"& .dia-con-turnos::before": {
  content: '"*"',

  position: "absolute",

  top: {
    xs: "1px",
    md: "5px",
  },

  left: {
    xs: "12px",
    md: "32px",
  },

  fontSize: {
    xs: "16px",
    md: "24px",
  },

  fontWeight: "900",

  color: "#4caf50",

  lineHeight: 1,

  zIndex: 2,
},
// 🔵 DÍA CON TURNOS EXISTENTES
"& .dia-con-turnos-existentes": {
  position: "relative",
},

"& .dia-con-turnos-existentes::before": {
  content: '"*"',
  position: "absolute",

  top: {
    xs: "1px",
    md: "5px",
  },

  right: {
    xs: "12px",
    md: "32px",
  },

  fontSize: {
    xs: "16px",
    md: "24px",
  },

  fontWeight: "900",
  color: "#2196f3",
  lineHeight: 1,
  zIndex: 2,
},
            // =================================================
            // 🟠 DÍA CON TURNO EXCEPCIONAL
            // =================================================

            "& .dia-con-excepcional": {
              position:
                "relative",
            },

            "& .dia-con-excepcional::after":
              {
                content: '"*"',

                position:
                  "absolute",

                top: {
                  xs: "1px",
                  md: "5px",
                },

                right: {
                  xs: "2px",
                  md: "8px",
                },

                fontSize: {
                  xs: "16px",
                  md: "24px",
                },

                fontWeight:
                  "900",

                color:
                  "#f57c00",

                lineHeight: 1,

                zIndex: 2,
              },

            // =================================================
            // 🟢 + SELECCIONADO
            // =================================================

            "& .rdp-selected.dia-con-turnos":
              {
                backgroundColor:
                  "#1976d2 !important",

                color:
                  "#ffffff !important",
              },

            // =================================================
            // OTROS
            // =================================================

            "& .rdp-outside": {
              opacity: 0.35,
            },

            "& .rdp-disabled": {
              opacity: 0.3,
            },
          }}
        >
       <DayPicker
  locale={es}
  mode="single"
  selected={selectedDate}
  onSelect={cargarTurnosDelDia}

  modifiers={{
    tieneTurnos:
      tieneTurnosHabituales,

    tieneTurnosExistentes:
      tieneTurnosExistentes,

    tieneExcepcional:
      tieneTurnoExcepcional,
  }}

  modifiersClassNames={{
    tieneTurnos:
      "dia-con-turnos",

    tieneTurnosExistentes:
      "dia-con-turnos-existentes",

    tieneExcepcional:
      "dia-con-excepcional",
  }}
/>
        </Box>

        {/* =====================================================
            LEYENDA
        ===================================================== */}

        <Box
          sx={{
            display: "flex",

            gap: 3,

            mt: 2,

            justifyContent:
              "center",

            alignItems:
              "center",

            flexWrap: "wrap",
          }}
        >
          <Typography variant="body2">
            🟢 Horario habitual
          </Typography>
<Typography variant="body2">
  <span
    style={{
      color: "#2196f3",
      fontWeight: "bold",
      fontSize: "18px",
    }}
  >
    *
  </span>{" "}
  Turno existente
</Typography>
          <Typography variant="body2">
            <span
              style={{
                color: "#f57c00",
                fontWeight:
                  "bold",
                fontSize:
                  "18px",
              }}
            >
              *
            </span>{" "}
            Turno Fuera de horario
          </Typography>
        </Box>
      </Paper>

      {/* =====================================================
          TABLA DE TURNOS
      ===================================================== */}

      <Paper
        sx={{
          flex: {
            xs: "none",
            md: 1,
          },

          p: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
          }}
        >
          Turnos del día:{" "}
          {selectedDate
            ? format(
                selectedDate,
                "dd/MM/yyyy"
              )
            : "--/--/----"}
        </Typography>

        {/* ===================================================
            NUEVO TURNO
        =================================================== */}

        <Box
          sx={{
            display: "flex",

            gap: 2,

            mb: 2,

            flexWrap: "wrap",
          }}
        >
          <input
            type="time"
            value={horaNueva}
            onChange={(e) =>
              setHoraNueva(
                e.target.value
              )
            }
            style={{
              padding: "8px",
              fontSize: "16px",
            }}
          />

          <select
            value={
              especialidadNueva
            }
            onChange={(e) =>
              setEspecialidadNueva(
                e.target.value
              )
            }
            style={{
              padding: "8px",
              fontSize: "16px",
              minWidth: "220px",
            }}
          >
            <option value="">
              Seleccionar
              especialidad
            </option>

            {especialidades.map(
              (especialidad) => (
                <option
                  key={
                    especialidad.id
                  }
                  value={
                    especialidad.nombre
                  }
                >
                  {
                    especialidad.nombre
                  }
                </option>
              )
            )}
          </select>

          <input
            type="text"
            placeholder="Observaciones"
            value={obsNueva}
            onChange={(e) =>
              setObsNueva(
                e.target.value
              )
            }
            style={{
              padding: "8px",
              fontSize: "16px",
              flex: 1,
            }}
          />

          <Box
            sx={{
              width: 220,
              px: 1,
            }}
          >
            <Typography
              variant="body2"
            >
              Duración:{" "}
              <strong>
                {
                  duracionNueva
                }{" "}
                minutos
              </strong>
            </Typography>

            <Slider
              value={
                duracionNueva
              }
              onChange={(
                event,
                newValue
              ) => {
                setDuracionNueva(
                  Number(newValue)
                );
              }}
              min={30}
              max={90}
              step={null}
              marks={[
                {
                  value: 30,
                  label: "30",
                },
                {
                  value: 45,
                  label: "45",
                },
                {
                  value: 60,
                  label: "60",
                },
                {
                  value: 90,
                  label: "90",
                },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>

          <button
            onClick={
              guardarNuevoTurno
            }
            disabled={
              loadingNuevo
            }
            style={{
              padding:
                "8px 16px",

              background:
                "#1976d2",

              color: "white",

              border: "none",

              cursor: "pointer",

              fontSize: "16px",
            }}
          >
            {loadingNuevo
              ? "Guardando..."
              : "Nuevo Turno"}
          </button>
        </Box>

        {/* ===================================================
            TABLA
        =================================================== */}

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Hora
                </TableCell>

                <TableCell>
                  Paciente
                </TableCell>

                <TableCell>
                  Asistencia
                </TableCell>

                <TableCell>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {turnosDelDia.length >
              0 ? (
                turnosDelDia.map(
                  (t, i) => (
                    <TableRow
                      key={
                        t.id || i
                      }
                    >
                      <TableCell>
                        <strong>
                          {t.hora}{" "}
                          {t.esDisponible
                            ? "Disponible"
                            : "Ocupado"}
                        </strong>
                      </TableCell>

                      <TableCell>
                        {t.esDisponible
                          ? "Disponible"
                          : `${
                              t.apellido ||
                              ""
                            } ${
                              t.nombre ||
                              ""
                            }`}
                      </TableCell>

                      <TableCell>
                        {t.especialidad ||
                          "Sin especialidad"}
                      </TableCell>

                      <TableCell>
                        {t.esDisponible ? (
                          <button
                            onClick={async () => {
                              try {
                                const usuario =
                                  JSON.parse(
                                    window.localStorage.getItem(
                                      "loggedNoteAppUser"
                                    )
                                  );

                                await servicioDtc.nuevoturnodisp(
                                  {
                                    fecha:
                                      t.fecha,

                                    hora:
                                      t.hora,

                                    duracion:
                                      t.duracion,

                                    especialidad:
                                      t.especialidad ||
                                      "",

                                    observaciones:
                                      "",

                                    id_usuario:
                                      usuario.id,
                                  }
                                );

                                await traerTurnos();

                                alert(
                                  "Turno creado. Ahora podés agendar el paciente."
                                );
                              } catch (error) {
                                console.error(
                                  error
                                );

                                alert(
                                  "No se pudo crear el turno"
                                );
                              }
                            }}
                            style={{
                              padding:
                                "7px 14px",

                              background:
                                "#2e7d32",

                              color:
                                "white",

                              border:
                                "none",

                              borderRadius:
                                "6px",

                              cursor:
                                "pointer",

                              fontWeight:
                                "bold",
                            }}
                          >
                            Crear turno
                          </button>
                        ) : (
                          <AgendarTurno
                            idTurno={
                              t.id
                            }
                            onAgendar={(
                              data
                            ) => {
                              servicioDtc
                                .agendarapaciente(
                                  data
                                )
                                .then(
                                  () =>
                                    traerTurnos()
                                );
                            }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                  >
                    No hay horarios
                    configurados para
                    este día.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CalendarioTurnos;
