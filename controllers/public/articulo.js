// importación de modulos de controller
import { request, getUrl} from "../controller.js";

// constante para productos
const PRODUCTO = 'business/public/producto.php';
// constante con el directorio de la imagen
const DIR = '../../api/images/productos/';
// constante con el contenido de los comentarios
const COMENTARIOS = document.getElementById('comentarios-producto');

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
        document.getElementById('precio').innerText = JSON.data.precio;
        document.getElementById('marca').innerText = JSON.data.marca;
        document.getElementById('desc').innerText = JSON.data.descripcion;
        document.getElementById('contenedor-img-articulo').innerHTML = `
        <img src="${DIR + JSON.data.imagen}" width="100%" height="100%" alt="${JSON.data.nombre}" id="img-articulo">
        `;
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
})