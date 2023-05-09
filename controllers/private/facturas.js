// importar modulos (métodos) del controller
import { request, cargarSelect, notificacionAccion, notificacionURL } from '../controller.js';
import { USUARIO } from "./usuarios.js";

// archivo donde van las peticiones 
const FACTURA = 'business/private/factura.php';
// iniciarliar modal
const MODAL = new bootstrap.Modal(document.getElementById('Modal'));
// formulario para manupular registros
const FORM = document.getElementById('form-factura');
// tabla en facturas
const TABLA = document.getElementById('tbody-factura');
// columa con switch para cambiar estado
const COL = document.querySelectorAll('.tb-switch');


let accion, estado;

document.getElementById('btn-agregar').addEventListener('click', async () => {
    cargarSelect(USUARIO, 'usuarios')
});

// evento submit para agregar o actualizar un registro
FORM.addEventListener('submit', async (event) => {
    event.preventDefault();
    // validar campos vacios
    if (document.getElementById('apellidos').value && document.getElementById('nombres').value) {

        // obtener datos del formulario
        const DATOS = new FormData(FORM);
        // hacer petición
        const JSON = await request(FACTURA, 'crear', DATOS);
        if (JSON.status) {
            FORM.reset();
            MODAL.hide();
            cargarTabla();
            notificacionURL('success', JSON.msg, true);
        } else {
            notificacionURL('error', JSON.excep, false);
        }
    }

});

// crear evento para cuando se cambie la opción seleccionada
// del <select>
document.getElementById('usuarios').addEventListener('change', async (event) => {
    event.preventDefault();
    // buscar los datos del cliente seleccionado:

    // obtener los datos del valor seleccionado
    const DATOS = new FormData;
    DATOS.append('idusuario', document.getElementById('usuarios').value);
    // hacer la petición
    // el await es importante
    const JSON = await request(FACTURA, 'getCliente', DATOS);
    // verificar sí hubo un problema al hacer la petición    
    if (JSON.status) {
        // asignar los valore recuperados a los inputs
        document.getElementById('nombres').value = JSON.data.nombre;
        document.getElementById('apellidos').value = JSON.data.apellido;
    } else {
        notificacionURL('error', JSON.excep, false);
    }
});

const cargarTabla = async () => {
    // limipiar los valores de la tabla
    TABLA.innerHTML = ``;
    // hacer petición
    const JSON = await request(FACTURA, 'cargar');
    console.log(JSON)
    if (JSON.status) {

        JSON.data.forEach(element => {
            TABLA.innerHTML += `<tr>
                <td>${element.idfactura}</td>
                <td class="hide">${element.idcliente}</td>
                <td>${element.nombre}</td>
                <td>${element.apellido}</td>
                <td>${element.correo}</td>
                <td>${element.fecha}</td>
                <td class="tb-switch">
                    ${(element.estado == 1) ?
                    COL.innerHTML = `<div class="form-check form-switch"> 
                            <input class="form-check-input estado" name="estado" id="estado" type="checkbox" id="estado" checked> 
                        </div>`
                    :
                    COL.innerHTML = `<div class="form-check form-switch"> 
                            <input class="form-check-input estado" name="estado" id="estado" type="checkbox" id="estado"> 
                        </div>`
                }
                </td>
                <td>
                    <form action="pedidos.html" method="get">
                        <input type="number" name="facturaid" class="hide" id="facturaid" value="${element.idfactura}">
                        <button type="submit" class="btn btn-secondary">Ver</button>
                    </form>
                </td>
                <td>
                    <!-- boton para actualizar -->                     
                    <button type="submit" class="btn btn-secondary actualizar" data-bs-toggle="modal" data-bs-target="#Modal" value="${element.idfactura}">Actualizar</button>                            
                    <!-- boton para eliminar -->
                    <button class="btn btn-danger eliminar" value="${element.idfactura}">Eliminar</button>
                </td>
            </tr>`;
        });
        // obtener todos los botones en la tabla
        const ACTUALIZAR = document.getElementsByClassName('actualizar');
        // recorrer los botones de actualizar
        for(let i= 0; i < ACTUALIZAR.length; i++){
            ACTUALIZAR[i].addEventListener('click', async (event) =>{
                event.preventDefault();
                const DATO = new FormData;
                DATO.append('idfactura', ACTUALIZAR[i].value);
                const JSON = await request(FACTURA, 'registro', DATO);
                if (JSON.status) {
                    FORM.reset();
                    document.getElementById('idfactura').value = JSON.data.idfactura;
                    cargarSelect(USUARIO, 'usuarios', JSON.data.idcliente);
                    document.getElementById('nombres').value = JSON.data.nombre;
                    document.getElementById('apellidos').value = JSON.data.apellido;
                    document.getElementById('fecha').value = JSON.data.fecha;
                } else {
                    notificacionURL('error', JSON.excep, false);
                }
            })
        }
        // switch para poder modificar estado
        const SWITCH = document.getElementsByName('estado');
        // recorrer todos los input-switch encontrados    
        for (let i = 0; i < SWITCH.length; i++) {
            // crear el evento change a cada uno
            SWITCH[i].addEventListener('change', async (event) => {
                event.preventDefault();
                const DATO = new FormData;
                if (SWITCH[i].checked) {
                    estado = 1;
                } else {
                    estado = 2;
                }
                DATO.append('estado', estado);
                DATO.append('idfactura', ACTUALIZAR[i].value);
                const JSON = await request(FACTURA, 'actualizarEstado', DATO);
                if (!JSON.status) {
                    notificacionURL('error', JSON.excep, false);
                }
            })
        }
        // obtener botones para eliminar
        const ELIMINAR = document.getElementsByClassName('eliminar');
        for (let i = 0; i < ELIMINAR.length; i++) {
            ELIMINAR[i].addEventListener('click', async (event) => {
                event.preventDefault();
                accion = await notificacionAccion('Desea eliminar esta factura? \n Revisar cuantos pedidos tiene esta factura');
                if (accion) {
                    const DATO = new FormData;
                    DATO.append('idfactura', ELIMINAR[i].value);
                    const JSON = await request(FACTURA, 'eliminar', DATO);
                    if (JSON.status) {
                        cargarTabla();
                        notificacionURL('success', JSON.msg, true);
                    } else {
                        notificacionURL('error', JSON.excep, false);
                    }
                }
            })
        }
    } else {
        notificacionURL('error', JSON.excep, false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarTabla();
})

