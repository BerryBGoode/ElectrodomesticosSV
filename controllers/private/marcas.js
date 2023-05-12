// importanción de modulos de controller
import { notificacionURL, request, notificacionAccion } from '../controller.js';

// body de la tabla marca
const TBMARCA = document.getElementById('tbody-marca');

// obtener componentes html para realizar procesos
const FORM = document.getElementById('form-marca');

let accion;

// inicializar el modal
const MODAL = new bootstrap.Modal(document.getElementById('Modal'));

// const para preparar el modal para agregar
const AGREGAR = document.getElementById('btn-agregar');


// boton para cambiar texto según proceso
const PROCESO = document.getElementById('proceso');

// formular para buscar
const SEARCH = document.getElementById('buscador');

// api para hacer petición
export const MARCA = 'business/private/marca.php';

// evento que se ejecuta cada vez que carga el DOM
document.addEventListener('DOMContentLoaded', async () => {
    cargarTabla();

})

// evento async-await para guardar y actualizar datos
FORM.addEventListener('submit', async (event) => {
    // evitar la recarga de la página
    event.preventDefault();

    // verificar sí el input que carga idmarca está vacio o con algún dato
    document.getElementById('idmarca').value ? accion = 'actualizar' : accion = 'crear';
    // obtener los datos y guardar en instancia
    const DATA = new FormData(FORM);
    // const para hacer la patición
    const JSON = await request(MARCA, accion, DATA);
    if (JSON.status) {
        cargarTabla();
        notificacionURL('success', JSON.msg, true);
        MODAL.hide();
    } else {
        notificacionURL('error', JSON.excep, false);
    }
})

// crear evento para preparar modal para agregar
AGREGAR.addEventListener('click', async (event) => {
    event.preventDefault();
    PROCESO.innerText = `Agregar`;
})


