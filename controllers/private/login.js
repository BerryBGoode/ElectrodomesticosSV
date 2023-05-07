import { notificacionURL, request } from "../controller.js";

// api de usuarios
const USUARIO = 'business/private/usuario.php';
// formulario login
const FORM = document.getElementById('login');

// evento para loggear
FORM.addEventListener('submit', async (evt) =>{
    evt.preventDefault();
    const DATA = new FormData(FORM);
    const JSON = await request(USUARIO, 'login', DATA);
    if (JSON.status) {
        notificacionURL('success',JSON.msg, false, 'inicio.html');
        console.log(JSON)
        console.log(JSON.msg)
    } else {
        console.log(JSON)
        console.log(JSON.excep)
        notificacionURL('error', JSON.excep, false);
    }
})