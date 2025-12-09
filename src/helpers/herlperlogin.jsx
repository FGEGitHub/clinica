import { useNavigate } from "react-router-dom";


//const helpers1 = {}
export const nivel = async (nivell) => {
    const loggedUserJSON = await window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      try {
      const user = JSON.parse(loggedUserJSON)
      
      if (user.nivel == nivell){
       return true
      }else{
        alert('Debe volver a iniciar sesion ')
        window.localStorage.removeItem('loggedNoteAppUser')   
      }
    } catch (error) {
      console.log(1)
      window.localStorage.removeItem('loggedNoteAppUser')
     return false
    }
      //servicioUsuario.setToken(user.token)  
    }else{
      return false
     
    }
};


/* 

helpers1.nivel2 = async () => {// encriptar 

    const loggedUserJSON = await window.localStorage.getItem('loggedNoteAppUser')
      if (loggedUserJSON) {
        try {
        const user = JSON.parse(loggedUserJSON)
        console.log(2)
        if (user.nivel === 2){
         return true
        }else{
          alert('Debe volver a iniciar sesion ')
          window.localStorage.removeItem('loggedNoteAppUser')   
        }
      } catch (error) {
        console.log(1)
        window.localStorage.removeItem('loggedNoteAppUser')
       return false
      }
        //servicioUsuario.setToken(user.token)  
      }else{
        return false
       
      }
      
} */
