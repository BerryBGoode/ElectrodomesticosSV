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

const cargarTabla = async(event) => {
    
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
                    ${(element.estado) ?
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
    } else {
        
    }
}