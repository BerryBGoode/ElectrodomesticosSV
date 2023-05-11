// importar modulos 
import { request, cargarSelect, notificacionAccion, notificacionURL } from "../controller.js";
import { USUARIO } from './usuarios.js'

const PRODUCTO = 'business/private/producto.php';
const FORM = document.getElementById('form-comentario')
const COMENTARIO = 'business/private/comentario.php';

let accion, estado;

document.addEventListener('DOMContentLoaded', () => {
    cargarSelect(USUARIO, 'usuarios');
    cargarSelect(PRODUCTO, 'productos')
    document.getElementById('proceso').innerText = 'Agregar';
    document.getElementById('pedidos').readOnly = true;
})

FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (document.getElementById('comentario').value !== '') {
        document.getElementById('idcomentario').value ? accion = 'actualizar' : accion = 'guardar';
        const DATOS = new FormData(FORM)
        DATOS.append('comentario', document.getElementById('comentario').value)
        const JSON = await request(COMENTARIO, accion, DATOS);
        if (JSON.status) {
            notificacionURL('success', JSON.msg, true);
        } else {
            notificacionURL('error', JSON.excep, false);
        } 
    }
})

const cargarPedidos = async () => {        
    if (document.getElementById('usuarios').value >= 1 && document.getElementById('productos').value >= 1) {
        const ID = new FormData;
        ID.append('usuarios', document.getElementById('usuarios').value);
        ID.append('productos', document.getElementById('productos').value);
        const JSON = await request(COMENTARIO, 'cargarPedidos', ID);
        
        if (JSON.status) {

        }else{
            notificacionURL('info', JSON.excep, false);
        }
    }
}

// método para obtener pedidos en base al cliente, y factura
document.getElementById('usuarios').addEventListener('change', async () => {
    cargarPedidos();
})

document.getElementById('productos').addEventListener('change', async () => {
    cargarPedidos();
})

