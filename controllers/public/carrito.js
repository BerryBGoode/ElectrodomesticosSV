// importando modulo para hacer peticiones
import { request } from "../controller.js";

// archivo para hacer las peticiones al servidor
const CARRITO = 'business/public/carrito.php';


// método para cargar los datos en el carrito
let cargarCarrito = async () => {
    
}

// evento que se ejecuta cuando cargar la página
document.addEventListener('DOMContentLoaded', event => {
    event.preventDefault();
    cargarCarrito();
})