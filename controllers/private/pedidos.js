// importación de modulos de controller
import { request, notificacionAccion, notificacionURL, cargarSelect } from '../controller.js';


// archivo donde se hacen las peticiones
const PEDIDO = 'business/private/pedido.php';
const PRODUCTO = 'business/private/producto.php'
// formulario para obtener datos del pedido
const FORM = document.getElementById('form-orden');
// inicializar MODAL
const MODAL = new bootstrap.Modal(document.getElementById('Modal'));
// obtener la tabla donde cargar los datos
const TABLA = document.getElementById('tbody-pedido');
// objeto para guardar los subtotales
const SUBTOTALES = [];
// obtener cada columna de la tabla, para ir agregando los switch del estado
const COL = document.querySelectorAll('tb-switch')
let accion, estado;

// obtener el id de la factura seleccionada
const getFacturaURL = () => {
    const URL = new URLSearchParams(window.location.search);
    const VALUE = URL.get('facturaid');
    return VALUE;
}

// evento async-await que se ejecuta cada vez que carga la página
document.addEventListener('DOMContentLoaded', () => {
    cargarTabla();
    cargarSelect(PRODUCTO, 'productos');
    // desabilitar
    document.getElementById('cantidad').readOnly = true;
})

// método para obtener la cantidad actual de existencias en producto seleccionado
const obtenerExistencias = async () => {
    // obtener valor del <select>
    const DATO = new FormData;
    DATO.append('idproducto', document.getElementById('productos').value);
    const JSON = await request(PRODUCTO, 'registro', DATO);
    if (JSON.status) {
        // agregar limite maximo al input de cantidad
        document.getElementById('cantidad').setAttribute('max', JSON.data.existencias);
        // habilitar
        document.getElementById('cantidad').readOnly = false;
    } else {
        notificacionURL('error', JSON.excep, false);
    }
}

// evento que se ejecuta cada vez que se selecciona un producto
document.getElementById('productos').addEventListener('change', async (event) => {

    // obtener las existencias que tiene ese producto
    obtenerExistencias();
})

// evento para detectar cuando se envia datos del formulario 
// agregar y actualizar
FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (document.getElementById('cantidad').value !== '') {
        // verificar sí el input para id esta lleno para identificar la acción
        (document.getElementById('idpedido').value) ? accion = 'actualizar' : accion = 'guardar';
        // obtener los datos
        const DATOS = new FormData(FORM);
        DATOS.append('idfactura', getFacturaURL());
        const JSON = await request(PEDIDO, accion, DATOS);
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

const cargarTabla = async () => {
    TABLA.innerHTML = '';
    // limpiar objeto con los valores a 0 
    // a las posiciones que tiene este objeto
    SUBTOTALES.splice(0, SUBTOTALES.length);
    const FACTURA = new FormData;
    FACTURA.append('idfactura', getFacturaURL())
    const JSON = await request(PEDIDO, 'cargar', FACTURA);
    if (JSON.status) {
        JSON.data.forEach(element => {

            TABLA.innerHTML += `<tr>
                <td>${element.idpedido}</td>
                <td>${element.fecha}</td>
                <td class="hide">${element.idproducto}</td>
                <td>${element.nombre}</td>
                <td>${element.precio}</td>
                <td>${element.cantidad}</td>
                <td>${element.subtotal}</td>
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
                        <button type="submit" class="btn btn-secondary actualizar" data-bs-toggle="modal" data-bs-target="#Modal" value="${element.idpedido}">Actualizar</button>
                        <!-- boton para eliminar -->
                        <button class="btn btn-danger eliminar" value="${element.idpedido}">Eliminar</button>
                </td>
            </tr>`;

            // agregar subtotales al objeto
            if (element.estado === 1) {
                SUBTOTALES.push(element.subtotal);
            }
        });
        // asignar y reiniciar una var para tener el total
        // y una pa
        let total = 0, index = 0;
        // crear una variante del array con los SUBTOTALES
        for (const UNIT of SUBTOTALES) {
            // al valor anterior sumarle el número
            total += parseFloat(UNIT + ' index: ' + index);

        }
        // agregar a html el total.de longitud de 5 valores 
        document.getElementById('total').innerText = '$ ' + total.toLocaleString(6);
        document.getElementById('total').innerHTML = `<input type="number" class="hide" id="input-total" value="${total}">
            $ ${total.toLocaleString(5)}    
        `;
        // obtener los botones para actualizar
        const ACTUALIZAR = document.getElementsByClassName('actualizar')
        // recorrer cada uno de estos botones
        for (let i = 0; i < ACTUALIZAR.length; i++) {
            // crear evento al boton que se recorre
            ACTUALIZAR[i].addEventListener('click', async (event) => {
                event.preventDefault();
                const ID = new FormData;
                ID.append('idpedido', ACTUALIZAR[i].value);
                const JSON = await request(PEDIDO, 'registro', ID);
                if (JSON.status) {
                    // reinciar los valores del formulario
                    FORM.reset();
                    // cargar los valores
                    cargarSelect(PRODUCTO, 'productos', JSON.data.idproducto);
                    // habilitar                    
                    document.getElementById('cantidad').readOnly = false;

                    document.getElementById('cantidad').value = JSON.data.cantidad;
                    document.getElementById('fecha').value = JSON.data.fecha;
                    document.getElementById('proceso').innerText = `Actualizar`;
                    document.getElementById('idpedido').value = JSON.data.idpedido;
                } else {
                    notificacionURL('error', JSON.excep, false);
                }
            })
        }

        // obtener todos los switches de la tabla
        const ESTADO = document.getElementsByClassName('estado');
        // recorrer los input encontrados
        for (let i = 0; i < ESTADO.length; i++) {
            // crear evento change para modificar estado
            ESTADO[i].addEventListener('change', async (event) => {
                event.preventDefault();
                const ID = new FormData;
                // verifica sí el switch está checkeado
                (ESTADO[i].checked) ? estado = 1 : estado = 2;
                // adjuntar el id del pedido con el nombre del var 'idpedido'
                ID.append('idpedido', ACTUALIZAR[i].value);
                // adjuntar el estado del pedido con el nombre de var 'estado'
                ID.append('estado', estado);
                const JSON = await request(PEDIDO, 'actualizarEstado', ID);
                if (!JSON.status) {
                    notificacionURL('error', JSON.excep, false);
                } else {
                    // verificar sí está checkeado
                    if (ESTADO[i].checked) {
                        // sumar el valor del subtotal en la posición del switch modificado
                        // total += SUBTOTALES[i]
                        
                        // for (const UNIT of SUBTOTALES) {

                        //     console.log(UNIT)
                        //     // al valor anterior sumarle el número
                        //     total += parseFloat(UNIT + ' index: ' + index);
                
                        // }
                        
                        document.getElementById('total').innerText = '$ ' + total.toLocaleString(6);                        
                        console.log('sumar')
                    } else {
                        console.log('restar')
                        // for (const UNIT of SUBTOTALES) {
                        //     console.log(UNIT)
                        //     // al valor anterior sumarle el número
                        //     total -= parseFloat(UNIT + ' index: ' + index);
                
                        // }
                        // total -= SUBTOTALES[i]
                        document.getElementById('total').innerText = '$ ' + total.toLocaleString(6);
                    }
                }
            })
        }

    } else {
        notificacionURL('error', JSON.excep, false);
    }
}