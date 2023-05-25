import { request } from "../controller.js";

// obtener el header para agregar nav
const HEADER = document.querySelector('header');
// obtener el footer para agregar contenido
const FOOTER = document.querySelector('footer');

// toast para mandar mensaje a usuario para iniciar sesión
const TOASTACCION = new bootstrap.Toast('#toast-login');

// verificar sí es usada la etiqueta header
if (HEADER) {
    HEADER.innerHTML = `
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <div class="container-fluid">

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse" aria-expanded="false" aria-label="a">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse row-reverse" id="navbarCollapse">
                <ul class="navbar-nav me-auto mb-2 mb-md-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="../public/">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="productos.html">Productos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="destacados.html">Destcados</a>
                    </li>
                    <!-- verificar sí se ha iniciado sesión y según eso inicar sesión o cuenta -->
                    <li class="nav-item dropdown active" id="estado-cuenta"></li>
                </ul>
                <form class="d-flex" method="get" id="buscador">
                    <input class="form-control me-2" id="input-buscar" type="search" placeholder="Buscar"
                        aria-label="Buscar">
                    <button class="btn btn-outline-secondary" type="submit">Buscar</button>
                </form>
            </div>
        </div>
    </nav>

    <!-- Aquí estan los toast-->
    <div class="toast" id="toast-confirm" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-body">
            Desea cerrar sesión?
                <a class="btn btn-secondary btn-sm" id="confirm-out">Ok</a>                
            </div>
        </div>
    </div>

    <div class="toast align-items-center" id="normal-toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
            <div class="toast-body" id="msg-toast"></div>
        </div>
    </div>

    `;
    // función para cerrar sesión
    document.getElementById('confirm-out').addEventListener('click', async event => {
        event.preventDefault();
        const JSON = await request('business/public/usuario.php', 'logOutCliente');
        if (JSON.status) {
            setTimeout(() => {
                location.href = '../../views/public/';
            }, 1500);
        }
    })
}

// verificar sí es usada la etiqueta footer
if (FOOTER) {
    FOOTER.innerHTML = `<hr class="featurette-divider">
    <!-- FOOTER -->
    <div class="container">
        <p>ElectrodomesticosSV &copy; 2017–2021 Company, Inc. &middot;
    </div>`;
}



const CUENTA = document.getElementById('estado-cuenta');
// método para validar estado de cuenta

// instanciar toast para mostrar mensaje
const MSGTOAST = new bootstrap.Toast('#normal-toast');
// toast para mensaje de confirmación
const TOASTCONFIRM = new bootstrap.Toast('#toast-confirm');


const cargarNav = async () => {
    const JSON = await request('business/public/usuario.php', 'validarEstadoCuenta');
    switch (JSON.status) {
        case 1:
            CUENTA.innerHTML = `<a class="active nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    ${JSON.data}
                                </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <li><a class="dropdown-item" href="#">Account</a></li>
            <li><a class="dropdown-item" id="carrito">Carrito</a></li>
            <li><a class="dropdown-item" href="#">Pedidos</a></li>
            <li><hr class="dropdown-divider"></li>
            <li id="logOut"><a class="dropdown-item">Cerrar Sesión</a></li>
          </ul>`;
            break;

        case -1:
            CUENTA.innerHTML = `<a class="nav-link active" aria-current="page" href="login.html">Iniciar Sesión</a>`;
            break;
        default:
            break;
    }

    if (document.getElementById('logOut')) {
        // función para confirma cerrar sesión
        document.getElementById('logOut').addEventListener('click', () => {
            // validar confirmación
            TOASTCONFIRM.show();
        });
    }
    // verificar sí agregar esa acción
    // si el usuario a iniciado sesión
    if (document.getElementById('carrito')) {
        // acción para acceder al carrito
        // validando antes sí existe una sesión, una factura pendiente, o no
        document.getElementById('carrito').addEventListener('click', async event => {
            event.preventDefault();
            const JSON = await request('business/public/carrito.php', 'facturaActual');
            switch (JSON.status) {
                case -1:
                    document.getElementById('login').addEventListener('click', () => {
                        location.href = 'login.html';
                    })
                    TOASTACCION.show();
                    break;

                case 0:
                    document.getElementById('msg-toast').innerText = JSON.excep;
                    break;
                // redirecionar a la factura pendiente
                case 1:
                    // encodeURIComponent valida dato valido para la URL
                    const URL = 'carrito.html' + '?idfactura=' + encodeURIComponent(JSON.data);
                    // console.log(VER[i].id);
                    // redireccionar a la página con el producto seleccionado
                    window.location.href = URL;
                    break;
                default:
                    break;
            }
        })
    }

}

document.addEventListener('DOMContentLoaded', async event => {
    event.preventDefault();
    cargarNav();

})
