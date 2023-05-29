// importación de modulos de controller
import { request, getUrl } from "../controller.js";

// constante para productos
const PRODUCTO = 'business/public/producto.php';
// constante con el directorio de la imagen
const DIR = '../../api/images/productos/';
// constante con el contenido de los comentarios
const COMENTARIOS = document.getElementById('comentarios-producto');
// instanciar toast para mostrar mensaje
const MSGTOAST = new bootstrap.Toast('#normal-toast');
// constante para hacer peticiones al carrito
const CARRITO = 'business/public/carrito.php';
// formulario para comentar
const FORMCOMENTARIO = document.getElementById('comentario-form');

// gestionador de existencias del producto
let existencias;
// contador
let contador = document.getElementById('contador');

const cargarArticulo = async () => {
    const DATO = new FormData;
    // adjuntar id del producto
    DATO.append('idproducto', getUrl('idproducto'));
    // hacer petición
    const JSON = await request(PRODUCTO, 'registro', DATO);
    // verificar estado de la petición
    if (JSON.status) {
        // cargar los datos
        document.getElementById('nombre').innerText = JSON.data.nombre;
        document.getElementById('categoria').innerText = JSON.data.categoria;
        document.getElementById('precio').innerText = '$' + JSON.data.precio;
        document.getElementById('marca').innerText = JSON.data.marca;
        document.getElementById('desc').innerText = JSON.data.descripcion;
        document.getElementById('contenedor-img-articulo').innerHTML = `
        <img src="${DIR + JSON.data.imagen}" width="100%" height="100%" alt="${JSON.data.nombre}" id="img-articulo">
        `;
        // contante para guardar las existencias del articulo 
        existencias = JSON.data.existencias;
    }
}

const cargarComentarios = async () => {
    // limpiar contenido con los comentarios
    COMENTARIOS.innerHTML = ``;
    let producto = new FormData;
    producto.append('producto', getUrl('idproducto'));
    const JSON = await request(PRODUCTO, 'comentariosArticulo', producto);
    if (JSON.status) {
        JSON.data.forEach(element => {
            COMENTARIOS.innerHTML += `
            <div class="comentario" id=${element.idcomentario}>
                <span>${element.nombreusuario}</span>
                <span>${element.comentario}</span>
                <span>${element.fecha}</span>
            </div>
            `;
        });
    }
}

document.addEventListener('DOMContentLoaded', async event => {
    event.preventDefault();
    cargarArticulo();
    cargarComentarios();
    cantidad();
})

let cantidad = () => {

    document.getElementById('restar').addEventListener('click', async event => {
        event.preventDefault();
        if (contador.textContent > 1) {
            contador.textContent = parseInt(contador.textContent) - 1;
        } else {
            document.getElementById('msg-toast').innerText = 'Cantidad minima permitida';
            MSGTOAST.show();
        }
    })

    document.getElementById('sumar').addEventListener('click', async event => {
        event.preventDefault();
        if (contador.textContent >= existencias) {
            document.getElementById('msg-toast').innerText = 'Cantidad maxima permitida';
            MSGTOAST.show();
        } else {
            contador.textContent = parseInt(contador.textContent) + 1;
        }
    })
}


// evento que detecta el click del boton para comprar
document.getElementById('comprar').addEventListener('click', async event => {
    event.preventDefault();
    // obtener los datos
    const ARTICULO = new FormData;
    // validar que la cantidad del contenido del contador no sea menor a 1
    // validar que la cantidad del contenido no sea mayor a las existencias
    if (parseInt(contador.textContent) <= existencias &&
        contador.textContent >= 1) {
        ARTICULO.append('producto', getUrl('idproducto'));
        ARTICULO.append('cantidad', parseInt(contador.textContent));
        const JSON = await request(CARRITO, 'validarPedido', ARTICULO);
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
    } else {
        document.getElementById('msg-toast').innerText = 'Cantidad no permitida';
        MSGTOAST.show();
    }
})

FORMCOMENTARIO.addEventListener('submit', async event => {
    event.preventDefault();
    const COMENTARIO = new FormData(FORMCOMENTARIO);
    COMENTARIO.append('producto', getUrl('idproducto'));
    const JSON = await request('business/private/comentario.php', 'publicarComentario', COMENTARIO);
    if (JSON.status) {
        location.reload();
    }else{
        document.getElementById('msg-toast').innerText = JSON.excep;
        MSGTOAST.show();
    }
})