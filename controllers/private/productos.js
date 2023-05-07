import { request, notificacionURL, notificacionAccion, cargarSelect } from '../controller.js';

const CATEGORIA = 'business/private/categoria.php';
const MARCA = 'business/private/marca.php';
const PRODUCTO = 'business/private/producto.php';
const SWITCH = document.getElementById('estado');
const FORM = document.getElementById('form-producto');
const SEARCH = document.getElementById('buscador');
const PROCESO = document.getElementById('proceso');
const TABLA = document.getElementById('tbody-producto');
const COL = document.querySelectorAll('.tb-switch');
const PATH = '../../api/images/productos/';


let accion;
let estado;


// se encierrar en un if para verificar sí se encontró ese elemento
if (SWITCH) {

    SWITCH.addEventListener('change', () => {
        if (SWITCH.checked) {
            console.log(SWITCH.value + 'change');

        }
    })
}

document.addEventListener('DOMContentLoaded', async (event) => {
    event.preventDefault();
    // verificar la página, sí es agregar
    if (location.href.indexOf('agregar') !== -1) {

        // verificar sí el proceso para carga los selects
        if (document.getElementById('idproducto').value) {
            console.log('actualizar');
        } else {
            cargarSelect(CATEGORIA, 'categorias');
            cargarSelect(MARCA, 'marcas');
        }

    } else {
        cargarTabla();
    }

})

if (FORM) {
    FORM.addEventListener('submit', async (event) => {
        event.preventDefault();
        document.getElementById('idproducto').value ? accion = 'actualizar' : accion = 'crear';
        // verificar sí el switch se seleccionó
        SWITCH.checked ? estado = true : estado = false;
        const DATOS = new FormData(FORM);
        DATOS.append('chkestado', estado);
        const JSON = await request(PRODUCTO, accion, DATOS);
        if (JSON.status) {
            FORM.reset();
            notificacionURL('success', JSON.msg, true, 'productos.html');
        } else {
            notificacionURL('error', JSON.excep, false);
        }
    })
}

const cargarTabla = async () => {
    TABLA.innerHTML = ``;
    const JSON = await request(PRODUCTO, 'cargar');
    if (JSON.status) {
        // let index = 0;
        JSON.data.forEach(element => {
            TABLA.innerHTML += `<tr>
                    <td>
                        <img src="${PATH + element.imagen}" alt="${element.nombre}" width="75px" height="75px">
                        ${element.nombre}
                    </td>
                    <td>${element.precio}</td>
                    <td>${element.existencias}</td>
                    <td>${element.categoria}</td>
                    <td>${element.marca}</td>
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
                    <td>
                        <!-- boton para actualizar -->
                        <button class="btn btn-secondary actualizar" data-bs-toggle="modal" data-bs-target="#Modal" value="${element.idproducto}">Actualizar</button>
                        <!-- boton para eliminar -->
                        <button class="btn btn-danger eliminar" value="${element.idproducto}">Eliminar</button>
                    </td>
                </tr>`;
                // (element.estado) ? estado = true : estado  = false;
            // index++;
        });

        const ACTUALIZAR = document.getElementsByClassName('actualizar');
        

        const ELIMINAR = document.getElementsByClassName('eliminar');
        for (let i = 0; i < ELIMINAR.length; i++) {
            ELIMINAR[i].addEventListener('click', async (event) => {
                accion = await notificacionAccion('Desea eliminar este producto \n Revisar cuantas clientes ha pedido este producto');
                if (accion) {
                    event.preventDefault();
                    const DATO = new FormData;
                    DATO.append('idproducto', ELIMINAR[i].value);
                    const JSON = await request(PRODUCTO, 'eliminar', DATO);
                    if (JSON.status) {
                        cargarTabla();
                        notificacionURL('success', JSON.msg, true);
                    } else {
                        notificacionURL('error', JSON.excep, false);
                    }
                }
            });
        }

        // obtener todos los switch de la tabla
        const ESTADO = document.getElementsByClassName('estado');
        // recorrer todos switch para y a cada uno crearle un evento
        for(let i = 0; i < ESTADO.length; i++){
            ESTADO[i].addEventListener('change', async (event) => {
                event.preventDefault();
                // evaluar sí el valor del input es true
                // para cambiar el valor al nuevo estado                
                const DATOS = new FormData;
                // adjuntar el id del producto
                DATOS.append('idproducto', ACTUALIZAR[i].value);
                // adjuntar nuevo estado
                if (ESTADO[i].checked) {                    
                    // estado true
                    estado = true;
                }else{
                    // estado false
                    estado = false;
                }
                DATOS.append('estado', estado);
                const JSON = await request(PRODUCTO, 'actualizarEstado', DATOS);
                if (!JSON.status) {
                    // sí hay error en la petición informar al usuario
                    notificacionURL('error', JSON.excep, false);  
                }
            });
        }

    } else {
        notificacionURL('info', JSON.excep, false);
    }
}