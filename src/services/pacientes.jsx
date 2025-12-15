import axios from "axios"



const API = import.meta.env.VITE_API_URL;

const baseUrl = API+'clinica/'
let token = null

const setToken = newToken => {

  token = `Bearer ${newToken}`
}

const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')

let config = ''
if (loggedUserJSON) {

    try {
        const userContext = JSON.parse(loggedUserJSON)
        config = {
           headers:{
               Authorization:`Bearer ${userContext.token}`
           }
       }
    } catch (error) {
          window.localStorage.removeItem('loggedNoteAppUser')
     
    }
   

    
}else{
     config = {
        headers:{
            Authorization:`Bearer `
        }
    }
}


const traerpacientes = async () => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.get(baseUrl + 'traerpacientes/' ,config)
  return data

}

const traerturnos = async () => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.get(baseUrl + 'traerturnos/' ,config)
  return data

}
const datospaciente = async (id) => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.get(baseUrl + 'datospaciente/'+id ,config)
  return data

}

const borrarpaciente = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'borrarpaciente' ,datos,config)
    return data 
} 



const agregarPersona = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'agregarPersona' ,datos,config)
    return data 
} 

const crearturno = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'crearturno' ,datos,config)
    return data 
} 


const modificarusuario = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'modificarusuario' ,datos,config)
    return data 
} 
const borrarturno = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'borrarturno' ,datos,config)
    return data 
} 


export default {modificarusuario,traerturnos, borrarturno, crearturno, traerpacientes , agregarPersona , datospaciente, borrarpaciente}