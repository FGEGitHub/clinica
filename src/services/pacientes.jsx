import axios from "axios"


import url from "./url";

const baseUrl = url.database+'clinica/'
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

const agregarPersona = async (datos)=> {
    const {data } = await axios.post(baseUrl + 'agregarPersona' ,datos,config)
    return data 
} 


export default { traerpacientes , agregarPersona }