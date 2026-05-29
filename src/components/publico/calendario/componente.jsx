import React, { useEffect, useState, useRef } from "react";

import { es } from "date-fns/locale";
import { startOfDay, parseISO, format } from "date-fns";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

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
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import servicioDtc from "../../../services/pacientes";

const categorias = [
  { value: "consulta", label: "Consulta" },
  { value: "control", label: "Control" },
  { value: "urgencia", label: "Urgencia" },
];

const PaginaTurnosPublica = () => {
  const [turnos, setTurnos] = useState([]);

  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [turnosDelDia, setTurnosDelDia] =
    useState([]);

  const [turnoSeleccionado, setTurnoSeleccionado] =
    useState(null);
const [tiempoRestante, setTiempoRestante] =
  useState(300); // 5 minutos

const [expirado, setExpirado] =
  useState(false);
  // =========================
  // FORM
  // =========================
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [categoria, setCategoria] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // =========================
  // PAGO
  // =========================
  const [estadoSolicitud, setEstadoSolicitud] =
    useState(null);

  const [solicitudId, setSolicitudId] =
    useState(null);

  const [pagoUrl, setPagoUrl] =
    useState("");

  // =========================
  // MODAL
  // =========================
  const [openExito, setOpenExito] =
    useState(false);

  const formularioRef = useRef(null);
  const tablaRef = useRef(null);

  // =========================
  // TRAER TURNOS
  // =========================
  const traerTurnos = async () => {
    const data =
      await servicioDtc.traerTurnosDisponibles();

    setTurnos(
      data.map((t) => ({
        ...t,
        fechaObj: startOfDay(
          parseISO(t.fecha)
        ),
      }))
    );
  };

  useEffect(() => {
    traerTurnos();
  }, []);
useEffect(() => {

  if (
    estadoSolicitud !== "pendiente"
  ) return;

  if (expirado) return;

  const timer = setInterval(() => {

    setTiempoRestante((prev) => {

      if (prev <= 1) {

        clearInterval(timer);

        setExpirado(true);

        setEstadoSolicitud(
          "rechazado"
        );

        return 0;
      }

      return prev - 1;

    });

  }, 1000);

  return () => clearInterval(timer);

}, [estadoSolicitud, expirado]);
  // =========================
  // CONSULTAR ESTADO
  // =========================
useEffect(() => {

  if (!solicitudId) return;

  console.log(
    "INICIANDO INTERVALO:",
    solicitudId
  );

  const interval = setInterval(async () => {

    try {

      console.log(
        "CONSULTANDO CADA 5 SEGUNDOS..."
      );

      const resp =
        await servicioDtc.estadoSolicitud(
          solicitudId
        );

      console.log(
        "RESPUESTA:",
        resp
      );

      const estado =
        resp?.solicitud?.estado ||
        resp?.estado;

      console.log(
        "ESTADO:",
        estado
      );

      // =========================
      // CONFIRMADO
      // =========================

      if (estado === "confirmado") {

        setEstadoSolicitud(
          "confirmado"
        );

        setOpenExito(true);

        traerTurnos();

        clearInterval(interval);

      }

      // =========================
      // RECHAZADO
      // =========================

      if (estado === "rechazado") {

        setEstadoSolicitud(
          "rechazado"
        );

        clearInterval(interval);

      }

    } catch (error) {

      console.error(
        "ERROR CONSULTANDO:",
        error
      );

    }

  }, 5000);

  return () => {

    console.log(
      "LIMPIANDO INTERVALO"
    );

    clearInterval(interval);

  };

}, [solicitudId]);
  // =========================
  // DÍAS CON TURNOS
  // =========================
  const diasConTurnos = turnos.map(
    (t) => t.fechaObj
  );
const formatearTiempo = (segundos) => {

  const min = Math.floor(
    segundos / 60
  );

  const sec = segundos % 60;

  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

};
  // =========================
  // CARGAR TURNOS DEL DÍA
  // =========================
  const cargarTurnosDelDia = (date) => {
    if (!date) return;

    setSelectedDate(date);

    setTimeout(() => {
      tablaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  useEffect(() => {
    const lista = turnos.filter(
      (t) =>
        startOfDay(
          parseISO(t.fecha)
        ).getTime() ===
        startOfDay(selectedDate).getTime()
    );

    setTurnosDelDia(lista);
  }, [turnos, selectedDate]);

  // =========================
  // SCROLL FORM
  // =========================
  const scrollToFormulario = () => {
    setTimeout(() => {
      formularioRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };
useEffect(() => {

  console.log(
    "SOLICITUD ID CAMBIÓ:",
    solicitudId
  );

}, [solicitudId]);
  // =========================
  // SOLICITAR TURNO
  // =========================
  const solicitarTurno = async () => {
    if (
      !nombre ||
      !dni ||
      !telefono ||
      !categoria
    ) {
      alert("Completá todos los datos 🙂");
      return;
    }

    try {
      setLoading(true);

      const resp =
        await servicioDtc.solicitarturno({
          id_turno: turnoSeleccionado.id,
          nombre,
          dni,
          telefono,
          categoria,
        });

      console.log(
  "RESPUESTA COMPLETA:",
  resp
);

console.log(
  "ID SOLICITUD:",
  resp.id_solicitud
);;

      // guardar id solicitud
setSolicitudId(
  turnoSeleccionado.id
);

      // guardar url pago
      if (resp.pago_url) {
        setPagoUrl(resp.pago_url);
      }

      // estado pendiente
      setEstadoSolicitud("pendiente");

    } catch (error) {
      console.error(error);
      alert("Error al solicitar turno");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // IR A PAGO
  // =========================
  const abrirPago = () => {
    if (!pagoUrl) return;

    window.open(
      pagoUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // =========================
  // TOP
  // =========================
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          maxWidth: "1400px",
          margin: "auto",
        }}
      >
        {/* ========================= */}
        {/* HEADER */}
        {/* ========================= */}

        <Paper
          elevation={0}
          sx={{
            background:
              "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            mb: 4,
            textAlign: "center",
            border: "1px solid #dbe3ec",
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "2rem",
                md: "2.7rem",
              },
              fontWeight: 700,
              color: "#1976d2",
              mb: 1,
            }}
          >
            Reservá tu turno online
          </Typography>

          <Typography
            sx={{
              color: "#555",
              maxWidth: 500,
              margin: "auto",
              fontSize: "1.05rem",
            }}
          >
            Elegí un día y horario
            disponible. Luego completá
            tus datos y confirmá tu
            solicitud.
          </Typography>
        </Paper>

        {/* ========================= */}
        {/* CALENDARIO + TABLA */}
        {/* ========================= */}

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              lg: "row",
            },
            gap: 3,
            alignItems: "stretch",
          }}
        >
          {/* ========================= */}
          {/* CALENDARIO */}
          {/* ========================= */}

          <Paper
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 4,
              border:
                "1px solid #dbe3ec",
              background:
                "linear-gradient(135deg, #e3f2fd 0%, #ffffff 70%)",
              boxShadow:
                "0 6px 16px rgba(25, 118, 210, 0.08)",
                overflow: "hidden",
width: "100%",
            }}
          >
            <Box
              sx={{
                background:
                  "linear-gradient(90deg, #1976d2, #42a5f5)",
                borderRadius: 3,
                p: 1.5,
                mb: 3,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                }}
              >
                Seleccioná el día
              </Typography>
            </Box>

          <Box
  sx={{
    width: "100%",
    overflowX: "auto",
    display: "flex",
    justifyContent: "center",

    "& .rdp": {
      margin: 0,
      width: {
        xs: "100%",
        sm: "auto",
      },
    },

    "& .rdp-month": {
      width: "100%",
    },

    "& .rdp-table": {
      width: "100%",
      maxWidth: "100%",
    },

    "& .rdp-cell": {
      padding: {
        xs: "2px",
        sm: "4px",
      },
    },

    "& .rdp-button": {
      width: {
        xs: 36,
        sm: 42,
      },
      height: {
        xs: 36,
        sm: 42,
      },
      fontSize: {
        xs: "0.8rem",
        sm: "0.95rem",
      },
    },

    "& .rdp-caption_label": {
      fontSize: {
        xs: "0.95rem",
        sm: "1rem",
      },
    },
  }}
>
  <DayPicker
    locale={es}
    mode="single"
    selected={selectedDate}
    onSelect={cargarTurnosDelDia}
    modifiers={{
      tieneTurnos: diasConTurnos,
    }}
    modifiersStyles={{
      tieneTurnos: {
        backgroundColor: "#1976d2",
        color: "#fff",
        borderRadius: "50%",
      },
      selected: {
        backgroundColor: "#0d47a1",
        color: "#fff",
      },
    }}
  />
</Box>
          </Paper>

          {/* ========================= */}
          {/* HORARIOS */}
          {/* ========================= */}

          <Paper
            ref={tablaRef}
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 4,
            }}
          >
            <Typography
              sx={{
                mb: 2,
                fontWeight: "bold",
                color: "#1976d2",
                fontSize: "1.1rem",
              }}
            >
              Horarios disponibles –{" "}
              {format(
                selectedDate,
                "dd/MM/yyyy"
              )}
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor:
                        "#e3f2fd",
                    }}
                  >
                    <TableCell>
                      <strong>
                        Horario
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>
                        Acción
                      </strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {turnosDelDia.length >
                  0 ? (
                    turnosDelDia.map(
                      (t) => (
                        <TableRow
                          key={t.id}
                        >
                          <TableCell>
                            {t.hora}
                          </TableCell>

                          <TableCell>
                            <Button
                              variant="contained"
                              disabled={
                                t.id_pacientee
                              }
                              onClick={() => {
                                if (
                                  t.id_pacientee
                                )
                                  return;

                                setTurnoSeleccionado(
                                  t
                                );

                                scrollToFormulario();
                              }}
                            >
                              {t.id_pacientee
                                ? "Ocupado"
                                : "Solicitar"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    )
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={2}
                        align="center"
                      >
                        No hay horarios
                        disponibles
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>

        {/* ========================= */}
        {/* FORMULARIO */}
        {/* ========================= */}

        {turnoSeleccionado && (
          <Paper
            ref={formularioRef}
            sx={{
              p: 4,
              mt: 4,
              borderRadius: 4,
              backgroundColor:
                "#f9fbff",
              border:
                "1px solid #e0e0e0",
            }}
          >
            <Typography
              sx={{
                mb: 3,
                fontWeight: "bold",
                color: "#1976d2",
                fontSize: "1.2rem",
              }}
            >
              Completá tus datos para
              confirmar el turno de las{" "}
              {
                turnoSeleccionado.hora
              }
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection:
                  "column",
                gap: 2,
                maxWidth: 450,
              }}
            >
              <TextField
                label="Nombre completo"
                value={nombre}
                onChange={(e) =>
                  setNombre(
                    e.target.value
                  )
                }
                disabled={
                  estadoSolicitud ===
                  "pendiente"
                }
              />

              <TextField
                label="DNI"
                value={dni}
                onChange={(e) =>
                  setDni(
                    e.target.value
                  )
                }
                disabled={
                  estadoSolicitud ===
                  "pendiente"
                }
              />

              <TextField
                label="Teléfono"
                value={telefono}
                onChange={(e) =>
                  setTelefono(
                    e.target.value
                  )
                }
                disabled={
                  estadoSolicitud ===
                  "pendiente"
                }
              />

              <TextField
                select
                label="Motivo de consulta"
                value={categoria}
                onChange={(e) =>
                  setCategoria(
                    e.target.value
                  )
                }
                disabled={
                  estadoSolicitud ===
                  "pendiente"
                }
              >
                {categorias.map(
                  (c) => (
                    <MenuItem
                      key={c.value}
                      value={c.value}
                    >
                      {c.label}
                    </MenuItem>
                  )
                )}
              </TextField>

              {/* BOTÓN SOLICITAR */}

              <Button
                variant="contained"
                size="large"
                onClick={
                  solicitarTurno
                }
                disabled={
                  loading ||
                  estadoSolicitud ===
                    "pendiente"
                }
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: "#fff",
                    }}
                  />
                ) : (
                  "Confirmar solicitud"
                )}
              </Button>

              {/* BLOQUE PAGO */}
