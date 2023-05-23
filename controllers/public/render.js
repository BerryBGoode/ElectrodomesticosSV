import { request } from "../controller.js";

// obtener el header para agregar nav
const HEADER = document.querySelector('header');
// obtener el footer para agregar contenido
const FOOTER = document.querySelector('footer');

// verificar sí es usada la etiqueta header
if (HEADER) {
    HEADER.innerHTML = `<nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
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
                    <li class="nav-item dropdown" id="estado-cuenta"></li>
                </ul>
                <form class="d-flex" method="get" id="buscador">
                    <input class="form-control me-2" id="input-buscar" type="search" placeholder="Buscar"
                        aria-label="Buscar">
                    <button class="btn btn-outline-secondary" type="submit">Buscar</button>
                </form>
            </div>
        </div>
    </nav>`;
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
document.addEventListener('DOMContentLoaded', async event => {
    event.preventDefault();
    const JSON = await request('business/public/usuario.php', 'validarEstadoCuenta');
    switch (JSON.status) {
        case 1:
            CUENTA.innerHTML = `<a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    ${JSON.data}
                                </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <li><a class="dropdown-item" href="#">Account</a></li>
            <li><a class="dropdown-item" href="#">Pedidos</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Cerrar Sesión</a></li>
          </ul>`;
            break;

        case -1:
            CUENTA.innerText = `Iniciar Sesión`;
            break;
        default:
            break;
    }
})