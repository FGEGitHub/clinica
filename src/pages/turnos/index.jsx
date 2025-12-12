import * as React from 'react';
import  { useEffect, useState } from "react";
import PAcintes from '../../components/usuario/turnos/calendario';
import {nivel} from '../../helpers/herlperlogin'
import { useNavigate } from "react-router-dom";

import BarraLAteral from '../../components/usuario/menuizq'



export default function MenuUsuario2() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null)
  const [] = useState('')

  const [logueado, setLogueado] = useState(true) 

  
  useEffect(() => {
   
    traer()
      
        //servicioUsuario.setToken(user.token)  
       
        
     
    }, [])

/////////////////////////////////////Deslogueo si no es nivel 2
    const traer = async () => {
     const esniv2 =  await nivel(1) //helper de verificacion
     
     if (esniv2){
      setLogueado(true)
     }else{
      navigate('/login')
     }

    }

    

  return (
    <div> 
    { logueado ? <div> 
      
    <BarraLAteral>
<PAcintes/>
 </BarraLAteral>
 </div>   :<div></div> } </div>
  );
}
