// importa modulos
import { request, notificacionURL } from "../controller.js";

// archivo donde hacer peticiones
const USUARIO = 'business/public/usuario.php';
// formulario para iniciar sesión
const FORMULARIO = document.getElementById('login');
// arreglo con datos del toast
const TOAST = new bootstrap.Toast('#toast-e');
// formulario para crear usuario cliente
const CLIENTE = document.getElementById('crear-cuenta');

// validar sí existe formulario de login en el html
if (FORMULARIO) {    
    FORMULARIO.addEventListener('submit', async event => {
        event.preventDefault();
        let datos = new FormData(FORMULARIO);
        const JSON = await request(USUARIO, 'login', datos);
        if (JSON.status) {
            document.getElementById('toast-body-e').innerText = JSON.msg;
            TOAST.show();
            setTimeout(() => {
                location.href = '../../views/public/';
            }, 2000);
        }else{        
            document.getElementById('toast-body-e').innerText = JSON.excep;
            TOAST.show();
        }
    })
}
// validar sí existe formulario crear cuenta en ele html
if (CLIENTE) {
    CLIENTE.addEventListener('submit', async event => {
        event.preventDefault();
        // obtener los datos del formulario
        const DATOS = new FormData(CLIENTE);
        const JSON = await request(USUARIO, 'crearCuentaCliente', DATOS);
        if (JSON.status) {
            notificacionURL('success', JSON.msg +', ahora inicia sesión con esos datos', true, 'login.html');
        }else{
            notificacionURL('error', JSON.excep, false);
        }
    })
}