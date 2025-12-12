import axios from "axios"



const API = import.meta.env.VITE_API_URL;
const baseUrl = API+'signincl/'






const login= async  (credentials) => {
 console.log('service login',credentials)
  const {data } = await axios.post(baseUrl,credentials)
  if (data ==='Sin Exito'){
   alert(data)}
    return data 
}  
const guardar= async  credentials => {
    const {data } = await axios.post(baseUrl,credentials)
    return data 
} 
export default {login, guardar}
