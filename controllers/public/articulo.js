// importación de modulos de controller
import { request } from "../controller.js";

// constante para productos
const PRODUCTO = 'business/public/producto.php';

const getUrl = parametro => {
    // instanciar clase para obtener parametros de busqueda del la url
    const URL = new URLSearchParams(window.location.search);
    // obtener el valor del parametro especificado
    const ID = URL.get(parametro);
    return ID;
}

document.addEventListener('DOMContentLoaded', async event => {
    event.preventDefault();
    // console.log(getUrl('idproducto'));
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
    }

})