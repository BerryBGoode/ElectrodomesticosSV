import { cargarTabla, enviarDatos, checkProceso } from './usuarios.js';

const PROCESO = document.getElementById('proceso')
const COL = document.querySelectorAll('.tb-switch');
const TABLA = document.getElementById('tbody-cliente');
const FORM = document.getElementById('form-cliente');

const getClienteURL = () => {
    const URL = new URLSearchParams(window.location.search);
    const VALUE = URL.get('clienteid');
    return VALUE;
}


document.addEventListener('DOMContentLoaded', async (event) => {
    event.preventDefault();
    if (location.href.indexOf('agregar') !== -1) {
        await checkProceso('registro', 'clientes.html', getClienteURL(), PROCESO);
    } else {
        await cargarTabla('cargarClientes', COL, TABLA, 'agregarcliente.html');
    }
})

if (FORM) {
    FORM.addEventListener('submit', async (event) => {
        event.preventDefault();
        await enviarDatos('crearCliente', 'clientes.html', FORM);
    })
}