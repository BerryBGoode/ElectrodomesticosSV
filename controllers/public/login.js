// importa modulos
import { request } from "../controller.js";

// archivo donde hacer peticiones
const USUARIO = 'business/public/usuario.php';
// formulario para iniciar sesión
const FORMULARIO = document.getElementById('login');
// arreglo con datos del toast
const TOAST = new bootstrap.Toast('#toast-e');

FORMULARIO.addEventListener('submit', async event => {
    event.preventDefault();
    let datos = new FormData(FORMULARIO);
    const JSON = await request(USUARIO, 'login', datos);
    if (JSON.status) {
        document.getElementById('toast-body-e').innerText = JSON.msg;
        TOAST.show();
        setTimeout(() => {
            location.href = '../../views/public/';
        }, 2500);
    }else{        
        document.getElementById('toast-body-e').innerText = JSON.excep;
        TOAST.show();
    }
})