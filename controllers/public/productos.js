// importar modulos
import { request } from "../controller.js";

// servidor donde hacer peticiones de productos, carrito
const PRODUCTOS = 'business/public/producto.php';
const CARRITO = 'business/public/carrito.php';
// obtener elemento toast e inicializarlo
const TOAST = new bootstrap.Toast('#toast');
const TOASTACCION = new bootstrap.Toast('#toast-login');
const MSGTOAST = new bootstrap.Toast('#normal-toast');
// contenido donde cargan los productos
const CONTAINER = document.getElementById('contenedor-productos')
// directorio del api donde se encuentran las imagenes de los productos
const DIR = '../../api/images/productos/';

// evento que se ejecuta cada vez que carga la página
document.addEventListener('DOMContentLoaded', async event => {
    event.preventDefault();
    // limpiar contenedor
    CONTAINER.innerHTML += ``;
    const JSON = await request(PRODUCTOS, 'productos');
    if (JSON.status) {
        // TOAST.show();
        let i = 0;
        JSON.data.forEach(element => {
            CONTAINER.innerHTML += `
            <div class="col-md-3">
                <div class="card producto">
                    <img src="${DIR + element.imagen}" class="card-img-top" alt="${element.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${element.nombre}</h5>
                        <p class="card-text">${element.descripcion}.</p>
                        <a class="btn btn-secondary ver" id="${element.idproducto}">Ver</a>
                        <a class="btn btn-secondary comprar">Comprar</a>

                    </div>
                </div>        
            </div>
            `;
        });
        // evento para mostrar articulo
        const VER = document.getElementsByClassName('ver');

        // obtener los botones de comprar
        const COMPRAR = document.getElementsByClassName('comprar');


        // recorer los botones de la card
        for(let i = 0; i < VER.length; i++){
            // crear evento cuando detecte click en los botones especificados
            VER[i].addEventListener('click', () => {
                // encodeURIComponent valida dato valido para la URL
                const URL = 'articulo.html'+ '?idproducto=' + encodeURIComponent(VER[i].id);
                // console.log(VER[i].id);
                // redireccionar a la página con el producto seleccionado
                window.location.href = URL;
            });

            COMPRAR[i].addEventListener('click', async event => {
                event.preventDefault();
                const ID = new FormData;
                ID.append('producto', VER[i].id);
                // cantidad por defecto +1
                ID.append('cantidad', 1);
                const JSON = await request(CARRITO, 'validarPedido', ID);
                switch (JSON.status) {
                    case -1:
                        document.getElementById('login').addEventListener('click', () => {
                            location.href = 'login.html';
                        })
                        TOASTACCION.show();
                        break;
        
                    case 1:                        
                        document.getElementById('msg-toast').innerText = JSON.msg;
                        MSGTOAST.show();
                        break;
                    default:
                        break;
                }
            })
        }
        
        
    } else {

    }
})

