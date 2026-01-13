import * as React from 'react';
import  { useEffect, useState } from "react";
import PAcintes from '../../components/publico/calendario/componente';
import {nivel} from '../../helpers/herlperlogin'
import { useNavigate } from "react-router-dom";




export default function MenuUsuario2() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null)
  const [] = useState('')

  const [logueado, setLogueado] = useState(true) 

  

    

  return (
    <div> 
    <PAcintes/> </div>
  );
}
