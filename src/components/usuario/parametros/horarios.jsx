import React, { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SaveIcon from "@mui/icons-material/Save";

import serviciosHorarios from "../../../services/pacientes";

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

const categorias = [
  "Consulta",
  "Control",
  "Primera vez",
];

const duraciones = [
  { label: "30 minutos", value: 30 },
  { label: "60 minutos", value: 60 },
  { label: "90 minutos", value: 90 },
  { label: "120 minutos", value: 120 },
];

const HorariosClinica = () => {

  const [horarios, setHorarios] = useState([]);

  const [usuarioId, setUsuarioId] = useState(null);

  const [cargando, setCargando] = useState(true);

  const [guardando, setGuardando] = useState(false);

  const [mensaje, setMensaje] = useState({
    open: false,
    tipo: "success",
    texto: "",
  });

  // =====================================================
  // MODAL NUEVO HORARIO
  // =====================================================

  const [modalAbierto, setModalAbierto] = useState(false);

  const [nuevoHorario, setNuevoHorario] = useState({
    dia: null,
    hora_inicio: "",
    categoria: "",
    duracion: 30,
  });

  // =====================================================
  // TRAER HORARIOS
  // =====================================================

  useEffect(() => {
    traerHorarios();
  }, []);

  const traerHorarios = async () => {

    try {

      setCargando(true);

      const loggedUserJSON =
        window.localStorage.getItem(
          "loggedNoteAppUser"
        );

      if (!loggedUserJSON) {
        console.error("No hay usuario logueado");
        return;
      }

      const usuario = JSON.parse(loggedUserJSON);

      if (!usuario?.id) {
        console.error("El usuario no tiene ID");
        return;
      }

      setUsuarioId(usuario.id);

      const datos =
        await serviciosHorarios.traerHorarios(
          usuario.id
        );

      console.log(
        "📅 Horarios recibidos:",
        datos
      );

      setHorarios(
        Array.isArray(datos)
          ? datos.map((h) => ({
              ...h,

              // Compatibilidad con horarios
              // anteriores que no tengan estos campos
              categoria:
                h.categoria || "Consulta",

              duracion:
                Number(h.duracion) || 30,
            }))
          : []
      );

    } catch (error) {

      console.error(
        "❌ Error trayendo horarios:",
        error
      );

      mostrarMensaje(
        "error",
        "No se pudieron cargar los horarios"
      );

    } finally {

      setCargando(false);

    }
  };

  // =====================================================
  // CONVERTIR HORA A MINUTOS
  // =====================================================

  const convertirMinutos = (hora) => {

    const [h, m] =
      hora.split(":").map(Number);

    return h * 60 + m;
  };

  // =====================================================
  // CALCULAR HORA FIN
  // =====================================================

  const calcularHoraFin = (
    hora,
    duracion
  ) => {

    const inicio =
      convertirMinutos(hora);

    const minutos =
      inicio + Number(duracion);

    const nuevaHora =
      Math.floor(minutos / 60);

    const nuevosMinutos =
      minutos % 60;

    return `${String(
      nuevaHora
    ).padStart(2, "0")}:${String(
      nuevosMinutos
    ).padStart(2, "0")}`;
  };

  // =====================================================
  // VERIFICAR SOLAPAMIENTO
  // =====================================================

  const haySolapamiento = (
    dia,
    horaInicio,
    duracion
  ) => {

    const inicioNuevo =
      convertirMinutos(horaInicio);

    const finNuevo =
      inicioNuevo + Number(duracion);

    return horarios.some((h) => {

      if (
        Number(h.dia) !== Number(dia)
      ) {
        return false;
      }

      const inicioExistente =
        convertirMinutos(
          h.hora_inicio
        );

      const finExistente =
        convertirMinutos(
          h.hora_fin
        );

      return (
        inicioNuevo < finExistente &&
        finNuevo > inicioExistente
      );
    });
  };

  // =====================================================
  // OBTENER HORARIO QUE ESTÁ OCUPANDO UNA CELDA
  // =====================================================

  const horarioOcupando = (
    dia,
    hora
  ) => {

    const minutos =
      convertirMinutos(hora);

    return horarios.find((h) => {

      if (
        Number(h.dia) !== Number(dia)
      ) {
        return false;
      }

      const inicio =
        convertirMinutos(
          h.hora_inicio
        );

      const fin =
        convertirMinutos(
          h.hora_fin
        );

      // Es una celda intermedia
      return (
        minutos > inicio &&
        minutos < fin
      );
    });
  };

  // =====================================================
  // ABRIR MODAL
  // =====================================================

  const abrirModalHorario = (
    dia,
    hora
  ) => {

    // Si ya está ocupada por otro turno
    if (horarioOcupando(dia, hora)) {
      return;
    }

    // Si ya existe exactamente ese horario
    const existe =
      horarios.some(
        (h) =>
          Number(h.dia) === Number(dia) &&
          h.hora_inicio === hora
      );

    if (existe) {
      return;
    }

    setNuevoHorario({
      dia,
      hora_inicio: hora,
      categoria: categorias[0],
      duracion: 30,
    });

    setModalAbierto(true);
  };

  // =====================================================
  // CERRAR MODAL
  // =====================================================

  const cerrarModal = () => {

    setModalAbierto(false);

    setNuevoHorario({
      dia: null,
      hora_inicio: "",
      categoria: "",
      duracion: 30,
    });
  };

  // =====================================================
  // CONFIRMAR NUEVO HORARIO
  // =====================================================

  const confirmarHorario = () => {

    const {
      dia,
      hora_inicio,
      categoria,
      duracion,
    } = nuevoHorario;

    if (!dia || !hora_inicio) {
      return;
    }

    if (!categoria) {

      mostrarMensaje(
        "error",
        "Seleccioná una categoría"
      );

      return;
    }

    // Verificamos que no se superponga
    if (
      haySolapamiento(
        dia,
        hora_inicio,
        duracion
      )
    ) {

      mostrarMensaje(
        "error",
        "El horario se superpone con otro turno"
      );

      return;
    }

    const hora_fin =
      calcularHoraFin(
        hora_inicio,
        duracion
      );

    const nuevo = {

      id: null,

      dia,

      hora_inicio,

      hora_fin,

      duracion: Number(duracion),

      categoria,

      nuevo: true,
    };

    setHorarios(
      (prev) => [
        ...prev,
        nuevo,
      ]
    );

    cerrarModal();
  };

  // =====================================================
  // ELIMINAR HORARIO
  // =====================================================

  const eliminarHorario = async (
    horario
  ) => {

    try {

      if (!horario.id) {

        setHorarios(
          (prev) =>
            prev.filter(
              (h) =>
                !(
                  Number(h.dia) ===
                    Number(horario.dia) &&
                  h.hora_inicio ===
                    horario.hora_inicio
                )
            )
        );

        return;
      }

      await serviciosHorarios.eliminarHorario(
        horario.id
      );

      setHorarios(
        (prev) =>
          prev.filter(
            (h) =>
              h.id !== horario.id
          )
      );

      mostrarMensaje(
        "success",
        "Horario eliminado correctamente"
      );

    } catch (error) {

      console.error(
        "❌ Error eliminando horario:",
        error
      );

      mostrarMensaje(
        "error",
        "No se pudo eliminar el horario"
      );
    }
  };

  // =====================================================
  // GUARDAR HORARIOS
  // =====================================================

  const guardarHorarios = async () => {

    try {

      if (!usuarioId) {

        mostrarMensaje(
          "error",
          "No se encontró el usuario"
        );

        return;
      }

      if (horarios.length === 0) {

        mostrarMensaje(
          "error",
          "No hay horarios para guardar"
        );

        return;
      }

      setGuardando(true);

      const datos = {

        usuario_id: usuarioId,

        horarios: horarios.map(
          (h) => ({
            dia: h.dia,

            hora_inicio:
              h.hora_inicio,

            hora_fin:
              h.hora_fin,

            duracion:
              Number(h.duracion),

            categoria:
              h.categoria,
          })
        ),
      };

      console.log(
        "📤 Guardando:",
        datos
      );

      await serviciosHorarios.guardarHorarios(
        datos
      );

      mostrarMensaje(
        "success",
        "Horarios guardados correctamente"
      );

      await traerHorarios();

    } catch (error) {

      console.error(
        "❌ Error guardando horarios:",
        error
      );

      mostrarMensaje(
        "error",
        "No se pudieron guardar los horarios"
      );

    } finally {

      setGuardando(false);
    }
  };

  // =====================================================
  // HORARIOS DE UN DÍA
  // =====================================================

  const horariosDelDia = (
    dia
  ) => {

    return horarios.filter(
      (h) =>
        Number(h.dia) ===
        Number(dia)
    );
  };

  // =====================================================
  // MENSAJES
  // =====================================================

  const mostrarMensaje = (
    tipo,
    texto
  ) => {

    setMensaje({
      open: true,
      tipo,
      texto,
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (cargando) {

    return (
      <Box
        sx={{
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // =====================================================
  // VISTA
  // =====================================================

  return (

    <Box
      sx={{
        width: "100%",
        p: {
          xs: 1,
          md: 3,
        },
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
            Seleccioná los días,
            horarios, categorías y
            duración de los turnos.
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

        {/* CABECERA */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns:
              "70px repeat(7, 1fr)",
            borderBottom:
              "1px solid #e5e7eb",
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
                borderLeft:
                  "1px solid #e5e7eb",
              }}
            >

              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: {
                    xs: 11,
                    md: 14,
                  },
                }}
              >
                {dia.nombre}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {
                  horariosDelDia(
                    dia.id
                  ).length
                }{" "}
                horarios
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
                gridTemplateColumns:
                  "70px repeat(7, 1fr)",
                minHeight: 55,
                borderBottom:
                  "1px solid #f0f0f0",
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

              {/* DÍAS */}

              {dias.map((dia) => {

                const horario =
                  horarios.find(
                    (h) =>
                      Number(h.dia) ===
                        Number(dia.id) &&
                      h.hora_inicio ===
                        hora
                  );

                const ocupadoPor =
                  horarioOcupando(
                    dia.id,
                    hora
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

                    {/* ================================= */}
                    {/* CELDA LIBRE */}
                    {/* ================================= */}

                    {!horario &&
                    !ocupadoPor ? (

                      <Button
                        fullWidth
                        onClick={() =>
                          abrirModalHorario(
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
                            color:
                              "primary.main",
                          },
                        }}
                      >
                        <AddIcon
                          fontSize="small"
                        />
                      </Button>

                    ) : horario ? (

                      /* ================================= */
                      /* INICIO DEL HORARIO */
                      /* ================================= */

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

                        <Box
                          sx={{
                            minWidth: 0,
                          }}
                        >

                          <Typography
                            sx={{
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {horario.hora_inicio}
                            {" - "}
                            {horario.hora_fin}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: 10,
                              opacity: 0.9,
                              whiteSpace:
                                "nowrap",
                              overflow:
                                "hidden",
                              textOverflow:
                                "ellipsis",
                            }}
                          >
                            {horario.categoria}
                            {" · "}
                            {horario.duracion} min
                          </Typography>

                        </Box>

                        <IconButton
                          size="small"
                          onClick={() =>
                            eliminarHorario(
                              horario
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

                    ) : (

                      /* ================================= */
                      /* BLOQUE OCUPADO POR DURACIÓN */
                      /* ================================= */

                      <Box
                        sx={{
                          height: "100%",
                          minHeight: 45,
                          borderRadius: 1.5,
                          background:
                            "#e8f1fb",
                          color:
                            "#6b7c93",
                          display: "flex",
                          alignItems: "center",
                          justifyContent:
                            "center",
                          px: 1,
                        }}
                      >

                        <Typography
                          sx={{
                            fontSize: 10,
                            fontWeight: 600,
                          }}
                        >
                          Ocupado
                        </Typography>

                      </Box>

                    )}

                  </Box>
                );
              })}

            </Box>
          ))}

        </Box>
      </Paper>

      {/* BOTÓN GUARDAR */}

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
          Hacé click en un espacio libre
          para agregar un horario.
        </Typography>

        <Button
          variant="contained"
          startIcon={
            guardando ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : (
              <SaveIcon />
            )
          }
          disabled={
            guardando ||
            horarios.length === 0
          }
          onClick={guardarHorarios}
          sx={{
            borderRadius: 2,
            px: 4,
          }}
        >
          {guardando
            ? "Guardando..."
            : "Guardar horarios"}
        </Button>

      </Box>

      {/* ================================================= */}
      {/* MODAL NUEVO HORARIO */}
      {/* ================================================= */}

      <Dialog
        open={modalAbierto}
        onClose={cerrarModal}
        fullWidth
        maxWidth="xs"
      >

        <DialogTitle>
          Agregar horario
        </DialogTitle>

        <DialogContent>

          <Box
            sx={{
              pt: 1,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >

            {/* INFORMACIÓN DEL HORARIO */}

            <Box
              sx={{
                background: "#f5f7fa",
                borderRadius: 2,
                p: 2,
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Día
              </Typography>

              <Typography
                fontWeight={700}
              >
                {
                  dias.find(
                    (d) =>
                      d.id ===
                      nuevoHorario.dia
                  )?.nombre
                }
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Hora de inicio
              </Typography>

              <Typography
                fontWeight={700}
              >
                {nuevoHorario.hora_inicio}
              </Typography>

            </Box>

            {/* CATEGORIA */}

            <FormControl fullWidth>

              <InputLabel>
                Categoría
              </InputLabel>

              <Select
                value={
                  nuevoHorario.categoria
                }
                label="Categoría"
                onChange={(e) =>
                  setNuevoHorario(
                    (prev) => ({
                      ...prev,
                      categoria:
                        e.target.value,
                    })
                  )
                }
              >

                {categorias.map(
                  (categoria) => (

                    <MenuItem
                      key={categoria}
                      value={categoria}
                    >
                      {categoria}
                    </MenuItem>

                  )
                )}

              </Select>

            </FormControl>

            {/* DURACION */}

            <FormControl fullWidth>

              <InputLabel>
                Duración
              </InputLabel>

              <Select
                value={
                  nuevoHorario.duracion
                }
                label="Duración"
                onChange={(e) =>
                  setNuevoHorario(
                    (prev) => ({
                      ...prev,
                      duracion:
                        Number(
                          e.target.value
                        ),
                    })
                  )
                }
              >

                {duraciones.map(
                  (duracion) => (

                    <MenuItem
                      key={
                        duracion.value
                      }
                      value={
                        duracion.value
                      }
                    >
                      {duracion.label}
                    </MenuItem>

                  )
                )}

              </Select>

            </FormControl>

            {/* HORA FIN */}

            <Box
              sx={{
                background:
                  "#e8f5e9",
                borderRadius: 2,
                p: 2,
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                El turno finalizará a las
              </Typography>

              <Typography
                fontWeight={700}
                color="success.main"
              >
                {calcularHoraFin(
                  nuevoHorario.hora_inicio,
                  nuevoHorario.duracion
                )}
              </Typography>

            </Box>

          </Box>

        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >

          <Button
            onClick={cerrarModal}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={confirmarHorario}
          >
            Agregar horario
          </Button>

        </DialogActions>

      </Dialog>

      {/* MENSAJE */}

      <Snackbar
        open={mensaje.open}
        autoHideDuration={3000}
        onClose={() =>
          setMensaje(
            (prev) => ({
              ...prev,
              open: false,
            })
          )
        }
      >

        <Alert
          severity={mensaje.tipo}
          variant="filled"
        >
          {mensaje.texto}
        </Alert>

      </Snackbar>

    </Box>
  );
};

export default HorariosClinica;