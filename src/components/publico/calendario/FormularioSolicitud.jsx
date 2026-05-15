import React, { useState, useEffect } from "react";

import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

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

  const [estadoSolicitud, setEstadoSolicitud] =
    useState(null);

  const [solicitudId, setSolicitudId] =
    useState(null);

  const [pagoUrl, setPagoUrl] = useState("");

  // ==============================
  // CONSULTAR ESTADO AUTOMÁTICO
  // ==============================
  useEffect(() => {
    if (!solicitudId) return;

    const interval = setInterval(async () => {
      try {
        const resp =
          await servicioDtc.estadoSolicitud(
            solicitudId
          );

        console.log("Estado:", resp);

        if (resp.estado === "confirmado") {
          setEstadoSolicitud("confirmado");

          clearInterval(interval);

          if (onSuccess) {
            onSuccess();
          }
        }

        if (resp.estado === "rechazado") {
          setEstadoSolicitud("rechazado");

          clearInterval(interval);
        }
      } catch (error) {
        console.error(error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [solicitudId, onSuccess]);

  // ==============================
  // ENVIAR SOLICITUD
  // ==============================
  const enviarSolicitud = async () => {
    if (
      !nombre ||
      !dni ||
      !telefono ||
      !categoria
    ) {
      alert("Complete todos los campos");
      return;
    }

    try {
      setLoading(true);

      const resp =
        await servicioDtc.solicitarturno({
          id_turno: turno.id,
          nombre,
          dni,
          telefono,
          categoria,
        });

      console.log(
        "Respuesta solicitud:",
        resp
      );

      // guardar ID solicitud
      if (resp.id_solicitud) {
        setSolicitudId(resp.id_solicitud);
      }

      // guardar URL pago
      if (resp.pago_url) {
        setPagoUrl(resp.pago_url);
      }

      // mostrar pendiente
      setEstadoSolicitud("pendiente");

    } catch (error) {
      console.error(error);
      alert("Error al solicitar el turno");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // ABRIR MERCADO PAGO
  // ==============================
  const abrirPago = () => {
    if (!pagoUrl) return;

    window.open(
      pagoUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        maxWidth: 420,
        width: "100%",
      }}
    >
      {/* ===================== */}
      {/* ALERTAS */}
      {/* ===================== */}

      {estadoSolicitud === "confirmado" && (
        <Alert severity="success">
          Turno confirmado correctamente.
        </Alert>
      )}

      {estadoSolicitud === "rechazado" && (
        <Alert severity="error">
          La solicitud fue rechazada o vencida.
        </Alert>
      )}

      {/* ===================== */}
      {/* FORMULARIO */}
      {/* ===================== */}

      <TextField
        label="Nombre completo"
        value={nombre}
        onChange={(e) =>
          setNombre(e.target.value)
        }
        disabled={estadoSolicitud === "pendiente"}
      />

      <TextField
        label="DNI"
        value={dni}
        onChange={(e) =>
          setDni(e.target.value)
        }
        disabled={estadoSolicitud === "pendiente"}
      />

      <TextField
        label="Teléfono"
        value={telefono}
        onChange={(e) =>
          setTelefono(e.target.value)
        }
        disabled={estadoSolicitud === "pendiente"}
      />

      <TextField
        select
        label="Motivo de consulta"
        value={categoria}
        onChange={(e) =>
          setCategoria(e.target.value)
        }
        disabled={estadoSolicitud === "pendiente"}
      >
        {categorias.map((c) => (
          <MenuItem
            key={c.value}
            value={c.value}
          >
            {c.label}
          </MenuItem>
        ))}
      </TextField>

      {/* ===================== */}
      {/* BOTÓN SOLICITAR */}
      {/* ===================== */}

      <Button
        variant="contained"
        onClick={enviarSolicitud}
        disabled={
          loading ||
          estadoSolicitud === "pendiente"
        }
        sx={{
          py: 1.4,
          fontWeight: "bold",
          borderRadius: 2,
          cursor: "pointer",

          "&:hover": {
            boxShadow:
              "0 6px 18px rgba(0,0,0,0.18)",
          },
        }}
      >
        {loading ? (
          <CircularProgress
            size={24}
            sx={{ color: "#fff" }}
          />
        ) : (
          "Confirmar solicitud"
        )}
      </Button>

      {/* ===================== */}
      {/* BLOQUE PAGO */}
      {/* ===================== */}

      {estadoSolicitud === "pendiente" &&
        pagoUrl && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
            <Alert severity="warning">
              Tu turno se confirmará cuando
              abones la oblea.
            </Alert>

            <Button
              variant="contained"
              color="success"
              onClick={abrirPago}
              sx={{
                py: 1.3,
                fontWeight: "bold",
                borderRadius: 2,
                cursor: "pointer",

                "&:hover": {
                  boxShadow:
                    "0 6px 18px rgba(0,0,0,0.18)",
                },
              }}
            >
              Ir al pago
            </Button>

            <Typography
              variant="body2"
              sx={{
                textAlign: "center",
                color: "gray",
              }}
            >
              Luego de realizar el pago,
              esta pantalla se actualizará
              automáticamente.
            </Typography>
          </Box>
        )}
    </Box>
  );
};

export default FormularioSolicitud;