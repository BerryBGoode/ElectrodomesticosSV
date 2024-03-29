// importando modulo para hacer peticiones
import { request, getUrl, notificacionAccion, notificacionURL } from "../controller.js";

// archivo para hacer las peticiones al servidor
const CARRITO = 'business/public/carrito.php';
// contenido de la tabla
const TABLA = document.getElementById('tbody-pedidos');
// arreglo para guardar los subtotales
const SUBTOTALES = [];



let sumarSubotates = () => {
    // asignar y reiniciar una variable con el total y un para el indice
    let total = 0, index = 0;
    for (const UNIDAD of SUBTOTALES) {
        // subtotal va ser igual más el valor anterior
        total += parseFloat(UNIDAD + 'index : ' + index);
    }
    // agregar total al pedido
    document.getElementById('total').innerHTML = '$' + total.toLocaleString(6);
}

// método para cargar los datos en el carrito
let cargarCarrito = async () => {
    // limipiar tabla
    TABLA.innerHTML = ``;
    // reiniciar los valores del arreglo
    SUBTOTALES.splice(0, SUBTOTALES.length);
    // obtener los datos
    const ID = new FormData;
    ID.append('factura', getUrl('idfactura'));
    // hacer petición
    const JSON = await request(CARRITO, 'verCarrito', ID);
    switch (JSON.status) {
        case -1:
            // MENSAJE DE ERROR
            document.querySelector('body').innerHTML += `
            <div class="toast" id="toast-login" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-body">
                    Debe iniciar sesión antes
                        <button type="button" class="btn btn-primary btn-sm" id="login">iniciar sesión</button>                
                    </div>
                </div>
            </div>
            `;
            const TOASTACCION = new bootstrap.Toast('#toast-login');

            TOASTACCION.show();

            document.getElementById('login').addEventListener('click', () => {
                location.href = 'login.html';
            });

            break;

        case 0:

            break;

        case 1:

            JSON.data.forEach(element => {
                // asignar estado de la factura
                document.getElementById('estado-factura').value = element.estadofactura;

                TABLA.innerHTML += `
                <td class="hide pedido">${element.idpedido}</td>
                <td class="col-grap">${element.fecha}</td>
                <td class="hide existencias">${element.existencias}</td>
                <td class="hide producto">${element.idproducto}</td>
                <td>${element.nombre}</td>
                <td>$${element.precio}</td>
                <td>
                    <svg id="restar" class="restar" width="19" height="19" viewBox="0 0 25 25" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.5 22.9168C18.2291 22.9168 22.9166 18.2293 22.9166 12.5002C22.9166 6.771 18.2291 2.0835 12.5 2.0835C6.77081 2.0835 2.08331 6.771 2.08331 12.5002C2.08331 18.2293 6.77081 22.9168 12.5 22.9168Z"
                            stroke="#424242" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M8.33331 12.5H16.6666" stroke="#424242" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span id="contador" class="contador">${element.cantidad}</span>
                    <svg id="sumar" class="sumar" width="19" height="19" viewBox="0 0 25 25" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.5 22.9168C18.2292 22.9168 22.9167 18.2293 22.9167 12.5002C22.9167 6.771 18.2292 2.0835 12.5 2.0835C6.77084 2.0835 2.08334 6.771 2.08334 12.5002C2.08334 18.2293 6.77084 22.9168 12.5 22.9168Z"
                            stroke="#424242" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                        <path d="M8.33334 12.5H16.6667" stroke="#424242" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M12.5 16.6668V8.3335" stroke="#424242" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" />
                    </svg>                                
                </td>
                <td>$${element.subtotal}</td>                
                <td class="tb-switch">
                    ${(element.estado === 1) ?

                        TABLA.innerHTML = `<div class="form-check form-switch col-estado"> 
                                        <input class="form-check-input estado" name="estado" id="estado" type="checkbox" id="estado" checked> 
                                    </div>`
                        :
                        TABLA.innerHTML = `<div class="form-check form-switch col-estado"> 
                                        <input class="form-check-input estado" name="estado" id="estado" type="checkbox" id="estado"> 
                                    </div>`
                    }
                </td>
                <td class="button-eliminar">
                    <!-- boton para eliminar -->
                    <button class="btn btn-danger eliminar" value="${element.idpedido}">Eliminar</button>
                </td>                
    
                `;
                // verificar el estado activo del pedido
                if (element.estado === 1) {
                    // para agregarselo al arreglo y después sumarlo
                    SUBTOTALES.push(element.subtotal);
                }
            });
            sumarSubotates();

            // botones para eliminar y tambien 
            // para obtener la cantidad de columnas
            const ELIMINAR = document.getElementsByClassName('eliminar');
            // obtener los botones para restar
            const RESTA = document.getElementsByClassName('restar');
            // obtener los botones para sumar 
            const SUMA = document.getElementsByClassName('sumar');
            // obtener los switchs
            const ESTADO = document.getElementsByClassName('estado');


            // toasts
            // instanciar toast para mostrar mensaje
            const MSGTOAST = new bootstrap.Toast('#normal-toast');

            // obtener la cantidad de la col
            let cantidad = document.getElementsByClassName('contador');
            // obtener las existencias
            let existencias = document.getElementsByClassName('existencias');
            // obtener el idpedido
            let pedido = document.getElementsByClassName('pedido');
            // obtener el idproducto
            let producto = document.getElementsByClassName('producto');


            // verificar si el estado ha sido finalizada
            if (document.getElementById('estado-factura').value === 1) {
                // ocultas elementos
                document.getElementById('buttons-carrito').hidden = true;
                // ocultas las cabezeras de la tabla
                document.getElementById('header-estado').hidden = true;
                document.getElementById('header-accion').hidden = true;

            }

            // crear eventos
            for (let i = 0; i < ELIMINAR.length; i++) {


                // verificar sí la factura ya fue comprada o finalizada
                if (document.getElementById('estado-factura').value === 1) {
                    // ocultas elementos pertenecientes a los pedidos
                    document.getElementsByClassName('tb-switch')[i].classList.toggle('hide');
                    document.getElementsByClassName('button-eliminar')[i].classList.toggle('hide');

                }

                // evento para el boton de restar
                RESTA[i].addEventListener('click', async event => {
                    event.preventDefault();
                    // verificar sí la cantidad no es menor o igual a 1 
                    // para poder restar
                    if (parseInt(cantidad[i].textContent) <= 1) {
                        // enviar mensaje
                        document.getElementById('msg-toast').innerText = `No puede eliminar más`;
                        // mostrar toast
                        MSGTOAST.show();
                    } else {
                        // hacer resta y actualización
                        let result = parseInt(cantidad[i].textContent) - 1;
                        // adjuntar datos para enviar
                        const PEDIDO = new FormData;
                        PEDIDO.append('cantidad', result);
                        PEDIDO.append('existencias', existencias[i].textContent);
                        PEDIDO.append('pedido', pedido[i].textContent);
                        // enviar operación de restar
                        PEDIDO.append('ope', 2);

                        const JSON = await request(CARRITO, 'modificarCantidad', PEDIDO);
                        if (JSON.status) {
                            cantidad[i].innerHTML = result;
                        }
                    }
                })

                SUMA[i].addEventListener('click', async event => {
                    event.preventDefault();
                    // verificar si las existencias de ese producto son
                    // mayores a la cantidad
                    // o igual a la cantidad
                    let result = parseInt(cantidad[i].textContent) + 1;
                    if (existencias[i].textContent >= result) {
                        const PEDIDO = new FormData;
                        PEDIDO.append('cantidad', result);
                        PEDIDO.append('existencias', existencias[i].textContent);
                        PEDIDO.append('pedido', pedido[i].textContent);
                        // enviar operación de sumar                    
                        PEDIDO.append('ope', 1);
                        // hacer petición para modificar la cantidad
                        const JSON = await request(CARRITO, 'modificarCantidad', PEDIDO);
                        if (JSON.status) {
                            cantidad[i].innerHTML = result;
                        } else {
                            // enviar mensaje
                            document.getElementById('msg-toast').innerText = `No puede  agregar más`;
                            // mostrar toast
                            MSGTOAST.show();
                        }
                    } else {
                        // enviar mensaje
                        document.getElementById('msg-toast').innerText = `No puede  agregar más`;
                        // mostrar toast
                        MSGTOAST.show();
                        console.log(existencias[i].textContent + '>=' + result);
                    }
                })

                // por el momento no funcióna la eliminación en tiempo real
                // ESTADO[i].addEventListener('click', async event => {

                //     SUBTOTALES.splice(ESTADO[i], 1);                    
                //     sumarSubotates();

                // })
                ELIMINAR[i].addEventListener('click', async event => {
                    event.preventDefault();
                    let accion = await notificacionAccion('Desea eliminar este pedido?')
                    if (accion) {
                        const PEDIDO = new FormData;
                        PEDIDO.append('idpedido', ELIMINAR[i].value);
                        PEDIDO.append('cantidad', cantidad[i].textContent);
                        PEDIDO.append('idproducto', producto[i].textContent);
                        const JSON = await request('business/private/pedido.php', 'eliminar', PEDIDO);
                        if (JSON.status) {
                            location.reload();
                        }
                    }
                })
            }

            break;
        default:
            break;
    }
}

