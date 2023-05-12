import { cargarTabla, enviarDatos, checkProceso } from './usuarios.js';
import { notificacionURL, request } from '../controller.js';

const PROCESO = document.getElementById('proceso')
const COL = document.querySelectorAll('.tb-switch');
const TABLA = document.getElementById('tbody-cliente');
const FORM = document.getElementById('form-cliente');
const SEARCH = document.getElementById('buscador');
const CLIENTE = 'business/private/usuario.php';

const getClienteURL = () => {
    const URL = new URLSearchParams(window.location.search);
    const VALUE = URL.get('clienteid');
    return VALUE;
}


document.addEventListener('DOMContentLoaded', async (event) => {
    event.preventDefault();
    // verificar sí el proceso es agregar 'agregarcliente'
    if (location.href.indexOf('agregar') !== -1) {
        await checkProceso('registro', 'clientes.html', getClienteURL(), PROCESO);
    } else {
        // sino el proceso es cargar 'clientes'
        await cargarTabla('cargarClientes', COL, TABLA, 'agregarcliente.html');
    }
})

if (FORM) {
    FORM.addEventListener('submit', async (event) => {
        event.preventDefault();
        // acción para registrar cliente
        await enviarDatos('crearCliente', 'clientes.html', FORM);
    })
}

const buscadorCliente = async event => {
    if (TABLA === document.getElementById('tbody-cliente') && TABLA) {
        event.preventDefault();
        const JSON = await request(CLIENTE, 'cargarClientes');
        if (!JSON.status) {
            notificacionURL('error', JSON.excep, false);
        } else {
            TABLA.innerHTML = ``;
            let buscar = document.getElementById('input-buscar').value.toLowerCase();
            if (buscar === '' || buscar === ' ') {
                TABLA.innerHTML = ``;
                await cargarTabla('cargarClientes', COL, TABLA, 'agregarcliente.html');
            } else {
                TABLA.innerHTML = ``;
                for (let clientes of JSON.data) {
                    let usuario = clientes.nombreusuario.toLowerCase();
                    let nombres = clientes.nombre.toLowerCase();
                    let apellidos = clientes.apellido.toLowerCase();
                    let correo = clientes.correo.toLowerCase();
                    let direccion = clientes.direccion.toLowerCase();
                    if (usuario.indexOf(buscar) !== -1 || nombres.indexOf(buscar) !== -1
                        || apellidos.indexOf(buscar) !== -1 || correo.indexOf(buscar) !== -1
                        || direccion.indexOf(buscar) !== -1) {
                        TABLA.innerHTML += `<tr>
                            <td>${clientes.nombreusuario}</td>
                            <td>${clientes.nombre}</td>
                            <td>${clientes.apellido}</td>
                            <td>${clientes.correo}</td>
                            <td class="tb-switch">
                                ${(clientes.estado === 1) ?
                                COL.innerHTML = `<div class="form-check form-switch"> 
                                        <input class="form-check-input estado" name="estado" id="estado" type="checkbox" id="estado" checked> 
                                    </div>`
                                :
                                COL.innerHTML = `<div class="form-check form-switch"> 
                                        <input class="form-check-input estado" name="estado" id="estado" type="checkbox" id="estado"> 
                                    </div>`
                            }
                            </td>
                            <td class="buttons-tb">
                                <form action="agregarcliente.html" method="get" class="form-button">
                                    <!-- boton para actualizar -->                        
                                        <button type="submit" class="btn btn-secondary actualizar" data-bs-toggle="modal" data-bs-target="#Modal" value="${clientes.idusuario}">Actualizar</button>
                                        <input type="number" name="usuarioid" class="hide" id="productoid" value="${clientes.idusuario}">                        
                                </form>
                                    <!-- boton para eliminar -->
                                <button class="btn btn-danger eliminar" value="${clientes.idusuario}">Eliminar</button>
                            </td>
                        </tr>`;
                    }
                }
                const ACTUALIZAR = document.getElementsByClassName('actualizar');

                // obtener todos los switches de la tabla
                const ESTADO = document.getElementsByClassName('estado');
                for (let index = 0; index < ESTADO.length; index++) {
                    ESTADO[index].addEventListener('change', async (event) => {
                        event.preventDefault();
                        // instancia de la clase FormData
                        const DATOS = new FormData;
                        // adjuntar usuario a actualizar
                        DATOS.append('idusuario', ACTUALIZAR[index].value);
                        // verificar valor del switch
                        if (ESTADO[index].checked) {
                            estado = 1;
                        } else {
                            estado = 2;
                        }
                        // adjuntar valor del estado
                        DATOS.append('estado', estado);
                        const JSON = await request(USUARIO, 'actualizarEstado', DATOS);

                        if (!JSON.status) {
                            notificacionURL('error', JSON.excep, false);
                        }
                    });

                }

                const ELIMINAR = document.getElementsByClassName('eliminar');
                for (let index = 0; index < ELIMINAR.length; index++) {
                    ELIMINAR[index].addEventListener('click', async (event) => {
                        event.preventDefault();
                        // verificar sí viene de clientes
                        accion = await notificacionAccion('Desea eliminar este usuario o cliente,probablemente \neste tenga pedidos registradas');

                        if (accion) {
                            const DATO = new FormData;
                            DATO.append('idusuario', ELIMINAR[index].value);
                            const JSON = await request(USUARIO, 'eliminar', DATO);
                            if (JSON.status) {
                                cargarTabla('cargarAdmins', COL, TABLA, 'agregarusuario.html');
                                notificacionURL('success', JSON.msg, true);
                            } else {
                                notificacionURL('error', JSON.excep, false);
                            }
                        }
                    })

                }
            }
        }

    }
}

SEARCH.addEventListener('keyup', async event => buscadorCliente(event));