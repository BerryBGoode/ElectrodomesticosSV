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
                <td class="col-grap">${element.fecha}</td>
                <td>${element.nombre}</td>
                <td>${element.precio}</td>
                <td>${element.cantidad}</td>
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