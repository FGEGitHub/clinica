import {createContext} from "react"

const UserContext = createContext ({
    usuario: null,
    token: null,
    nivel: null,

})


export default  UserContext; 