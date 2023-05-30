import { request } from "../controller.js";

// archivo del servidor 
const HISTORIAL = 'business/public/carrito.php';
// contendor donde cargarán los datos
const CONTENIDO = document.getElementById('tbody-historial');
// columna donde cargan los switch
// obtener cada columna de la tabla, para ir agregando los switch del estado
const COL = document.querySelectorAll('tb-switch')


// evento para cargar el historial
let cargar = async () => {
    CONTENIDO.innerHTML = ``;
    const JSON = await request(HISTORIAL, 'historial');
    switch (JSON.status) {
        case -1:
            document.getElementById('login').addEventListener('click', () => {
                location.href = 'login.html';
            });
            TOASTACCION.show();
            break;

        case 0:
            document.getElementById('msg-toast').innerText = JSON.msg;
            MSGTOAST.show();
            break;

        case 1:
            JSON.data.forEach(element => {
                CONTENIDO.innerHTML += `
                <td class="id">${element.idfactura}</td>
                <td>${element.fecha}</td>
                <td>${element.productos}</td>
                <td>$${element.total}</td>
                <td class="tb-switch">
                    ${(element.estado === 1) ?

                        COL.innerHTML = `<span class="btn btn-success comprado">Comprado</span>`
                        :
                        COL.innerHTML = `<span class="btn btn-danger pendiente">Pendiente</span>`
                    }
                </td>                    
                <td>
                    <button type="button" class="btn btn-secondary ver" id="${element.idfactura}">Ver</button>
                </td>
                `;

                // obtener los ids
                const ID = document.getElementsByClassName('id')
                // obtener los botones pendientes
                const PENDIENTE = document.getElementsByClassName('pendiente');
                // obtener los botones para ver los pedidos de la factura
                const VER = document.getElementsByClassName('ver');

                // recorrer los botones encontrados para crearles evento a cada uno
                for (let i = 0; i < ID.length; i++) {

                    if (PENDIENTE[i]) {

                        PENDIENTE[i].addEventListener('click', async event => {
                            event.preventDefault();
                            const JSON = await request('business/public/carrito.php', 'facturaActual');
                            switch (JSON.status) {
                                case -1:
                                    document.getElementById('login').addEventListener('click', () => {
                                        location.href = 'login.html';
                                    })
                                    TOASTACCION.show();
                                    break;

                                case 0:
                                    document.getElementById('msg-toast').innerText = JSON.excep;
                                    MSGTOAST.show();
                                    break;
                                // redirecionar a la factura pendiente
                                case 1:
                                    // encodeURIComponent valida dato valido para la URL
                                    const URL = 'carrito.html' + '?idfactura=' + encodeURIComponent(VER[i].id);
                                    // console.log(VER[i].id);
                                    // redireccionar a la página con el producto seleccionado
                                    window.location.href = URL;
                                    break;
                                default:
                                    break;
                            }
                        });
                    }


                    VER[i].addEventListener('click', () => {
                        // verificar las facturas pendientes
                        // para enviar algo que valide que 
                        // cuando se haya efectuado la compra
                        // no volver a comprar
                        // encodeURIComponent valida dato valido para la URL
                        const URL = 'carrito.html' + '?idfactura=' + encodeURIComponent(VER[i].id);
                        // console.log(VER[i].id);
                        // redireccionar a la página con el producto seleccionado
                        window.location.href = URL;
                    });

                }
            });

            break;
        default:
            break;
    }
}

document.addEventListener('DOMContentLoaded', async event => {
    event.preventDefault();
    cargar();
})