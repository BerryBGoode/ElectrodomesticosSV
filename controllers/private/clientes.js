import {cargarTabla, enviarDatos, checkProceso} from './usuarios.js';

const PROCESO = document.getElementById('proceso')
const COL = document.querySelectorAll('.tb-switch');
const TABLA = document.getElementById('tbody-cliente');


const getClienteURL = () => {
    const URL = new URLSearchParams(window.location.search);
    const VALUE = URL.get('clienteid');
    return VALUE;
}


document.addEventListener('DOMContentLoaded', async (event) =>{
    event.preventDefault();
    if (location.href.indexOf('agregar') !== -1) {
        checkProceso('registro', 'clientes.html', getClienteURL(), );
    } else {
        cargarTabla('cargarClientes', COL, TABLA, 'agregarcliente.html');
    }
})

