// importación de modulos
import { notificacionAccion, notificacionURL, request } from "../controller.js";

// api para hacer peticiones de categorias
export const CATEGORIA = 'business/private/categoria.php';
// formulario para guardar datos
const FORM = document.getElementById('form-categoria');
// cuerpo de la tabla
const TABLA = document.getElementById('tbody-categoria');
// boton para el proceso
const PROCESO = document.getElementById('proceso');
// boton para agregar
const AGREGAR = document.getElementById('btn-agregar');
// iniciarlizar modal
const MODAL = new bootstrap.Modal(document.getElementById('Modal'));
// formulario para buscar
const SEARCH = document.getElementById('buscador');
// acción
let accion;

// evento asycn-await que se produce cada vez que cargar el DOM
document.addEventListener('DOMContentLoaded', async () => {
    cargarTabla();
})

const cargarTabla = async () => {
    // reiniciar los valores de la tabla
    TABLA.innerHTML = ``;
    // realizar petición
    const JSON = await request(CATEGORIA, 'cargar');
    if (JSON.status) {
        JSON.data.forEach(element => {
            TABLA.innerHTML += `<tr>
            <td>${element.categoria}</td>
            <td>${element.productos}</td>                
            <td>
                <!-- boton para actualizar -->
                <button class="btn btn-secondary actualizar" data-bs-toggle="modal" data-bs-target="#Modal" value="${element.idcategoria}">Actualizar</button>
                <!-- boton para eliminar -->
                <button class="btn btn-danger eliminar" value="${element.idcategoria}">Eliminar</button>
            </td>
        </tr>`;
        });
        // obtener los botones para actualizar
        const ACTUALIZAR = document.getElementsByClassName('actualizar');
        // recorrer y crear evento de actualizar a cada boton actualizar
        for (let i = 0; i < ACTUALIZAR.length; i++) {
            // crear evento
            ACTUALIZAR[i].addEventListener('click', async (event) => {
                event.preventDefault();
                const DATOS = new FormData;
                DATOS.append('idcategoria', ACTUALIZAR[i].value);
                const JSON = await request(CATEGORIA, 'registro', DATOS);
                if (JSON.status) {
                    FORM.reset();
                    PROCESO.innerText = `Actualizar`;
                    document.getElementById('idcategoria').value = JSON.data.idcategoria;
                    document.getElementById('categoria').value = JSON.data.categoria;
                } else {
                    notificacionURL('error', JSON.excep, false);
                }

            });
        }

        // obtener los botones para eliminar
        const ELIMINAR = document.getElementsByClassName('eliminar');
        // recorrer todo los botones y crearles el evento
        for (let i = 0; i < ELIMINAR.length; i++) {
            ELIMINAR[i].addEventListener('click', async (event) => {

                accion = await notificacionAccion('Dessea eliminar esta marca, \n Revisar cantidad de productos pertenecientes a esta categoria');
                if (accion) {
                    event.preventDefault();
                    const DATO = new FormData;
                    DATO.append('idcategoria', ELIMINAR[i].value);
                    const JSON = await request(CATEGORIA, 'eliminar', DATO);
                    if (JSON.status) {
                        cargarTabla();
                        notificacionURL('success', JSON.msg, true);
                    } else {
                        notificacionURL('error', JSON.excep, false);
                    }
                }
            })
        }
    } else {
        notificacionURL('info', JSON.excep, false);
    }

}

FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    document.getElementById('idcategoria').value ? accion = 'actualizar' : accion = 'crear';
    const DATOS = new FormData(FORM);
    const JSON = await request(CATEGORIA, accion, DATOS);
    if (JSON.status) {
        cargarTabla();
        notificacionURL('success', JSON.msg, true);
        MODAL.hide();
    } else {
        notificacionURL('error', JSON.excep, false);
    }
})

AGREGAR.addEventListener('click', (event) => {
    event.preventDefault();
    PROCESO.innerHTML = `Agregar`;
})