// importación de modulos de controller
import {request, notificacionAccion, notificacionURL, cargarSelect } from '../controller.js';


// archivo donde se hacen las peticiones
const ORDEN = 'business/private/pedido.php';
const PRODUCTO = 'business/private/producto.php'
// evento async-await que se ejecuta cada vez que carga la página
document.addEventListener('DOMContentLoaded', () =>{
    cargarSelect(PRODUCTO, 'productos');
    document.getElementById('cantidad').readOnly = true;
})

// método para obtener la cantidad actual de existencias en producto seleccionado
const obtenerExistencias = async() => {
    // obtener valor del <select>
    const DATO= new FormData;
    DATO.append('idproducto', document.getElementById('productos').value);
    const JSON = await request(PRODUCTO,'registro', DATO);
    console.log(JSON)
    if (JSON.status) {        
        // agregar limite maximo al input de cantidad
        document.getElementById('cantidad').setAttribute('max', JSON.data.existencias);
        // habilitar
        document.getElementById('cantidad').readOnly = false;
    } else {
        notificacionURL('error', JSON.excep, false);
    }
}

// evento que se ejecuta cada vez que se selecciona un producto
document.getElementById('productos').addEventListener('change', async (event) => {
    
    // obtener las existencias que tiene ese producto
    obtenerExistencias();
})

