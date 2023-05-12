import { request, notificacionURL, notificacionAccion, cargarSelect } from '../controller.js';

export const USUARIO = 'business/private/usuario.php';

const PROCESO = document.getElementById('proceso');
const FORM = document.getElementById('form-usuario');
const SWITCH = document.getElementById('estado');
const TABLA = document.getElementById('tbody-usuario');
const COL = document.querySelectorAll('.tb-switch');
const SEARCH = document.getElementById('buscador');

let accion;
let estado;
let contenedorswitch = document.querySelector('.switch');


const getUsuarioURL = () => {
    const URL = new URLSearchParams(window.location.search);
    const VALUE = URL.get('usuarioid');
    return VALUE;
}



const toActualizar = (json) => {
    document.getElementById('idusuario').value = json.idusuario;
    document.getElementById('nombres').value = json.nombre;
    document.getElementById('apellidos').value = json.apellido;
    document.getElementById('usuario').value = json.nombreusuario;
    document.getElementById('correo').value = json.correo;
    document.getElementById('direccion').value = json.direccion;
}

export const checkProceso = async (accion, url, urlid, proceso) => {
    // para proceso a agregar o actualizar
    // verificar sí es actualizar
    if (urlid) {
        document.getElementById('clave').style.visibility = 'hidden';
        document.getElementById('lbl-clave').style.visibility = 'hidden';
        contenedorswitch.style.visibility = 'hidden';
        proceso.innerText = 'Actualizar';
        // obtener los datos del registro
        const DATO = new FormData;
        DATO.append('idusuario', urlid);
        const JSON = await request(USUARIO, accion, DATO);
        if (JSON.status) {
            toActualizar(JSON.data);
        } else {
            notificacionURL('error', JSON.excep, false, url)
        }
    } else {
        contenedorswitch.style.visibility = 'hidden';
        proceso.innerText = 'Agregar';
    }
}

document.addEventListener('DOMContentLoaded', async (event) => {
    event.preventDefault();
    // verificar sí la página es de agregar
    // obteniendo la url actual, y verificar sí contiene la palabra agregar
    // que es la que tiene una vista como estandar
    // sí el resultado de buscar ese texto no es -1 
    // es porque existe 
    if (location.href.indexOf('agregar') !== -1) {
        checkProceso('registro', 'usuarios.html', getUsuarioURL(), PROCESO);
    } else {
        // VERIFICAR SÍ EXISTE ESTA TABLA
        // PORQUE SE EXPORTA ESTE MODULO SE EJECUTA EL CARGADO DEL DOM
        if (TABLA) {
            cargarTabla('cargarAdmins', COL, TABLA, 'agregarusuario.html');
        }
    }
})

/**
 * 
 * @param {*} crear acción de crear a realizar
 * @param {*} url vista a ser rediccionado cuando se agrege correctamente
 * @param {*} datos formulario con los datos a registrar
 */
export const enviarDatos = async (crear, url, datos) => {
    document.getElementById('idusuario').value ? accion = 'actulizarUsuario' : accion = crear;
    const DATOS = new FormData(datos);
    // verificar sí el switch está checkeado
    const JSON = await request(USUARIO, accion, DATOS);
    if (JSON.status) {
        datos.reset();
        notificacionURL('success', JSON.msg, true, url);
    } else {
        notificacionURL('error', JSON.excep, false);
    }
}

if (FORM) {

    FORM.addEventListener('submit', async (event) => {
        event.preventDefault();
        enviarDatos('crearAdmin', 'usuarios.html', FORM);
    })
}
/**
 * 
 * @param {*} cargar acción a cargar
 * @param {*} col columna para evaluar el switch del estado
 * @param {*} tabla tabla a donde renderizar datos
 * @param {*} view formulario de agregar a enviar
 */
export const cargarTabla = async (cargar, col, tabla, view) => {

    tabla.innerHTML = ``;
    const JSON = await request(USUARIO, cargar);
    if (JSON.status) {

        JSON.data.forEach(element => {

            tabla.innerHTML += `<tr>
                <td>${element.nombreusuario}</td>
                <td>${element.nombre}</td>
                <td>${element.apellido}</td>
                <td>${element.correo}</td>
                <td class="tb-switch">
                    ${(element.estado === 1) ?
                    col.innerHTML = `<div class="form-check form-switch"> 
                            <input class="form-check-input estado" name="estado" id="estado" type="checkbox" id="estado" checked> 
                        </div>`
                    :
                    col.innerHTML = `<div class="form-check form-switch"> 
                            <input class="form-check-input estado" name="estado" id="estado" type="checkbox" id="estado"> 
                        </div>`
                }
                </td>
                <td class="buttons-tb">
                    <form action="${view}" method="get" class="form-button">
                        <!-- boton para actualizar -->                        
                            <button type="submit" class="btn btn-secondary actualizar" data-bs-toggle="modal" data-bs-target="#Modal" value="${element.idusuario}">Actualizar</button>
                            <input type="number" name="usuarioid" class="hide" id="productoid" value="${element.idusuario}">                        
                    </form>
                        <!-- boton para eliminar -->
                    <button class="btn btn-danger eliminar" value="${element.idusuario}">Eliminar</button>
                </td>
            </tr>`;
        });

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
    } else {
        notificacionURL('error', JSON.excep, false);
    }
}

const buscador = async event => {
    event.preventDefault();
    const JSON = await request(USUARIO, 'cargarAdmins');
    if (!JSON.status) {
        notificacionURL('error', JSON.excep, false);
    } else {
        TABLA.innerHTML = ``;
        let search = document.getElementById('input-buscar').value.toLowerCase();
        if (search === '' || search === ' ') {
            TABLA.innerHTML = ``;
            cargarTabla('cargarAdmins', COL, TABLA, 'agregarusuario.html');
        } else {
            TABLA.innerHTML = ``;
            for (let admins of JSON.data) {
                let usuario = admins.nombreusuario.toLowerCase();
                let nombres = admins.nombre.toLowerCase();
                let apellidos = admins.apellido.toLowerCase();
                let correo = admins.correo.toLowerCase();
                if (usuario.indexOf(search) !== -1 || nombres.indexOf(search) !== -1
                    || apellidos.indexOf(search) !== -1 || correo.indexOf(search) !== -1) {
                    TABLA.innerHTML += `<tr>
                        <td>${admins.nombreusuario}</td>
                        <td>${admins.nombre}</td>
                        <td>${admins.apellido}</td>
                        <td>${admins.correo}</td>
                        <td class="tb-switch">
                            ${(admins.estado === 1) ?
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
                            <form action="agregarusuario.html" method="get" class="form-button">
                                <!-- boton para actualizar -->                        
                                    <button type="submit" class="btn btn-secondary actualizar" data-bs-toggle="modal" data-bs-target="#Modal" value="${admins.idusuario}">Actualizar</button>
                                    <input type="number" name="usuarioid" class="hide" id="productoid" value="${admins.idusuario}">                        
                            </form>
                                <!-- boton para eliminar -->
                            <button class="btn btn-danger eliminar" value="${admins.idusuario}">Eliminar</button>
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

SEARCH.addEventListener('keyup', async event => buscador(event))