import axios from "axios"

import url from "./url";


const baseUrl = url.database+'signincl/'
//const  baseUrl ='https://api.santacatalinafideicomiso.com/signinn'
//const  baseUrl ='http://localhost:4000/signinn'






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
