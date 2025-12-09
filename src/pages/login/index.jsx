import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import loginService from '../../services/login'
import {
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Avatar,
  Link
} from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import FormControlLabel from '@mui/material/FormControlLabel';
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css'
import servicioUsuario from '../../services/usuarios'
import Checkbox from '@mui/material/Checkbox';

import marcas from '../../Assets/imagenlogin.jpg'



const Login = () => {

  const [loginVisible, setLoginvisible] = useState(false)
  const [usuario, setUsuario] = useState({
    cuil_cuit: "",
    password: "",
  });
  const [user, setUser] = useState(null)


  const [loading, setLoading] = useState(false);
  //const [editing, setEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      
      switch (user.nivel) {
        case 1:
          navigate('/menu')
          break;
       
        default:
          
          break;
      }
    }
  }, [])


  const hanleLogout = () => {
    setUser(null)
    servicioUsuario.setToken(user.token)
    window.localStorage.removeItem('loggedNoteAppUser')
  }

  const loginSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {

      const user = await loginService.login({
        usuario: usuario.usuario,
        password: usuario.password
      })

      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      )

      servicioUsuario.setToken(user.token)

      setUser(user)

      setLoading(false);

      
      switch(user.nivel){
        case '1': navigate('/menu')
        window.location.reload(true);
          break;
        

      }
    } catch (error) {
      console.error(error);
      console.log('error credenciales')
      window.location.reload(true);
      alert('error credenciales')
    
    }

  };


  const handleChange = (e) =>
    setUsuario({ ...usuario, [e.target.name]: e.target.value });



  const paperStyle = { padding: 20, height: '70vh', width: 280, margin: "20px auto" }
  const avatarStyle = { backgroundColor: '#2196f3' }
  const btnstyle = { margin: '8px 0' }

const LoginReturn = () => (
  <Grid container component="main" sx={{ height: '100vh' }}>
    
    {/* Columna izquierda con fondo y logo 
    'linear-gradient(to bottom right,hsl(209, 100%, 9%),rgb(0, 34, 66))'*/}
    <Grid
      item
      xs={false}
      md={6}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4,
        textAlign: 'center',
        background: '#002D57',
        color: 'white',
      }}
    >
      <Box component="img" src={marcas} alt="Santa Catalina Logo" 
      sx={{ width: 700, maxWidth: '100%' }} />
      
    </Grid>

    {/* Columna derecha con formulario dentro de una Card */}
    <Grid item xs={12} md={6}  square 
    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background:'#002D57'}}>
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          mx: 4,
        }}
      >
        <Card elevation={8} sx={{ p: 4, backgroundColor: '#ffffff', borderRadius: 3}}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: '#002d57' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              BIENVENIDO
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, mb: 3, textAlign: 'center' }}>
             Iniciar Sesión
            </Typography>
          </Box>

          <Box component="form" onSubmit={loginSubmit} noValidate>
            <TextField
              fullWidth
              margin="normal"
              label="usuario"
              name="usuario"
              value={usuario.usuario}
              onChange={handleChange}
              variant="outlined"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Contraseña"
              type="password"
              name="password"
              value={usuario.password}
              onChange={handleChange}
              variant="outlined"
            />
            <Link href="#" variant="body2">
                 {/*  <RecuperoC /> */}
                </Link>
            <FormControlLabel
              control={<Checkbox color="primary" />}
              label="Recordarme"
              sx={{ mt: 1 }}
            />

            <Button
              type="submit"
              
              variant="contained"
             
              sx={{ background:'#148D8D', mt: 2, mb: 2, ml:'auto', display: 'block'}}
              
            >
              {loading ? (
                <CircularProgress color="#002d57" size={25} />
              ) : (
                "Ingresar"
              )}
            </Button>

            <Grid container justifyContent="space-between">
             
                <Typography variant="body2">
                  ¿No estás registrado?{/*  <Registro /> */}
                </Typography>
              
              
            </Grid>
          </Box>
        </Card>
      </Box>
    </Grid>
  </Grid>
);

/*   const onFinish = (values) => {
      enviarDatos(urll, values)
    }
  
  
  
  
   */
  return (

    <>
    
  

  
        {LoginReturn()}



        

    </>
  )
}

export default Login;