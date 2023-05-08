import { request, notificacionURL, notificacionAccion, cargarSelect } from '../controller.js';

const USUARIO = 'business/private/usuario.php';
const CANCELAR = document.getElementById('cancelar');
const PROCESO = document.getElementById('proceso');
const FORM = document.getElementById('form-usuario');
const SWITCH = document.getElementById('estado');

let accion;
let estado;
let contenedorswitch = document.querySelector('.switch');


if (CANCELAR) {
    CANCELAR.addEventListener('click', () => {
        location.href = 'usuarios.html';
    })
}

document.addEventListener('DOMContentLoaded', async (event) => {
    event.preventDefault();
    // verificar sí la página es de agregar
    // obteniendo la url actual, y verificar sí contiene la palabra agregar
    // que es la que tiene una vista como estandar
    // sí el resultado de buscar ese texto no es -1 
    // es porque existe 
    if (location.href.indexOf('agregar') !== -1) {
        // verificar el proceso de actualizar o eliminar
    }else{
        // cargar tabla
    }
})

if (FORM) {
    
    FORM.addEventListener('submit', async (event) => {
        event.preventDefault();
        document.getElementById('idusuario').value ? accion = 'actualizar' : accion = 'crear';
        const DATOS = new FormData(FORM);
        // verificar sí el switch está checkeado
        const JSON = await request(USUARIO, accion, DATOS);
        if (JSON.status) {
            FORM.reset();
            notificacionURL('success', JSON.msg, true, 'usuarios.html');
        } else {
            notificacionURL('error', JSON.excep, false);
        }
    })
}