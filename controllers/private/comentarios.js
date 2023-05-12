// importar modulos 
import { request, cargarSelect, notificacionAccion, notificacionURL } from "../controller.js";
import { USUARIO } from './usuarios.js'

const PRODUCTO = 'business/private/producto.php';
const PEDIDO = 'business/private/pedido.php';
const FORM = document.getElementById('form-comentario')
const COMENTARIO = 'business/private/comentario.php';
const TABLA = document.getElementById('tbody-comentario');
const COL = document.querySelectorAll('.tb-switch');
const MODAL = new bootstrap.Modal(document.getElementById('Modal'));

let accion, estado, id, value;

document.addEventListener('DOMContentLoaded', () => {
    cargarSelect(USUARIO, 'usuarios');
    cargarSelect(PRODUCTO, 'productos')
    document.getElementById('proceso').innerText = 'Agregar';
    document.getElementById('pedidos').readOnly = true;
    cargarTabla();
})

FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (document.getElementById('comentario').value !== '') {
        document.getElementById('idcomentario').value ? accion = 'actualizar' : accion = 'guardar';
        const DATOS = new FormData(FORM)
        DATOS.append('comentario', document.getElementById('comentario').value)
        const JSON = await request(COMENTARIO, accion, DATOS);
        if (JSON.status) {
            FORM.reset();
            MODAL.hide();
            cargarTabla();
            notificacionURL('success', JSON.msg, true);
        } else {
            notificacionURL('error', JSON.excep, false);
        }
    }
})

const cargarPedidos = async (seleccionado = null) => {
    if (document.getElementById('usuarios').value >= 1 && document.getElementById('productos').value >= 1) {
        const ID = new FormData;
        let pedido = '';// list para cargar a pedidos

        ID.append('usuarios', document.getElementById('usuarios').value);
        ID.append('productos', document.getElementById('productos').value);
        const JSON = await request(COMENTARIO, 'cargarPedidos', ID);

        if (JSON.status) {

            pedido += `<option disabled selected>Seleccionar</option>`;
            // recorrer todos los pedidos encontrados
            // verificar sí trae un array (bastantes) datos
            if (Array.isArray(JSON.data)) {

                JSON.data.forEach(element => {
                    // definir valor (id) del registro a seleccionar
                    id = Object.values(element)[0];
                    // definir valor para el usuario del registro a seleccionar
                    value = Object.values(element)[1];
                    (id !== seleccionado) ?
                        pedido += `<option value="${id}">${id}</option>` : pedido += `<option value="${id}" selected>${id}</option>`
                });
                // agregar las opciones
                document.getElementById('pedidos').innerHTML = pedido;
            } else {
                document.getElementById('pedidos').value = JSON.data.idpedido;

            }

        } else {
            notificacionURL('info', JSON.excep, false);
        }
    }
}

// método para obtener pedidos en base al cliente, y factura
document.getElementById('usuarios').addEventListener('change', async () => {
    cargarPedidos();
})

document.getElementById('productos').addEventListener('change', async () => {
    cargarPedidos();
})



document.getElementById('pedidos').addEventListener('change', async (event) => {
    event.preventDefault();
    const ID = new FormData;
    ID.append('idpedido', document.getElementById('pedidos').value);
    const JSON = await request(PEDIDO, 'registro', ID);
    if (JSON.status) {
        document.getElementById('fecha').value = JSON.data.fecha;
    } else {
        notificacionURL('error', JSON.excep, false);
    }
})

