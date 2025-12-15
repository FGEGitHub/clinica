
import Menu from '../pages/menu';
import Login from '../pages/login';
import Pacientes from '../pages/pacientes';
import Paciente from '../pages/paciente';
import Turnos from '../pages/turnos';
import Turno from '../pages/turno';

import NOtFound from '../pages/notfound';
const Rutas = [
 
    { path: '/', element: <Login /> },


    { path: '/login', element: <Login /> },
	{ path: '*', element: <NOtFound /> },
	{ path: '/menu', element: <Menu /> },
    { path: '/usuario/pacientes', element: <Pacientes /> },
    { path: '/usuario/paciente/:id', element: <Paciente /> },
        { path: '/usuario/turnos', element: <Turnos /> },

        { path: '/usuario/turno/:id', element: <Turno /> },
    ];


export default Rutas;