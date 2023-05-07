/**
 * Contrlador de la página pública y privada
 */
export const API = 'http://localhost/ElectrodomesticosSV/api/';

export const notificacionURL = (type, msg, time, url = null) => {
    //obj con las opciones del mensaje
    let options = {
        title: '',
        text: msg,
        icon: '',
        closeOnClickOutside: false,
        closeOnEsc: false,
        button: {
            text: 'Accept',
            className: 'cyan'
        }
    };
    //convertir el type a letra minuscula

    //evaluar el tipo de mensaje
    switch (type.toLowerCase()) {
        case 'success':
            options.title = 'Success';
            options.icon = type;
            break;
        case 'error':
            options.title = 'Error';
            options.icon = type;
            break;
        case 'warning':
            options.title = 'Warning';
            options.icon = type;
            break;
        case 'info':
            options.title = 'Info';
            options.icon = type;
            break;
    }

    //verificar el tiempo que se desea
    //sino tiene valor se establece nulo
    (time) ? options.time = 3000 : options.time = null;
    //con el "swal" se muestra el mensaje en base a los que sale en el obj. options
    swal(options).then(() => {
        if (url) {
            //se redirecciona a la pagina indicada según proceso.
            location.href = url
        }
    });
}

export const notificacionAccion = (msg) => {
    return swal({
        title: 'Confirm',
        text: msg,
        icon: 'info',
        closeOnClickOutside: false,
        closeOnEsc: false,
        buttons: {
            cancel: {
                text: 'No',
                value: false,
                visible: true,
                className: 'read accent-1'
            },
            confirm: {
                text: 'Yes',
                value: true,
                visible: true,
                className: 'grey darken-1'
            }
        }
    });
}

/**
 *  Método async para enviar datos de los form's al backend y recibir datos del backend
 *  es un async await porque se espera la respues del backend
 *  url path donde los datos que se quiere intercambiar, action acción a realizar (create...),
 *  form (no necesario), recolecta la info. ingresada por el usuario
 */
export const request = async (api, accion, form = null) => {
    //const para establecer el método de la petición (POST o GET)   
    //Object es una clase nativa
    const REQ = [];
    //sí el form tienen datos es un envio, sino es un request para obtener datos
    //sí el form tiene datos es porque se ingresa info. sino es porque pide info.
    if (form) {
        REQ['method'] = 'post';
        REQ['body'] = form;
    } else {
        REQ['method'] = 'get';
    }
    try {
        //objeto de tipo URL
        const PATH = new URL(API + api);
        //parametro de la acción solicitada por el usuario
        PATH.searchParams.append('action', accion);
        //const para la respuesta es igual a que tiene que esperar la respuesta del servidor
        //enviandole la dirección del API y el request o petición de tipo "get" o "post"
        const RESPONSE = await fetch(PATH.href, REQ);
        // lo retornado convertirlo a JSON.
        return RESPONSE.json();
    } catch (error) {
        console.error(error);
    }
}



let id, value;
/**
 * Método para cargar select's en productos
 * filename donde ira a evaluar la acción
 * select tabla a cargar también tiene que ser el id del select
 * selected si se seleccionará uno (para cargar el valor ingresado en ese registro)
 * idselect sí se quieren cargar id's
 */
export const cargarSelect = async(filename, select, selected = null, idselect = false) => {
    //definir instancia de la clase FormData
    const DATA = new FormData;
    //agregar dato al post
    DATA.append('object', select);
    //obtener los datos de la petición
    const JSON = await request(filename, 'cargar', DATA);
    //inicializar o reiniciar lista para después asignar datos
    let list = '';
    if (JSON.status) {
        //si existen valores
        //agregar a la lista
        list += `<option disabled selected>Seleccionar</option>`;
        //recorrer los datos obtenidos
        JSON.data.forEach(element => {
            //obtener el valor del id
            id = Object.values(element)[0];
            // obtener la otra columna con datos 
            value = Object.values(element)[1];

            if (idselect) {
                // verificar si el id es del valor ingresado anteriormente (update)
                (id != selected) ? list += `<option value="${id}">${id}</option>` : list += `<option value="${id}" selected>${id}</option>`;
            } else {
                (id != selected) ? list += `<option value="${id}">${value}</option>` : list += `<option value="${id}" selected>${value}</option>`;
            }

        });
    } else {
        // si no existen datos u ocurre algún error
        option = `<option>No existen opciones</option>`;
    }
    //agregar las opciones
    document.getElementById(select).innerHTML = list;
}