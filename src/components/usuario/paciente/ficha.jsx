import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
import FormularioConsulta from "./FormularioConsulta";
import Odontograma from "./Odontograma";
import { useParams , useNavigate } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import html2canvas from "html2canvas";
import servicioDtc from "../../../services/pacientes";
import Modificar from "./modificar"
import Borrarusuaio from "./modalborrar";
import NuevoTurno from "./nuevoturno";
import BorrarTurno from "./modalborrarturno";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const sectionStyle = {
  border: "1px solid #c62828",
  borderRadius: 1,
  mb: 3,
};

const sectionHeader = {
  backgroundColor: "#f8d7da",
  px: 2,
  py: 0.5,
  fontWeight: "bold",
  fontSize: 14,
  color: "#7f0000",
};

const sectionBody = {
  p: 2,
};
const FichaPersona = (props) => {
    const navigate = useNavigate();
  let params = useParams();
  let id = params.id;
const [consultas, setConsultas] = useState([]);
const [nuevaConsulta, setNuevaConsulta] = useState(false);
  const [chico, setchico] = useState();
  const [turnos, setTurnos] = useState([]);
  const [usuario, setUsuario] = useState();
const [tab, setTab] = useState(0);
  useEffect(() => {
    traer();
  }, []);

  const calcularEdad = (fecha) => {
  if (!fecha) return "";
  const nacimiento = new Date(fecha);
  const hoy = new Date();

  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const m = hoy.getMonth() - nacimiento.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad;
};
const descargarHistoriaClinica = async () => {

  // ir a odontograma
  setTab(3);

  await new Promise(
    (resolve) =>
      setTimeout(resolve, 800)
  );

  const doc = new jsPDF(
    "p",
    "mm",
    "a4"
  );

  let y = 15;

  // =========================
  // TITULO
  // =========================

  doc.setFontSize(18);

  doc.text(
    "Historia Clínica",
    70,
    y
  );

  y += 15;

  // =========================
  // DATOS PERSONALES
  // =========================

  doc.setFontSize(12);

  doc.text(
    "Datos Personales:",
    14,
    y
  );

  y += 10;

  doc.setFontSize(10);

  doc.text(
    `Apellido y Nombre: ${chico.apellido || ""} ${chico.nombre || ""}`,
    14,
    y
  );

  y += 8;

  doc.text(
    `Domicilio actual: ${chico.direccion || ""}`,
    14,
    y
  );

  y += 8;

  doc.text(
    `DNI: ${chico.dni || ""}      Edad: ${calcularEdad(chico.fecha_nacimiento)}      Fecha Nacimiento: ${formatFecha(chico.fecha_nacimiento)}      Sexo: ${chico.genero || ""}`,
    14,
    y
  );

  y += 8;

  doc.text(
    `Teléfono: ${chico.telefono || ""}`,
    14,
    y
  );

  y += 12;

  // =========================
  // MOTIVO
  // =========================

  doc.setFontSize(12);

  doc.text(
    "Motivo de la consulta:",
    14,
    y
  );

  y += 8;

  doc.setFontSize(10);

  doc.text(
    "........................................................................................................................",
    14,
    y
  );

  y += 12;

  // =========================
  // ANTECEDENTES
  // =========================

  doc.setFontSize(12);

  doc.text(
    "Antecedentes Personales:",
    14,
    y
  );

  y += 10;

  doc.setFontSize(10);

  const antecedentes = [

    "Hospitalización en los últimos dos años: SI ( )   NO ( )",
    "Atención médica en los últimos 6 meses:",
    "Tratamientos Quirúrgicos:",
    "Medicación actual:",
    "Alergias:",
    "Grupo Sanguíneo:",
    "Antecedentes Hereditarios:",
    "Problemas de Coagulación:",
    "Fuma: SI ( ) NO ( )",
    "Embarazo: SI ( ) NO ( )",
    "Anticonceptivos:",
    "Presión arterial:",
    "HTA:",
    "Enfermedades sistémicas:",
    "Enfermedades de transmisión sexual:",
    "HIV:",
  ];

  antecedentes.forEach((txt) => {

    doc.text(
      `${txt} ........................................................................`,
      14,
      y
    );

    y += 7;

  });

  y += 5;

  // =========================
  // ODONTOGRAMA
  // =========================

  doc.setFontSize(12);

  doc.text(
    "Odontograma:",
    14,
    y
  );

  y += 10;

  const odontograma =
    document.getElementById(
      "odontograma-pdf"
    );

  if (odontograma) {

    const canvas =
      await html2canvas(
        odontograma,
        {
          scale: 4,
          useCORS: true,
          backgroundColor: "#ffffff",
        }
      );

    const imgData =
      canvas.toDataURL(
        "image/png"
      );

    const imgWidth = 180;

    const imgHeight =
      (canvas.height * imgWidth)
      / canvas.width;

    doc.addImage(
      imgData,
      "PNG",
      15,
      y,
      imgWidth,
      imgHeight
    );

    y += imgHeight + 15;
  }

  // =========================
  // CONSENTIMIENTO
  // =========================

  if (y > 220) {

    doc.addPage();

    y = 20;

  }

  doc.setFontSize(12);

  doc.text(
    "Consentimiento Informado:",
    14,
    y
  );

  y += 12;

  doc.setFontSize(10);

  const consentimiento = `
Yo......................................................................................., DNI N°............................................

Con domicilio en calle...........................................................................................................................

He comprendido todas las explicaciones que se me han facilitado en lenguaje claro y sencillo.

Otorgo mi total consentimiento para realizar el tratamiento necesario para rehabilitar mi salud bucodental.
  `;

  const lineas =
    doc.splitTextToSize(
      consentimiento,
      180
    );

  doc.text(
    lineas,
    14,
    y
  );

  y += 45;

  // =========================
  // FIRMAS
  // =========================

  doc.text(
    "....................................",
    20,
    y
  );

  doc.text(
    "....................................",
    80,
    y
  );

  doc.text(
    "....................................",
    150,
    y
  );

  y += 6;

  doc.text(
    "Firma Paciente/Tutor",
    18,
    y
  );

  doc.text(
    "Aclaración",
    95,
    y
  );

  doc.text(
    "DNI",
    165,
    y
  );

  // =========================
  // DESCARGAR
  // =========================

  doc.save(
    `Historia_Clinica_${chico.apellido}_${chico.nombre}.pdf`
  );
};

const handleTabChange = (event, newValue) => {
  setTab(newValue);
};

const formatFecha = (fecha) => {
  if (!fecha) return "";
  const [year, month, day] = fecha.split("-");
  return `${day}/${month}/${year}`;
}; 

  const traer = async () => {
    try {
      const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");
      if (loggedUserJSON) {
        const usuario = JSON.parse(loggedUserJSON);
        setUsuario(usuario);

        const novedades = await servicioDtc.datospaciente(
          id === undefined ? props.id : id
        );

        setchico(novedades[0][0]);
        setTurnos(novedades[2]);
        setConsultas(novedades[3] || []);
      }
    } catch (error) {
      console.log(error);
    }
  };  

  if (!chico) return <>Cargando...</>;

  return (
    <>
      {/* -------------------------------- FICHA PRINCIPAL -------------------------------- */}
   {/* -------------------------------- FICHA PRINCIPAL -------------------------------- */}
<Box
  sx={{
    width: "100%",
    minHeight: "100vh",
    px: { xs: 1, sm: 2, md: 3 },
    py: 3,
    boxSizing: "border-box",
  }}
>
  <Paper
    elevation={3}
    sx={{
      borderRadius: 2,
      width: "100%",
      overflow: "hidden",
    }}
  >
    <CardContent>
<Button
  variant="contained"
  color="error"
  onClick={descargarHistoriaClinica}
>
  Descargar PDF
</Button>
      <Typography
        variant="h6"
        align="center"
        sx={{
          fontWeight: "bold",
          mb: 2,
          fontSize: {
            xs: "1rem",
            md: "1.3rem",
          },
        }}
      >
        HISTORIA CLÍNICA – FICHA DEL PACIENTE
      </Typography>

      {/* ================= PESTAÑAS ================= */}

      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 3,

          "& .MuiTabs-flexContainer": {
            gap: 1,
          },

          "& .MuiTab-root": {
            fontWeight: "bold",
            border: "1px solid #c62828",
            borderBottom: "none",
            borderRadius: "6px 6px 0 0",
            backgroundColor: "#f8d7da",
            minHeight: 48,
          },

          "& .Mui-selected": {
            backgroundColor: "#ffffff",
          },
        }}
      >
        <Tab label="Datos del paciente" />
        <Tab label="Turnos" />
        <Tab label="Consultas" />
        <Tab label="Odontograma" />
      </Tabs>

      {/* ================= TAB DATOS ================= */}

      {tab === 0 && (
        <>
          {/* ===== DATOS PERSONALES ===== */}

          <Box sx={sectionStyle}>
            <Box sx={sectionHeader}>
              DATOS PERSONALES
            </Box>

            <Box sx={sectionBody}>
              <Grid container spacing={2}>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Apellido"
                    fullWidth
                    size="small"
                    value={chico.apellido || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Nombre"
                    fullWidth
                    size="small"
                    value={chico.nombre || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="DNI"
                    fullWidth
                    size="small"
                    value={chico.dni || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Género"
                    fullWidth
                    size="small"
                    value={chico.genero || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Fecha nacimiento"
                    fullWidth
                    size="small"
                    value={formatFecha(
                      chico.fecha_nacimiento
                    )}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    label="Edad"
                    fullWidth
                    size="small"
                    value={calcularEdad(
                      chico.fecha_nacimiento
                    )}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    label="Fecha ingreso"
                    fullWidth
                    size="small"
                    value={
                      formatFecha(chico.ingreso) || ""
                    }
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

              </Grid>
            </Box>
          </Box>

          {/* ===== CONTACTO ===== */}

          <Box sx={sectionStyle}>
            <Box sx={sectionHeader}>
              DOMICILIO Y CONTACTO
            </Box>

            <Box sx={sectionBody}>
              <Grid container spacing={2}>

                <Grid item xs={12}>
                  <TextField
                    label="Dirección"
                    fullWidth
                    size="small"
                    value={chico.direccion || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Teléfono"
                    fullWidth
                    size="small"
                    value={chico.telefono || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Email"
                    fullWidth
                    size="small"
                    value={chico.email || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

              </Grid>
            </Box>
          </Box>

          {/* ===== COBERTURA ===== */}

          <Box sx={sectionStyle}>
            <Box sx={sectionHeader}>
              COBERTURA MÉDICA
            </Box>

            <Box sx={sectionBody}>
              <Grid container spacing={2}>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Obra social"
                    fullWidth
                    size="small"
                    value={
                      chico.obra_social || ""
                    }
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="N° afiliado"
                    fullWidth
                    size="small"
                    value={
                      chico.numero_afiliado || ""
                    }
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

              </Grid>
            </Box>
          </Box>

          {/* ===== BOTONES ===== */}

          <Box
            sx={{
              mt: 3,
              display: "flex",
              gap: 2,
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <Modificar
              {...chico}
              traer={traer}
            />

            <Borrarusuaio
              id={chico.id}
            />
          </Box>
        </>
      )}

      {/* ================= TAB TURNOS ================= */}

      {tab === 1 && (
        <Box
          sx={{
            width: "100%",
            mt: 2,
            p: { xs: 1, md: 2 },
            borderRadius: 2,
            backgroundColor: "#f7f7f7",
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Turnos
          </Typography>

          <Box sx={{ mb: 2 }}>
            <NuevoTurno
              id_paciente={chico.id}
              traer={traer}
            />
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              overflowX: "auto",
              width: "100%",
            }}
          >
            <Table sx={{ minWidth: 900 }}>
              <TableHead>

                <TableRow
                  sx={{
                    backgroundColor:
                      "#e8ecef",
                  }}
                >
                  <TableCell>
                    <strong>Fecha</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Hora</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Motivo</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Asistencia</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Observaciones</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Atender</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Borrar</strong>
                  </TableCell>
                </TableRow>

              </TableHead>

              <TableBody>

                {turnos.map((ob, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        index % 2 === 0
                          ? "#ffffff"
                          : "#f2f5f7",

                      "&:hover": {
                        backgroundColor:
                          "#dfe7ee",
                        transition: "0.2s",
                      },
                    }}
                  >
                    <TableCell>
                      {ob.fecha}
                    </TableCell>

                    <TableCell>
                      {ob.hora}
                    </TableCell>

                    <TableCell>
                      {ob.motivo}
                    </TableCell>

                    <TableCell>
                      {ob.asistencia}
                    </TableCell>

                    <TableCell>
                      {ob.observaciones}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() =>
                          navigate(
                            `/usuario/turno/${ob.id}`
                          )
                        }
                        sx={{
                          cursor: "pointer",

                          "&:hover": {
                            boxShadow:
                              "0 6px 18px rgba(0,0,0,0.18)",
                          },
                        }}
                      >
                        Ver Consulta
                      </Button>
                    </TableCell>

                    <TableCell>
                      <BorrarTurno
                        id_turno={ob.id}
                        traer={traer}
                      />
                    </TableCell>

                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {/* ================= TAB CONSULTAS ================= */}

      {tab === 2 && (
        <Box sx={{ p: 2 }}>

          <Box
            sx={{
              display: "flex",
              justifyContent:
                "space-between",
              mb: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
              }}
            >
              Consultas
            </Typography>

            <Button
              variant="contained"
              onClick={() =>
                setNuevaConsulta(true)
              }
            >
              Nueva consulta
            </Button>
          </Box>

          {consultas.length === 0 && (
            <Typography>
              No hay consultas cargadas
            </Typography>
          )}

          {consultas.map((c, i) => (
            <Card
              key={i}
              sx={{ mb: 2 }}
            >
              <CardContent>

                <Typography
                  sx={{
                    fontWeight: "bold",
                  }}
                >
                  Fecha: {c.fecha}
                </Typography>

                <Typography>
                  Motivo: {c.motivo}
                </Typography>

                <Typography>
                  Evolución: {c.evolucion}
                </Typography>

                <Typography>
                  Tratamiento: {c.tratamiento}
                </Typography>

              </CardContent>
            </Card>
          ))}

          {nuevaConsulta && (
            <FormularioConsulta
              turnoSeleccionado={
                turnos[0]
              }
              id_paciente={chico.id}
              traer={traer}
              cerrar={() =>
                setNuevaConsulta(false)
              }
            />
          )}
        </Box>
      )}
{/* ================= TAB ODONTOGRAMA ================= */}

{tab === 3 && (
  <Box
    sx={{
      p: 2,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontWeight: "bold",
        mb: 2,
      }}
    >
      Odontograma
    </Typography>

<div
  id="odontograma-pdf"
  style={{
    background: "#fff",
    padding: 20,
    width: 1200,
  }}
>
  <Odontograma
    id_paciente={id}
  />
</div>
  </Box>
)}
    </CardContent>
  </Paper>
</Box>
      {/* -------------------------------- TABLA DE TURNOS -------------------------------- */}
  
    </>
  );
};

export default FichaPersona;
