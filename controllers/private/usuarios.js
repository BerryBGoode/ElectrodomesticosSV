import { request, notificacionURL, notificacionAccion, cargarSelect } from '../controller.js';

const USUARIO = 'business/private/usuario.php';
const CANCELAR = document.getElementById('cancelar');
const PROCESO = document.getElementById('proceso');
const FORM = document.getElementById('form-usuario');
const SWITCH = document.getElementById('estado');
const TABLA = document.getElementById('tbody-usuario');
const COL = document.querySelectorAll('.tb-switch');
let accion;
let estado;
let contenedorswitch = document.querySelector('.switch');


const getUsuarioURL = () => {
    const URL = new URLSearchParams(window.location.search);
    const VALUE = URL.get('usuarioid');
    return VALUE;
}

if (CANCELAR) {
    CANCELAR.addEventListener('click', () => {
        location.href = 'usuarios.html';
    })
}

const toActualizar = (json) => {
    
    document.getElementById('nombres').value = json.nombre;
    document.getElementById('apellidos').value = json.apellido;
    document.getElementById('usuario').value = json.nombreusuario;
    document.getElementById('correo').value = json.correo;
    document.getElementById('direccion').value = json.direccion;
}

document.addEventListener('DOMContentLoaded', async (event) => {
    event.preventDefault();
    // verificar sí la página es de agregar
    // obteniendo la url actual, y verificar sí contiene la palabra agregar
    // que es la que tiene una vista como estandar
    // sí el resultado de buscar ese texto no es -1 
    // es porque existe 
    if (location.href.indexOf('agregar') !== -1) {
        // para proceso a agregar o actualizar
        // verificar sí es actualizar
        if (getUsuarioURL()) {
            document.getElementById('clave').style.visibility = 'hidden';
            document.getElementById('lbl-clave').style.visibility = 'hidden';
            contenedorswitch.style.visibility = 'hidden';
            PROCESO.innerText = 'Actualizar';
            // obtener los datos del registro
            const DATO = new FormData;
            DATO.append('idusuario', getUsuarioURL());
            const JSON = await request(USUARIO, 'registroAdmin', DATO);
            if (JSON.status) {
                toActualizar(JSON.data);
            } else {
                notificacionURL('error', JSON.excep, false, 'usuarios.html')
            }
        } else {
            contenedorswitch.style.visibility = 'hidden';
            PROCESO.innerText = 'Agregar';
        }
    } else {
        cargarTabla();
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

const cargarTabla = async (event) => {

    TABLA.innerHTML = ``;
    const JSON = await request(USUARIO, 'cargarAdmins');
    if (JSON.status) {

        JSON.data.forEach(element => {

            TABLA.innerHTML += `<tr>
                <td>${element.nombreusuario}</td>
                <td>${element.nombre}</td>
                <td>${element.apellido}</td>
                <td>${element.correo}</td>
                <td class="tb-switch">
                    ${(element.estado === 1) ?
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
                const DATO = new FormData;
                DATO.append('idusuario', ELIMINAR[index].value);
                const JSON = await request(USUARIO, 'eliminar', DATO);
                if (JSON.status) {
                    cargarTabla();
                    notificacionURL('success', JSON.msg, true);
                } else {
                    notificacionURL('error', JSON.excep, false);
                }
            })
            
        }
    } else {
        notificacionURL('error', JSON.excep, false);
    }
}