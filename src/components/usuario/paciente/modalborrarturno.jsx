import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper
} from "@mui/material";
import servicioDtc from "../../../services/pacientes";

const BorrarTurno = ({ id_turno, traer }) => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEliminar = async () => {
    try {
      const r = await servicioDtc.borrarturno({ id_turno });

      alert(r.msg || "Turno eliminado");
      traer();
      setOpen(false);

    } catch (error) {
      console.error(error);
      alert("Error al eliminar turno");
    }
  };

  return (
    <>
      <Button
      variant="outlined"
                                sx={{ color: "black", borderColor: "red", fontSize: "0.70rem", }}
  
        onClick={handleClickOpen}
      >
        Borrar
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <Paper sx={{ p: 2 }}>
          <DialogTitle>Eliminar Turno</DialogTitle>

          <DialogContent>
            <Typography>
              ¿Seguro que deseas <strong>eliminar este turno</strong>?  
              Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} variant="outlined">
              Cancelar
            </Button>

            <Button
              onClick={handleEliminar}
              variant="contained"
              color="error"
            >
              Eliminar
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </>
  );
};

export default BorrarTurno;
