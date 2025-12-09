
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import useUser from '../hooks/useUser'
import MenuIcon from "@mui/icons-material/Menu";
const pages = [
  "Inicio",
  "Nosotros",

  "Contacto"];
const pagesdeslogueado = [
  "Iniciar sesion ",
  "Nosotros",
  
  "Contacto",
  ]

const DrawerNav = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [nombre, setNombre] = useState(null)
  const [notificacioness, setNotificacioness] = useState();
  const usuario = useUser().userContext

  const navigate = useNavigate();


  const handleClick = () => {
    navigate("/login");
  };
  const iraMenu = () => {
    navigate("/usuario/menu");
  };
  const irNosotros = () => {
    navigate("/usuario/nosotros");
  }
  const irContacto = () => {
    navigate("/usuario/contacto");
  }
  const irAyuda = () => {
    navigate("/usuario/menu");
  }
  const nomb = () => {
    navigate("/usuario/datosPers");
  };
  const notif = () => {
    navigate("/usuario/notificaciones");
  };
  const hanleLogout = () => {
    /* console.log('click')
     setUser(null)
     servicioUsuario.setToken(user.token) */

    window.localStorage.removeItem('loggedNoteAppUser')
    navigate('/login')
    // window.location.reload(true);
  }
  function CutomButtonsRenderer(dataIndex, rowIndex, data, onClick) {
    switch (rowIndex) {
      case 0:
        iraMenu()
        break;

      case 1:
        irNosotros()
        break;
      case 2:
        irAyuda()
        break;
      case 2:
        irContacto()
        break;
        case 3:
          notif()
          break;
          case 4:
            hanleLogout()
            break;
          

    }
  }
    function CutomButtonsRendererdesloqueado(dataIndex, rowIndex, data, onClick) {
      switch (rowIndex) {
        case 0:
          handleClick()
          break;

        case 1:
          irNosotros()
          break;
        case 2:
          irAyuda()
          break;
        case 2:
          irContacto()
          break;
    


      }
    }

    const inicio = () => {
      navigate("/usuario/menu");

    }

    const notificaciones = () => {
      navigate("/usuario/notificaciones");
    }
    return (
      <React.Fragment>
        <Drawer
          anchor="right"
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >

          {usuario ? <>
            <List>
              {pages.map((page, index) => (
                <ListItemButton key={index}>
                  <ListItemIcon>
                    <ListItemText onClick={() => CutomButtonsRenderer(page, index)} >  {page}  </ListItemText>
                  </ListItemIcon>
                </ListItemButton>
              ))} </List>
          </> : <>
            <List>
              {pagesdeslogueado.map((page, index) => (
                <ListItemButton key={index}>
                  <ListItemIcon>
                    <ListItemText onClick={() => CutomButtonsRendererdesloqueado(page, index)} >  {page}  </ListItemText>
                  </ListItemIcon>
                </ListItemButton>
              ))} </List></>
          }



        </Drawer>
        <IconButton
          sx={{ color: "white", marginLeft: "auto" }}
          onClick={() => setOpenDrawer(!openDrawer)}
        >
          <MenuIcon color="white" />
        </IconButton>
      </React.Fragment>
    );
  };

export default DrawerNav;