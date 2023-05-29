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
// input del buscador
const BUSCADOR = document.getElementById('buscador');


// Arreglo para guardar los datos de los comentarios
let comentarios = [];
// gestionador de existencias del producto
let existencias;
// contador
let contador = document.getElementById('contador');

// Método para cargar el articulo, se ejecuta cada vez que carga la página
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

// Método para carga los comentario de ese producto, se ejecuta cada vez que carga la página
const cargarComentarios = async () => {
    // limpiar contenido con los comentarios
    COMENTARIOS.innerHTML = ``;
    let producto = new FormData;
    producto.append('producto', getUrl('idproducto'));
    const JSON = await request(PRODUCTO, 'comentariosArticulo', producto);
    if (JSON.status) {
        comentarios = JSON.data;
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
// evento que se ejecuta cada vez que carga la página
document.addEventListener('DOMContentLoaded', async event => {
    event.preventDefault();
    cargarArticulo();
    cargarComentarios();
    cantidad();
    document.getElementById('input-buscar').setAttribute('placeholder', 'Buscar comentario');
})


// Método para validar los contadores para agregar o quitar cantidad al producto a comprar
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

// Evento que se ejecuta cada vez que se da click al boton para enviar comentario
FORMCOMENTARIO.addEventListener('submit', async event => {
    event.preventDefault();
    const COMENTARIO = new FormData(FORMCOMENTARIO);
    COMENTARIO.append('producto', getUrl('idproducto'));
    const JSON = await request('business/private/comentario.php', 'publicarComentario', COMENTARIO);
    if (JSON.status) {
        location.reload();
    } else {
        document.getElementById('msg-toast').innerText = JSON.excep;
        MSGTOAST.show();
    }
})

// Evento que se ejecuta cada vez que se escribe algo en el buscador
BUSCADOR.addEventListener('keyup', event => {
    event.preventDefault();
    // location.href = '#comentarios';

    // limpiar contenedor
    COMENTARIOS.innerHTML = ``;
    // document.getElementById('input-buscar').focus();

    // convertir a minusculas el texto escrito en el buscador
    let buscar = document.getElementById('input-buscar').value.toLowerCase();

    // verificar si el buscador no tiene datos
    if (buscar === '') {
        COMENTARIOS.innerHTML = ``;
        // para cargar comentarios por defecto
        cargarComentarios();
    } else {
        // recorrer los comentarios cargados del articulo
        for (const COMENTARIOVISTA of comentarios) {
            // convertir a minusculas los datos de los comentarios cargados
            let usuario = COMENTARIOVISTA.nombreusuario.toLowerCase();
            let comentario = COMENTARIOVISTA.comentario.toLowerCase();
            // compara sí es igual el dato en el buscador al cargado
            if (usuario.indexOf(buscar) !== -1 || comentario.indexOf(buscar) !== -1 ||
                COMENTARIOVISTA.fecha.indexOf(buscar) !== -1) {
                COMENTARIOS.innerHTML += `
                    <div class="comentario" id=${COMENTARIOVISTA.idcomentario}>
                        <span>${COMENTARIOVISTA.nombreusuario}</span>
                        <span>${COMENTARIOVISTA.comentario}</span>
                        <span>${COMENTARIOVISTA.fecha}</span>
                    </div>
                `;
                
            } else{
                
                COMENTARIOVISTA.innerText = `Comentario no encontrado`;
            }
        }
    }

})