// asycn-await para cargar la tabla de marcas
const cargarTabla = async () => {

    // elimiar los valores anteriores que tenia BODY
    TBMARCA.innerHTML = ``;
    // hacer la petición
    const JSON = await request(MARCA, 'cargar');
    // verificar el estado de la petición
    if (JSON.status) {
        // recorrer datos
        JSON.data.forEach(element => {
            // y por cada fila recorrida agregar a la tabla
            TBMARCA.innerHTML += `<tr>
                <td>${element.marca}</td>
                <td>${element.productos}</td>                
                <td>
                    <!-- boton para actualizar -->
                    <button class="btn btn-secondary actualizar" data-bs-toggle="modal" data-bs-target="#Modal" value="${element.idmarca}">Actualizar</button>
                    <!-- boton para eliminar -->
                    <button class="btn btn-danger eliminar" value="${element.idmarca}">Eliminar</button>
                </td>
            </tr>`;
        });
        // const con los botones para actualizar
        const ACTUALIZAR = document.getElementsByClassName('actualizar')

        // recorrer los inputs encontrados
        for (let i = 0; i < ACTUALIZAR.length; i++) {
            // a cada input crearle evento click
            ACTUALIZAR[i].addEventListener('click', async (event) => {
                // evitar comportamiento default
                event.preventDefault();
                // instanciar la clase formData
                const DATA = new FormData;
                // adjuntar el valor del id
                DATA.append('idmarca', ACTUALIZAR[i].value);
                const JSON = await request(MARCA, 'cargaRegistro', DATA);
                if (JSON.status) {
                    FORM.reset();
                    PROCESO.innerText = `Actualizar`;
                    document.getElementById('idmarca').value = JSON.data.idmarca;
                    document.getElementById('marca').value = JSON.data.marca;
                } else {

                    notificacionURL('error', JSON.excep, false);
                }
            })
        }

        // const con los botones para eliminar
        const ELIMINAR = document.getElementsByClassName('eliminar');

        for (let i = 0; i < ELIMINAR.length; i++) {
            ELIMINAR[i].addEventListener('click', async (event) => {
                // esperar la respuesta del usuario
                let confirmacion = await notificacionAccion('Dessea eliminar esta marca, \n Revisar cantidad de productos pertenecientes a esta marca');
                if (confirmacion) {
                    // evitar comportamiento default
                    event.preventDefault();
                    // instancia de la clase formData para adjuntar id 
                    const DATA = new FormData;
                    // adjuntar y igualar al valor que tiene el boton para eliminar (id marca)
                    DATA.append('idmarca', ELIMINAR[i].value);
                    // hacer la petición
                    const JSON = await request(MARCA, 'eliminar', DATA);
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
        notificacionURL('info', JSON.excep, false);
    }
}

/**
 * async-await método para buscar en tiempo real
 */
const buscador = async evt => {
    // evitar comportamiento por defecto
    evt.preventDefault();
    const JSON = await request(MARCA, 'cargar');
    if (!JSON) {
        notificacionURL('error', JSON.excep, false);
    } else {
        TBMARCA.innerHTML = ``;
        let search = document.getElementById('input-buscar').value.toLowerCase();
        if (search === '' || search === ' ') {
            TBMARCA.innerHTML = ``;
            cargarTabla();
        } else {
            TBMARCA.innerHTML = ``;
            for (let marcas of JSON.data) {
                let marca = marcas.marca.toLowerCase();
                if (marca.indexOf(search) !== -1) {
                    TBMARCA.innerHTML += `<tr>
                    <td>${marcas.marca}</td>
                    <td>${marcas.productos}</td>                
                    <td>
                        <!-- boton para actualizar -->
                        <button class="btn btn-secondary actualizar" data-bs-toggle="modal" data-bs-target="#Modal" value="${marcas.idmarca}">Actualizar</button>
                        <!-- boton para eliminar -->
                        <button class="btn btn-danger eliminar" value="${marcas.idmarca}">Eliminar</button>
                    </td>
                </tr>`;
                }
            }
            // const con los botones para actualizar
            const ACTUALIZAR = document.getElementsByClassName('actualizar')

            // recorrer los inputs encontrados
            for (let i = 0; i < ACTUALIZAR.length; i++) {
                // a cada input crearle evento click
                ACTUALIZAR[i].addEventListener('click', async (event) => {
                    // evitar comportamiento default
                    event.preventDefault();
                    // instanciar la clase formData
                    const DATA = new FormData;
                    // adjuntar el valor del id
                    DATA.append('idmarca', ACTUALIZAR[i].value);
                    const JSON = await request(MARCA, 'cargaRegistro', DATA);
                    if (JSON.status) {
                        FORM.reset();
                        PROCESO.innerText = `Actualizar`;
                        document.getElementById('idmarca').value = JSON.data.idmarca;
                        document.getElementById('marca').value = JSON.data.marca;
                    } else {

                        notificacionURL('error', JSON.excep, false);
                    }
                })
            }

            // const con los botones para eliminar
            const ELIMINAR = document.getElementsByClassName('eliminar');

            for (let i = 0; i < ELIMINAR.length; i++) {
                ELIMINAR[i].addEventListener('click', async (event) => {
                    // esperar la respuesta del usuario
                    let confirmacion = await notificacionAccion('Dessea eliminar esta marca, \n Revisar cantidad de productos pertenecientes a esta marca');
                    if (confirmacion) {
                        // evitar comportamiento default
                        event.preventDefault();
                        // instancia de la clase formData para adjuntar id 
                        const DATA = new FormData;
                        // adjuntar y igualar al valor que tiene el boton para eliminar (id marca)
                        DATA.append('idmarca', ELIMINAR[i].value);
                        // hacer la petición
                        const JSON = await request(MARCA, 'eliminar', DATA);
                        if (JSON.status) {
                            cargarTabla();
                            notificacionURL('success', JSON.msg, true);
                        } else {
                            notificacionURL('error', JSON.excep, false);
                        }
                    }

                })
            }
        }
    }
}

SEARCH.addEventListener('submit', async (event) => buscador(event));
SEARCH.addEventListener('keyup', async (event) => buscador(event));