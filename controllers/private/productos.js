import { request, notificacionURL, notificacionAccion, cargarSelect } from '../controller.js';

const CATEGORIA = 'business/private/categoria.php';
const MARCA = 'business/private/marca.php';
export const PRODUCTO = 'business/private/producto.php';
const SWITCH = document.getElementById('estado');
const FORM = document.getElementById('form-producto');
const SEARCH = document.getElementById('buscador');
const PROCESO = document.getElementById('proceso');
const TABLA = document.getElementById('tbody-producto');
const COL = document.querySelectorAll('.tb-switch');
const PATH = '../../api/images/productos/';

let accion;
let estado;
let contenedorswitch = document.querySelector('.switch');
let imagenformulario = document.querySelector('.imagen-producto');


// se encierrar en un if para verificar sí se encontró ese elemento
if (SWITCH) {

    SWITCH.addEventListener('change', () => {
        if (SWITCH.checked) {
            console.log(SWITCH.value + 'change');

        }
    })
}

const getProductoURL = () => {
    const URL = new URLSearchParams(window.location.search);
    const VALUE = URL.get('productoid');
    return VALUE;
}

const toActualizar = async (json) => {
    contenedorswitch.style.visibility = 'hidden';

    cargarSelect(CATEGORIA, 'categorias', json.idcategoria);
    cargarSelect(MARCA, 'marcas', json.idmarca)

    document.getElementById('producto').value = json.nombre;
    document.getElementById('precio').value = json.precio;
    document.getElementById('existencias').value = json.existencias;
    document.getElementById('descripcion').value = json.descripcion;
    document.getElementById('idproducto').value = json.idproducto;

    // imagenformulario.innerHTML = `<img src="${PATH + json.imagen}" alt="" width="50px" height="50px">`;

}

document.addEventListener('DOMContentLoaded', async (event) => {
    event.preventDefault();

    // verificar la página, sí es agregarproducto.html
    if (location.href.indexOf('agregar') !== -1) {

        // verificar sí el proceso para carga los selects
        // verificar proceso por medio de url
        if (getProductoURL()) {
            PROCESO.innerText = `Actualizar`;
            const DATO = new FormData;
            DATO.append('idproducto', getProductoURL());
            const JSON = await request(PRODUCTO, 'registro', DATO);
            if (JSON.status) {
                toActualizar(JSON.data);
            } else {
                notificacionURL('error', JSON.excep, false);
            }
        } else {
            PROCESO.innerText = `Agregar`;
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
                <td class="buttons-tb">
                    <form action="agregarproducto.html" method="get" class="form-button">
                        <!-- boton para actualizar -->                        
                            <button type="submit" class="btn btn-secondary actualizar" data-bs-toggle="modal" data-bs-target="#Modal" value="${element.idproducto}">Actualizar</button>
                            <input type="number" name="productoid" class="hide" id="productoid" value="${element.idproducto}">                        
                    </form>
                        <!-- boton para eliminar -->
                    <button class="btn btn-danger eliminar" value="${element.idproducto}">Eliminar</button>
                </td>
            </tr>`;
        });

        const ACTUALIZAR = document.getElementsByClassName('actualizar');
        // for (let i = 0; i < ACTUALIZAR.length; i++) {
        //     ACTUALIZAR[i].addEventListener('click', () => {
        //         location.href = '';
        //         location.href.search = 'agregarproducto.html?' + ACTUALIZAR[i].value;
        //     })

        // }

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
        for (let i = 0; i < ESTADO.length; i++) {
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
                } else {
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

const buscador = async event => {
    event.preventDefault();
    TABLA.innerHTML = '';
    const JSON = await request(PRODUCTO, 'cargar');
    if (!JSON.status) {
        notificacionURL('error', JSON.excep, false);
    } else {
        TABLA.innerHTML = ``;
        let search = document.getElementById('input-buscar').value.toLowerCase();
        if (search === '' || search === ' ') {
            TABLA.innerHTML = ``;
            cargarTabla();
        } else {
            TABLA.innerHTML = ``;
            for (let productos of JSON.data) {
                let nombre = productos.nombre.toLowerCase();
                let marca = productos.marca.toLowerCase();
                let precio = productos.precio;
                let categoria = productos.categoria.toLowerCase();
                if (nombre.indexOf(search) !== -1 || marca.indexOf(search) !== -1
                    || precio.indexOf(search) !== -1 || categoria.indexOf(search) !== -1) {
                    TABLA.innerHTML += `<tr>
                    <td>
                        <img src="${PATH + productos.imagen}" alt="${productos.nombre}" width="75px" height="75px">
                        ${productos.nombre}
                    </td>
                    <td>${productos.precio}</td>
                    <td>${productos.existencias}</td>
                    <td>${productos.categoria}</td>
                    <td>${productos.marca}</td>
                    <td class="tb-switch">
                        ${(productos.estado) ?
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
                        <form action="agregarproducto.html" method="get" class="form-button">
                            <!-- boton para actualizar -->                        
                                <button type="submit" class="btn btn-secondary actualizar" data-bs-toggle="modal" data-bs-target="#Modal" value="${productos.idproducto}">Actualizar</button>
                                <input type="number" name="productoid" class="hide" id="productoid" value="${productos.idproducto}">                        
                        </form>
                            <!-- boton para eliminar -->
                        <button class="btn btn-danger eliminar" value="${productos.idproducto}">Eliminar</button>
                    </td>
                </tr>`;
                }
            }
            const ACTUALIZAR = document.getElementsByClassName('actualizar');
            // for (let i = 0; i < ACTUALIZAR.length; i++) {
            //     ACTUALIZAR[i].addEventListener('click', () => {
            //         location.href = '';
            //         location.href.search = 'agregarproducto.html?' + ACTUALIZAR[i].value;
            //     })

            // }

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
            for (let i = 0; i < ESTADO.length; i++) {
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
                    } else {
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
        }
    }
}

SEARCH.addEventListener('keyup', async event => buscador(event));
SEARCH.addEventListener('submit', async event => buscador(event));