const cargarTabla = async () => {
    TABLA.innerHTML = ``;
    const JSON = await request(COMENTARIO, 'cargar');
    if (JSON.status) {

        JSON.data.forEach(element => {
            TABLA.innerHTML += `<tr>
                <td>${element.fecha}</td>
                <td class="hide">${element.idpedido}</td>
                <td>${element.correo}</td>
                <td>${element.nombre}</td>
                <td class="col-grap">${element.comentario}</td>
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
                    <!-- boton para actualizar -->                     
                    <button type="submit" class="btn btn-secondary actualizar" data-bs-toggle="modal" data-bs-target="#Modal" value="${element.idcomentario}">Actualizar</button>                            
                    <!-- boton para eliminar -->
                    <button class="btn btn-danger eliminar" value="${element.idcomentario}">Eliminar</button>
                </td>
            </tr>`;
        });
        // obtener todos los botones para actualizar
        const ACTUALIZAR = document.getElementsByClassName('actualizar');
        // recorrer cada boton encontrado
        for (let i = 0; i < ACTUALIZAR.length; i++) {
            // crear evento click
            ACTUALIZAR[i].addEventListener('click', async (event) => {
                event.preventDefault();
                const ID = new FormData;
                ID.append('idcomentario', ACTUALIZAR[i].value);
                const JSON = await request(COMENTARIO, 'registro', ID);
                console.log(JSON)
                if (JSON.status) {
                    FORM.reset();
                    // cargar los inputs con los valores del registro
                    document.getElementById('idcomentario').value = JSON.data.idcomentario;
                    // cargar select
                    cargarSelect(USUARIO, 'usuarios', JSON.data.idusuario);
                    // asignar valor para carga pedidos
                    document.getElementById('usuarios').value = JSON.data.idusuario;
                    // cargar select
                    cargarSelect(PRODUCTO, 'productos', JSON.data.idproducto)
                    // asignar valor
                    document.getElementById('productos').value = JSON.data.idproducto;
                    // asignar que se puede más q solo leer
                    document.getElementById('pedidos').readOnly = false;
                    // cargar pedidos y enviarle el pedido seleccionado en el registr
                    cargarPedidos(JSON.data.idpedido);
                    // cargar fecha
                    document.getElementById('fecha').value = JSON.data.fecha;
                    // cargar comentario
                    document.getElementById('comentario').value = JSON.data.comentario;
                    // cambiar el texto del boton
                    document.getElementById('proceso').innerText = `Actualizar`;
                } else {
                    notificacionURL('error', JSON.excep, false);
                }
            })
        }


        // obtener switch
        const ESTADO = document.querySelectorAll('.estado');
        // recorrer los switches encontrados
        for (let i = 0; i < ESTADO.length; i++) {
            // crear evento change
            ESTADO[i].addEventListener('change', async (event) => {
                event.preventDefault();
                // instanciar clase para enviar datos
                const ID = new FormData;
                // adjuntar el id del comentario a actualizar
                // este boton se puede sustituir por eliminar
                // lo importante que el boton tenga en el valor 
                // el id del registro
                ID.append('idcomentario', ACTUALIZAR[i].value);
                // verificar sí estar checkeado para asignar valor
                (ESTADO[i].checked) ? estado = true : estado = false;
                // adjuntar el valor del estado
                ID.append('estado', estado);
                // hacer petición
                const JSON = await request(COMENTARIO, 'actualizarEstado', ID);
                if (!JSON.status) {
                    // error en el proceso
                    notificacionURL('error', JSON.excep, false);
                }
            })
        }

        // obtener los botones para eliminar
        const ELIMINAR = document.getElementsByClassName('eliminar');
        // recorrer los botones encontrados
        for(let i =0; i < ELIMINAR.length; i++){
            // crear evento 'click' a cada boton
            ELIMINAR[i].addEventListener('click', async (event) => {
                event.preventDefault();
                // preguntar sí se decea eliminar
                accion = await notificacionAccion('Desea eliminar este registro? ');
                if (accion) {
                    // asignar espacio para enviar datos                
                    const ID = new FormData;
                    // adjuntar a ese espacio el id del comentario
                    ID.append('idcomentario', ELIMINAR[i].value)
                    // hacer petición a comentario.php de business
                    const JSON = await request(COMENTARIO, 'eliminar', ID);
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