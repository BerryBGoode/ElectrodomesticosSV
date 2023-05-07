const NAV = document.querySelector('.nav-render');
if (NAV) {
    NAV.innerHTML = `<nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
        <img src="../../resources/img/logos/logo.png" alt="logo" class="nav-logo">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
            aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="options"></div>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdown" role="button"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        Electrodomesticos
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="productos.html">Productos</a></li>
                        <li><a class="dropdown-item" href="categorias.html">Categorias</a></li>
                        <li><a class="dropdown-item" href="marcas.html">Marcas</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="inicio.html">Inicio</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="facturas.html">Facturas</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="clientes.html">Clientes</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="usuarios.html">Usuarios</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link active" aria-current="page" href="comentarios.html">Comentarios</a>
                </li>
            </ul>
            <form class="d-flex" method="get" id="buscador">
                <input class="form-control me-2" id="input-buscar" type="search" placeholder="Search" aria-label="Search">
                <button class="btn btn-outline-secondary" type="submit">Search</button>
            </form>
        </div>
    </div>
</nav>`;
}