
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import servicioFidei from "../../../services/pacientes";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
  InputAdornment,
  Fab,
} from "@mui/material";

import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

const pacienteInicial = {
  nombre: "",
  apellido: "",
  dni: "",
  fecha_nacimiento: "",
  fecha_ingreso: "",
  telefono: "",
  direccion: "",
};

export default function Ingresos({ darkMode, colors = {} }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Si no se recibe darkMode, utiliza el modo del ThemeProvider de MUI.
  const modoOscuro = darkMode ?? theme.palette.mode === "dark";

  const paletaBase = modoOscuro
    ? {
        fondo: "#242426",
        superficie: "#2b2b2e",
        encabezado: "#343438",
        texto: "#f4f4f5",
        secundario: "#a1a1aa",
        borde: "#36363a",
        hover: "#36363b",
        input: "#242426",
        textoInput: "#f4f4f5",
        primario: "#60a5fa",
        textoBoton: "#ffffff",
      }
    : {
        fondo: "#ffffff",
        superficie: "#ffffff",
        encabezado: "#f1f5f9",
        texto: "#222222",
        secundario: "#64748b",
        borde: "#e2e8f0",
        hover: "#f8fafc",
        input: "#ffffff",
        textoInput: "#222222",
        primario: "#2563eb",
        textoBoton: "#ffffff",
      };

  const c = { ...paletaBase, ...colors };

  const [inscrip, setInscrip] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);

  const [nuevoPaciente, setNuevoPaciente] = useState(pacienteInicial);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChangeNuevo = (e) => {
    setNuevoPaciente((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const traer = async () => {
    try {
      const loggedUserJSON = window.localStorage.getItem(
        "loggedNoteAppUser"
      );

      if (loggedUserJSON) {
        const usuario = JSON.parse(loggedUserJSON);
        const ins = await servicioFidei.traerpacientes(usuario.id);
        setInscrip(Array.isArray(ins) ? ins : []);
      }
    } catch (error) {
      console.error("Error al traer pacientes:", error);
      setInscrip([]);
    }
  };

  useEffect(() => {
    traer();
  }, []);

  const guardarPaciente = async () => {
    try {
      const rta = await servicioFidei.agregarPersona(nuevoPaciente);

      if (!rta.ok) {
        alert(rta.msg);
        return;
      }

      alert(rta.msg);
      await traer();

      handleClose();
      setNuevoPaciente({ ...pacienteInicial });
    } catch (error) {
      console.error("Error al guardar paciente", error);
      alert("Error al guardar paciente");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPage(0);
  };

  const filteredRows = inscrip.filter((row) =>
    `${row.nombre || ""} ${row.apellido || ""} ${row.dni || ""}`
      .toLowerCase()
      .includes(searchTerm)
  );

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const estilosInput = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: c.input,
      color: c.textoInput,
      borderRadius: 2,

      "& fieldset": {
        borderColor: c.borde,
      },

      "&:hover fieldset": {
        borderColor: c.secundario,
      },

      "&.Mui-focused fieldset": {
        borderColor: c.primario,
      },
    },

    "& .MuiInputLabel-root": {
      color: c.secundario,
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: c.primario,
    },

    "& .MuiInputBase-input": {
      color: c.textoInput,
    },

    "& .MuiInputBase-input::placeholder": {
      color: c.secundario,
      opacity: 1,
    },

    "& .MuiSvgIcon-root": {
      color: c.secundario,
    },
  };

  const estilosPaper = {
    backgroundColor: c.superficie,
    color: c.texto,
    border: `1px solid ${c.borde}`,
    borderRadius: 2,
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        p: { xs: 1, sm: 2 },
        color: c.texto,
        overflowX: "hidden",
      }}
    >
      {/* ENCABEZADO */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          px: { xs: 2, md: 2.5 },
          py: { xs: 2, md: 2.25 },
          backgroundColor: c.fondo,
          boxShadow: modoOscuro
            ? "0 8px 25px rgba(0,0,0,0.25)"
            : "0 4px 18px rgba(0,0,0,0.05)",
          border: `1px solid ${c.borde}`,
          color: c.texto,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                flexShrink: 0,
                borderRadius: 2,
                background: "rgba(48, 11, 179, 1)",
                border: "1px solid rgba(255,255,255,0.22)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <PeopleRoundedIcon sx={{ color: "#fff" }} />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: 18,
                  lineHeight: 1.1,
                  color: c.texto,
                }}
              >
                Pacientes
              </Typography>

              <Typography
                sx={{
                  color: c.secundario,
                  fontSize: 13,
                }}
              >
                Listado y acceso rápido a detalle / edición
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1.25,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Chip
              label={`Cantidad: ${inscrip.length}`}
              sx={{
                color: c.texto,
                fontWeight: 900,
                background: modoOscuro
                  ? "rgba(255,255,255,0.14)"
                  : "#f1f5f9",
                border: `1px solid ${c.borde}`,
                px: 0.75,
                borderRadius: 999,
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* BUSCADOR */}
      <TextField
        placeholder="Buscar paciente por nombre, apellido o DNI..."
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: c.secundario }} />
            </InputAdornment>
          ),
        }}
        sx={{
          mt: 2,
          mb: 2,
          ...estilosInput,
        }}
      />

      {/* LISTADO MOBILE */}
      {isMobile ? (
        <Box>
          {paginatedRows.map((row) => (
            <Paper
              key={row.id}
              elevation={0}
              sx={{
                ...estilosPaper,
                p: 2,
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1.5,
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: 16,
                    color: c.texto,
                  }}
                >
                  {row.apellido}, {row.nombre}
                </Typography>

                <Chip
                  label="Paciente"
                  size="small"
                  sx={{
                    backgroundColor: modoOscuro ? "#343438" : "#f1f5f9",
                    color: c.secundario,
                  }}
                />
              </Box>

              <Typography
                variant="body2"
                sx={{ color: c.secundario, mb: 1.5 }}
              >
                <b style={{ color: c.texto }}>DNI:</b> {row.dni}
              </Typography>

              <Button
                fullWidth
                variant="outlined"
                onClick={() =>
                  navigate(`/usuario/paciente/${row.id}`)
                }
                sx={{
                  mt: 0.5,
                  color: c.primario,
                  borderColor: c.primario,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,

                  "&:hover": {
                    backgroundColor: modoOscuro
                      ? "rgba(59,130,246,0.12)"
                      : "rgba(37,99,235,0.08)",
                    borderColor: c.primario,
                  },
                }}
              >
                Ver paciente
              </Button>
            </Paper>
          ))}

          {paginatedRows.length === 0 && (
            <Paper
              elevation={0}
              sx={{
                ...estilosPaper,
                p: 3,
                textAlign: "center",
              }}
            >
              <Typography sx={{ color: c.secundario }}>
                No se encontraron pacientes.
              </Typography>
            </Paper>
          )}
        </Box>
      ) : (
        /* TABLA DESKTOP */
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            overflow: "hidden",
            backgroundColor: c.fondo,
            border: `1px solid ${c.borde}`,
            borderRadius: 2,
          }}
        >
          <TableContainer>
            <Table
              sx={{
                width: "100%",
                tableLayout: "fixed",

                "& .MuiTableCell-root": {
                  borderBottom: `1px solid ${c.borde}`,
                  color: c.texto,
                },
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: c.encabezado,
                  }}
                >
                  {["DNI", "Apellido", "Nombre", "Acciones"].map(
                    (titulo) => (
                      <TableCell
                        key={titulo}
                        sx={{
                          fontWeight: 800,
                          color: `${c.texto} !important`,
                        }}
                      >
                        {titulo}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      backgroundColor: c.superficie,
                      transition: "background-color 0.2s ease",

                      "&:hover": {
                        backgroundColor: c.hover,
                      },
                    }}
                  >
                    <TableCell>{row.dni}</TableCell>
                    <TableCell>{row.apellido}</TableCell>
                    <TableCell>{row.nombre}</TableCell>

                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          navigate(`/usuario/paciente/${row.id}`)
                        }
                        sx={{
                          color: c.primario,
                          borderColor: c.primario,
                          fontSize: "0.75rem",
                          borderRadius: 1.5,
                          textTransform: "none",

                          "&:hover": {
                            backgroundColor: modoOscuro
                              ? "rgba(59,130,246,0.12)"
                              : "rgba(37,99,235,0.08)",
                            borderColor: c.primario,
                          },
                        }}
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {paginatedRows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{
                        color: c.secundario,
                        py: 4,
                      }}
                    >
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredRows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
            sx={{
              color: c.texto,
              borderTop: `1px solid ${c.borde}`,

              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                color: c.secundario,
              },

              "& .MuiTablePagination-select": {
                color: c.texto,
              },

              "& .MuiTablePagination-actions button": {
                color: c.secundario,
              },

              "& .MuiTablePagination-actions button:hover": {
                backgroundColor: c.hover,
              },

              "& .MuiSvgIcon-root": {
                color: c.secundario,
              },
            }}
          />
        </Paper>
      )}

      {/* PAGINACIÓN MOBILE */}
      {isMobile && (
        <Paper
          elevation={0}
          sx={{
            ...estilosPaper,
            mt: 1,
            overflow: "hidden",
          }}
        >
          <TablePagination
            component="div"
            count={filteredRows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
            sx={{
              color: c.texto,
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                color: c.secundario,
              },
              "& .MuiTablePagination-select": {
                color: c.texto,
              },
              "& .MuiTablePagination-actions button": {
                color: c.secundario,
              },
            }}
          />
        </Paper>
      )}

      {/* BOTÓN FLOTANTE */}
      <Fab
        color="primary"
        onClick={() => navigate("/usuario/pacientenuevo")}
        aria-label="Agregar paciente"
        sx={{
          position: "fixed",
          bottom: { xs: 75, md: 30 },
          right: { xs: 16, md: 30 },
          zIndex: 1200,
          boxShadow: 6,
        }}
      >
        <AddIcon />
      </Fab>

      {/* MODAL NUEVO PACIENTE */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        fullScreen={false}
        PaperProps={{
          sx: {
            backgroundColor: c.fondo,
            color: c.texto,
            border: `1px solid ${c.borde}`,
            borderRadius: { xs: 2, sm: 3 },
            backgroundImage: "none",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            borderBottom: `1px solid ${c.borde}`,
          }}
        >
          Nuevo Paciente
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            borderColor: c.borde,
            pt: 2,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
              },
              gap: 1.5,
            }}
          >
            <TextField
              margin="dense"
              label="Nombre"
              fullWidth
              name="nombre"
              value={nuevoPaciente.nombre}
              onChange={handleChangeNuevo}
              sx={estilosInput}
            />

            <TextField
              margin="dense"
              label="Apellido"
              fullWidth
              name="apellido"
              value={nuevoPaciente.apellido}
              onChange={handleChangeNuevo}
              sx={estilosInput}
            />

            <TextField
              margin="dense"
              label="DNI"
              fullWidth
              name="dni"
              value={nuevoPaciente.dni}
              onChange={handleChangeNuevo}
              sx={estilosInput}
            />

            <TextField
              margin="dense"
              type="date"
              label="Fecha nacimiento"
              fullWidth
              name="fecha_nacimiento"
              InputLabelProps={{ shrink: true }}
              value={nuevoPaciente.fecha_nacimiento}
              onChange={handleChangeNuevo}
              sx={estilosInput}
            />

            <TextField
              margin="dense"
              type="date"
              label="Fecha ingreso"
              fullWidth
              name="fecha_ingreso"
              InputLabelProps={{ shrink: true }}
              value={nuevoPaciente.fecha_ingreso}
              onChange={handleChangeNuevo}
              sx={estilosInput}
            />

            <TextField
              margin="dense"
              label="Teléfono"
              fullWidth
              name="telefono"
              value={nuevoPaciente.telefono}
              onChange={handleChangeNuevo}
              sx={estilosInput}
            />

            <TextField
              margin="dense"
              label="Dirección"
              fullWidth
              name="direccion"
              value={nuevoPaciente.direccion}
              onChange={handleChangeNuevo}
              sx={{
                ...estilosInput,
                gridColumn: { xs: "auto", sm: "1 / -1" },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            borderTop: `1px solid ${c.borde}`,
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              color: c.secundario,
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={guardarPaciente}
            sx={{
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
