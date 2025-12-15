import * as React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import servicioFidei from '../../../services/pacientes';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField
} from "@mui/material";


import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton,  TablePagination, Box, Typography
} from '@mui/material';

export default function Ingresos() {
  const navigate = useNavigate();
  const [inscrip, setInscrip] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
const [open, setOpen] = useState(false);
const [nuevoPaciente, setNuevoPaciente] = useState({
  nombre: "",
  apellido: "",
  dni: "",
  fecha_nacimiento: "",
  fecha_ingreso: "",
  telefono: "",
  direccion: ""
});

const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

const handleChangeNuevo = (e) => {
  setNuevoPaciente({
    ...nuevoPaciente,
    [e.target.name]: e.target.value
  });
};

const guardarPaciente = async () => {
  try {
    const rta = await servicioFidei.agregarPersona(nuevoPaciente);
    // rta = { ok: true/false, msg: "...", id? }

    if (!rta.ok) {
      // ❌ DNI existente → NO cerrar modal
      alert(rta.msg);
      return;
    }

    // ✅ Alta correcta
    alert(rta.msg);
    traer(); // actualiza tabla
    handleClose(); // cerrar modal SOLO si ok === true

    // limpia formulario
    setNuevoPaciente({
      nombre: "",
      apellido: "",
      dni: "",
      fecha_nacimiento: "",
      fecha_ingreso: "",
      telefono: "",
      direccion: ""
    });

  } catch (error) {
    console.error("Error al guardar paciente", error);
    alert("Error al guardar paciente");
  }
};
  useEffect(() => {
  
    traer();
  }, []);

  const traer = async () => {
   
    const ins = await servicioFidei.traerpacientes();
    setInscrip(ins);
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
    `${row.nombre} ${row.apellido} ${row.dni}`.toLowerCase().includes(searchTerm)
  );

  const paginatedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box p={2}>
      <Typography variant="h6" gutterBottom>Lista de Pacientes</Typography>

      <TextField
        label="Buscar por nombre, apellido o DNI"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />
<Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={handleOpen}>
  Nuevo Paciente
</Button>
 <Paper sx={{ width: '100%', overflowX: 'auto' }}>
  <TableContainer component={Paper}>
    <Table sx={{ minWidth: 900, tableLayout: 'auto' }}>
           <TableHead>
  <TableRow>
    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#424242', color: 'white' }}>DNI</TableCell>
    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#424242', color: 'white' }}>Apellido</TableCell>
    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#424242', color: 'white' }}>Nombre</TableCell>
    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#424242', color: 'white' }}>Acciones</TableCell>

  
  </TableRow>
</TableHead>

            <TableBody>
              {paginatedRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.dni}</TableCell>
                  <TableCell>{row.apellido}</TableCell>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>
  <Button
    variant="contained"
    color="primary"
    size="small"
    onClick={() => navigate(`/usuario/paciente/${row.id}`)}
  >
    Ver
  </Button>
</TableCell>
               
                </TableRow>
              ))}
              {paginatedRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
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
        />
      </Paper>
    <Dialog open={open} onClose={handleClose} fullWidth>
  <DialogTitle>Nuevo Paciente</DialogTitle>
  <DialogContent dividers>

    <TextField
      margin="dense"
      label="Nombre"
      fullWidth
      name="nombre"
      value={nuevoPaciente.nombre}
      onChange={handleChangeNuevo}
    />

    <TextField
      margin="dense"
      label="Apellido"
      fullWidth
      name="apellido"
      value={nuevoPaciente.apellido}
      onChange={handleChangeNuevo}
    />

    <TextField
      margin="dense"
      label="DNI"
      fullWidth
      name="dni"
      value={nuevoPaciente.dni}
      onChange={handleChangeNuevo}
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
    />

    <TextField
      margin="dense"
      label="Teléfono"
      fullWidth
      name="telefono"
      value={nuevoPaciente.telefono}
      onChange={handleChangeNuevo}
    />

    <TextField
      margin="dense"
      label="Dirección"
      fullWidth
      name="direccion"
      value={nuevoPaciente.direccion}
      onChange={handleChangeNuevo}
    />

  </DialogContent>

  <DialogActions>
    <Button onClick={handleClose}>Cancelar</Button>
    <Button variant="contained" onClick={guardarPaciente}>Guardar</Button>
  </DialogActions>
</Dialog>
</Box>
  );
}