// evento click cuando se cancele un pedido
document.getElementById('cancelarPedido').addEventListener('click', async event => {
    event.preventDefault();
    // mostrar mensaje de confirmación
    let confirmar = await notificacionAccion('Desea cancelar estos pedidos?');
    if (confirmar) {
        // eliminar pedidos y eliminar factura
        const FACTURA = new FormData;
        // adjuntar idfactura
        FACTURA.append('factura', getUrl('idfactura'));
        // hacer petición de eliminar pedidos de factura
        const JSON = await request(CARRITO, 'cancelarPedidos', FACTURA);
        if (JSON.status) {
            notificacionURL('info', 'Pedidos eliminados', false, 'productos.html');
        }
    }
})

// evento click cunado se finalice la compra
document.getElementById('finalizarPedido').addEventListener('click', async event => {
    event.preventDefault();
    let confirmar = await notificacionAccion('Desea finalizar compra?');
    if (confirmar) {
        // cambiar estado de la factura
        const FACTURA = new FormData;
        // adjuntar idfactura
        FACTURA.append('factura', getUrl('idfactura'));
        const JSON = await request(CARRITO, 'finalizarCompra', FACTURA);
        if (JSON.status) {
            await notificacionURL('success', 'Pedido finalizado', false, 'productos.html');
            const JSON2 = await request(CARRITO, 'generateFactura', FACTURA);
            if (JSON.status) {
                const PATH = new URL(JSON2.data);
                window.open(PATH);
            }
        }
    }
})

// evento que se ejecuta cuando cargar la página
document.addEventListener('DOMContentLoaded', event => {
    event.preventDefault();
    cargarCarrito();
})