import axios from "axios"


const API = import.meta.env.VITE_API_URL;


const baseUrl = API+'clinica/'
//const baseUrl = 'http://localhost:4000/'


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
const usuarios = async () => {

  const config = {
    headers: {
      Authorization: token
    }
  }//ver 
  const request = await axios.get(baseUrl + 'prueba', config)
  let dataa = request.data
  console.log('hola')

  return dataa

}


const registro = async (datos) => {
 



  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.post(baseUrl + 'signupp', datos)

  alert(data)


}
const traerusuario = async (cuil_cuit) => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.get(baseUrl + 'traerusuario/' + cuil_cuit,config)
  return data

}

const recupero = async (datos) => {


  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.post(baseUrl + 'recupero', datos)
  return data

}
const recuperar = async (datos) => {

  // const data = await axios.post('http://localhost:4000/signupp', datos)
  const { data } = await axios.post(baseUrl + 'recuperoo', datos)
  return data

}
export default {recupero,recuperar, usuarios, setToken, registro, traerusuario }
