// importando modulo para hacer peticiones
import { request, getUrl } from "../controller.js";

// archivo para hacer las peticiones al servidor
const CARRITO = 'business/public/carrito.php';
// contenido de la tabla
const TABLA = document.getElementById('tbody-pedidos');


// método para cargar los datos en el carrito
let cargarCarrito = async () => {
    // limipiar tabla
    TABLA.innerHTML = ``;
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

                TABLA.innerHTML += `
                <td class="hide pedido">${element.idpedido}</td>
                <td class="col-grap">${element.fecha}</td>
                <td class="hide existencias">${element.existencias}</td>
                <td>${element.nombre}</td>
                <td>${element.precio}</td>
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
                <td>${element.subtotal}</td>
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
                <td>
                    <!-- boton para eliminar -->
                    <button class="btn btn-danger eliminar" value="${element.idpedido}">Eliminar</button>
                </td>                
    
                `;
            });


            // botones para eliminar y tambien 
            // para obtener la cantidad de columnas
            const ELIMINAR = document.getElementsByClassName('eliminar');
            // obtener los botones para restar
            const RESTA = document.getElementsByClassName('restar');
            // obtener los botones para sumar 
            const SUMA = document.getElementsByClassName('sumar');


            // toasts
            // instanciar toast para mostrar mensaje
            const MSGTOAST = new bootstrap.Toast('#normal-toast');

            // obtener la cantidad de la col
            let cantidad = document.getElementsByClassName('contador');
            // obtener las existencias
            let existencias = document.getElementsByClassName('existencias');
            // obtener el idpedido
            let pedido = document.getElementsByClassName('pedido');

            // crear eventos
            for (let i = 0; i < ELIMINAR.length; i++) {

                // evento para el boton de restar
                RESTA[i].addEventListener('click', async event => {
                    event.preventDefault();
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
                        PEDIDO.append('ope', 2);
                        
                        const JSON = await request(CARRITO, 'modificarCantidad', PEDIDO);
                        if (JSON.status) {
                            cantidad[i].innerHTML = result; 
                        }        
                    }
                })

                SUMA[i].addEventListener('click', async event =>{
                    event.preventDefault();
                    if (existencias[i].textContent >= cantidad[i].textContent) {
                        

                    }
                })
            }


            break;
        default:
            break;
    }
}

// evento que se ejecuta cuando cargar la página
document.addEventListener('DOMContentLoaded', event => {
    event.preventDefault();
    cargarCarrito();
})