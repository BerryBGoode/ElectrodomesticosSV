// importación de modulos de controller
import {request, notificacionAccion, notificacionURL, cargarSelect } from '../controller.js';


// archivo donde se hacen las peticiones
const PEDIDO = 'business/private/pedido.php';
const PRODUCTO = 'business/private/producto.php'
// formulario para obtener datos del pedido
const FORM = document.getElementById('form-orden');
// inicializar MODAL
const MODAL = new bootstrap.Modal(document.getElementById('Modal'));

let accion, estado;

// obtener el id de la factura seleccionada
const getFacturaURL = () => {
    const URL = new URLSearchParams(window.location.search);
    const VALUE = URL.get('facturaid');
    return VALUE;
}

// evento async-await que se ejecuta cada vez que carga la página
document.addEventListener('DOMContentLoaded', () =>{
    cargarSelect(PRODUCTO, 'productos');
    // desabilitar
    document.getElementById('cantidad').readOnly = true;
})

// método para obtener la cantidad actual de existencias en producto seleccionado
const obtenerExistencias = async() => {
    // obtener valor del <select>
    const DATO= new FormData;
    DATO.append('idproducto', document.getElementById('productos').value);
    const JSON = await request(PRODUCTO,'registro', DATO);
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

// evento para detectar cuando se envia datos del formulario 
// agregar y actualizar
FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (document.getElementById('cantidad').value !== '') {
        // verificar sí el input para id esta lleno para identificar la acción
        (document.getElementById('idpedido').value) ? accion = 'actualizar' : accion = 'guardar';
        // obtener los datos
        const DATOS = new FormData(FORM);
        DATOS.append('idfactura', getFacturaURL());
        const JSON = await request(PEDIDO, accion, DATOS);
        if (JSON.status) {
            FORM.reset();
            MODAL.hide();
            notificacionURL('success', JSON.msg, true);
        } else {
            notificacionURL('error', JSON.excep, false);
        }
    }

})