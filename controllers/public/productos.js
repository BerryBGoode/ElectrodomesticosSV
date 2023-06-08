// importar modulos
import { request } from "../controller.js";

// servidor donde hacer peticiones de productos, carrito
const PRODUCTOS = 'business/public/producto.php';
const CARRITO = 'business/public/carrito.php';

const MSGTOAST = new bootstrap.Toast('#normal-toast');
// contenido donde cargan los productos
const CONTAINER = document.getElementById('contenedor-productos')
// directorio del api donde se encuentran las imagenes de los productos
const DIR = '../../api/images/productos/';
// input del buscador
const BUSCADOR = document.getElementById('buscador');
// arreglo para guardar los productos cargados
let datos = [];

let cargar = async (accion) => {
    // limpiar contenedor
    CONTAINER.innerHTML += ``;
    const JSON = await request(PRODUCTOS, accion);
    if (JSON.status) {
        // TOAST.show();
        // asignar valores al arreglo para podes utilizar en el buscador
        datos = JSON.data;

        JSON.data.forEach(element => {
            CONTAINER.innerHTML += `
            <div class="col-md-3">
                <div class="card producto">
                    <img src="${DIR + element.imagen}" class="card-img-top" alt="${element.nombre}">
                    <div class="card-body">
                        <div class="datos">
                            <h5 class="card-title">${element.nombre}</h5>
                            <p class="card-text">${element.categoria}</p>
                            <p class="card-text">${element.marca}</p>
                            <p class="card-text">$${element.precio}</p>
                        </div>
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
        for (let i = 0; i < VER.length; i++) {
            // crear evento cuando detecte click en los botones especificados
            VER[i].addEventListener('click', () => {
                // encodeURIComponent valida dato valido para la URL
                const URL = 'articulo.html' + '?idproducto=' + encodeURIComponent(VER[i].id);
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
        document.getElementById('msg-toast').innerText = 'No se encontraron producto disponibles';
        MSGTOAST.show();
    }

}

// evento que se ejecuta cada vez que carga la página
document.addEventListener('DOMContentLoaded', async event => {
    event.preventDefault();
    // verificar la página la cual esta cargando
    // es de productos sino es de destacados
    // para cambiar la acción al cargar (CARGAR DESTACADOS)
    (location.href.indexOf('productos') !== -1) ? cargar('productos') : cargar('destacados')
    // cargar('productos');
})

// método para validar funcionamiento del buscador
let buscador = () => {
    // variable para indetificar si se encontro el dato
    let found;
    // limpiar el contendor con los productos
    CONTAINER.innerHTML = ``;
    // convertir a minusculas los valores del input
    let input = document.getElementById('input-buscar').value.toLowerCase();
    // verificar si el input esta vacío
    if (input === '') {
        CONTAINER.innerHTML = ``;
        // cargar productos por defecto
        // verificar la página la cual esta cargando
        // es de productos sino es de destacados
        // para cambiar la acción al cargar (CARGAR DESTACADOS)
        (location.href.indexOf('productos') !== -1) ? cargar('productos') : cargar('destacados')
    } else {

        // recorrer los datos del arreglo con los productos
        for (const PRODUCTOVISTA of datos) {
            //convertir los datos de los productos a minusculas
            // solamete los datos alfabeticos
            let nombre = PRODUCTOVISTA.nombre.toLowerCase();
            let categoria = PRODUCTOVISTA.categoria.toLowerCase();
            let marca = PRODUCTOVISTA.marca.toLowerCase();
            // let descripcion = PRODUCTOVISTA.descripcion.toLowerCase();
            if (nombre.indexOf(input) !== -1 || categoria.indexOf(input) !== -1 ||
                marca.indexOf(input) !== -1 || /*descripcion.indexOf(input) !== -1 || */
                PRODUCTOVISTA.precio.indexOf(input) !== -1) {

                CONTAINER.innerHTML += `
                    <div class="col-md-3">
                        <div class="card producto">
                            <img src="${DIR + PRODUCTOVISTA.imagen}" class="card-img-top" alt="${PRODUCTOVISTA.nombre}">
                            <div class="card-body">
                                <div class="datos">
                                    <h5 class="card-title">${PRODUCTOVISTA.nombre}</h5>
                                    <p class="card-text">${PRODUCTOVISTA.categoria}.</p>
                                    <p class="card-text">${PRODUCTOVISTA.marca}.</p>
                                    <p class="card-text">$${PRODUCTOVISTA.precio}.</p>
                                </div>
                                <a class="btn btn-secondary ver" id="${PRODUCTOVISTA.idproducto}">Ver</a>
                                <a class="btn btn-secondary comprar">Comprar</a>
                            </div>
                        </div>        
                    </div>
                    `;

                // identificar que se encontraron datos
                found = true;
            }
        }
        // verificar si encontraron datos
        if (!found) {
            // mostrar mensaje de que no encontro el dato
            CONTAINER.innerText = 'Producto no encontrado';
        }
    }
}

BUSCADOR.addEventListener('keyup', event => {
    event.preventDefault();
    buscador();
})