<Alert severity="info">

  Tiempo restante para pagar:

  <strong>
    {" "}
    {formatearTiempo(
      tiempoRestante
    )}
  </strong>

</Alert>
              {estadoSolicitud ===
                "pendiente" &&
                pagoUrl && (
                  <Box
                    sx={{
                      display:
                        "flex",
                      flexDirection:
                        "column",
                      gap: 2,
                      mt: 1,
                    }}
                  >
                    <Alert severity="warning">
                      Tu turno se
                      confirmará cuando
                      abones la oblea.
                    </Alert>

                    <Button
                      variant="contained"
                      color="success"
                      onClick={
                        abrirPago
                      }
                    >
                      Ir al pago
                    </Button>

                    <Typography
                      variant="body2"
                      sx={{
                        textAlign:
                          "center",
                        color:
                          "gray",
                      }}
                    >
                      Luego de realizar
                      el pago, esta
                      pantalla se
                      actualizará
                      automáticamente.
                    </Typography>
                  </Box>
                )}

              {estadoSolicitud ===
                "rechazado" && (
                <Alert severity="error">
                  La solicitud fue
                  rechazada o vencida.
                </Alert>
              )}
            </Box>
          </Paper>
        )}
      </Box>

      {/* ========================= */}
      {/* MODAL ÉXITO */}
      {/* ========================= */}

      <Dialog
        open={openExito}
        onClose={() =>
          setOpenExito(false)
        }
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          🎉 ¡Turno confirmado!
        </DialogTitle>

        <DialogContent
          sx={{
            textAlign: "center",
            mt: 1,
          }}
        >
          <Typography>
            Tu turno fue confirmado
            correctamente.
          </Typography>

          <Typography
            sx={{
              mt: 2,
              color: "#1976d2",
              fontWeight: "bold",
            }}
          >
            ¡Gracias por confiar en
            nosotros!
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 2,
          }}
        >
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