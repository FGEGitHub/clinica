import * as React from 'react';
import { useParams } from "react-router-dom"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import servicioDtc from '../../../services/pacientes'
import { useNavigate } from "react-router-dom";
import { Paper } from '@mui/material';

import Box from '@mui/material/Box';

export default function Clasenueva(props) {
    let params = useParams()
    let id = params.id
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const [form, setForm] = useState({ id_curso: id })
    const handleChange = (e) => {
        console.log(form)
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleDeterminar = async (event) => {
        event.preventDefault();
        try {

         const respuesta=  await servicioDtc.borrarpaciente({id:props.id})
         alert(respuesta)
         if(respuesta=="Usuario borrado"){
           navigate('/pacientes')
         }



        } catch (error) {
            console.error(error);
            console.log('Error algo sucedio')


        }
        props.traer()

        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);

    };

    return (
        <div>


            <Button variant="contained"  color="error" onClick={handleClickOpen} /* style={{ width: '25%' }} */ >
            Borrar Usuario
            </Button>
            <Dialog open={open} onClose={handleClose}>

                <DialogTitle>Borrar Usuario</DialogTitle>
                <Paper
                    sx={{
                        cursor: 'pointer',
                        background: '#fafafa',
                        color: '#bdbdbd',
                        border: '1px dashed #ccc',
                        '&:hover': { border: '1px solid #ccc' },
                    }}
                >
                    <DialogContent>
                        <DialogContentText>
                           Seguro que quieres borrar al usuario?
                         
                        </DialogContentText>
                      

                            <DialogActions>
                       <Button variant="contained" color="error" onClick={handleDeterminar}>si</Button>
                                <Button variant="outlined" color="error" style={{ marginLeft: "auto" }} onClick={handleClose}>Cancelar</Button>

                            </DialogActions>
                      


                    </DialogContent>

                </Paper>

            </Dialog>

        </div>
    );
}