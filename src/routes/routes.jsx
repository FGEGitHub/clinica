
import Menu from '../pages/menu';
import Login from '../pages/login';

import NOtFound from '../pages/notfound';
const Rutas = [
 
    { path: '/', element: <Login /> },


    { path: '/login', element: <Login /> },
	{ path: '*', element: <NOtFound /> },
	{ path: 'menu', element: <Menu /> }


    ];


export default Rutas;