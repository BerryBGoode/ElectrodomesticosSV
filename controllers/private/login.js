import { notificacionURL, request } from "../controller.js";

// api de usuarios
const USUARIO = 'business/private/usuario.php';
// formulario login
const FORM = document.getElementById('login');
const PRIMERUSUARIO = document.getElementById('primer-usuario');
// evento para loggear
// editifica que existe ese elemeto
if (FORM) {
    FORM.addEventListener('submit', async (evt) => {
        evt.preventDefault();
        const DATA = new FormData(FORM);
        const JSON = await request(USUARIO, 'login', DATA);
        if (JSON.status) {
            notificacionURL('success', JSON.msg, false, 'inicio.html');            
        } else {            
            notificacionURL('error', JSON.excep, false);
        }
    })
}
if (PRIMERUSUARIO) {

    PRIMERUSUARIO.addEventListener('submit', async event => {
        event.preventDefault();
        const DATOS = new FormData(PRIMERUSUARIO);
        const JSON = await request(USUARIO, 'primer-usuario', DATOS);
        if (JSON.status) {
            notificacionURL('info', JSON.msg, false, '../private/');
        } else {
            notificacionURL('error', JSON.excep, false);
        }
    })
}
// verificar sí esta en el archivo para crear primer usuario
if (location.href.indexOf('primerusuario') > 0) {
    // login
    document.addEventListener('DOMContentLoaded', async event => {
        event.preventDefault();
        const JSON = await request(USUARIO, 'verificar-usuarios');
        if (JSON.status) {
            notificacionURL('info', JSON.msg, false, 'primerusuario.html');
        }
    })
}
