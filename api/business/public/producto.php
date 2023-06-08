<?php
// archivo con los queries
require_once '../../entities/dao/producto.php';
require_once '../../entities/dao/comentario.php';
// archivo con los attrs
require_once '../../entities/dto/producto.php';

// array con las respuestas
$res = array('status' => 0, 'msg' => null, 'excep' => null, 'data' => null);

// verificar sí existe acción
if (!isset($_GET['action'])) {
    $res['excep'] = 'Acción no existente';
} else {

    session_start();
    // instanciar clase con los queries
    $queryproducto = new ProductoQuery;
    $querycomentario = new ComentarioQuery;

    // evaluar la acción
    switch ($_GET['action']) {
            // acción para cargar productos
        case 'productos':
            // arreglo vacío
            $productos = [];

            if ($productosvista = $queryproducto->cargar()) {
                // recorrer los productos para validar que tenga existencias
                for ($i = 0; $i < count($productosvista); $i++) {

                    // validar que datos mostrar
                    //  ! cuando las existencias sean 1 o mayores
                    //  ! cuando el estado de este no sea false
                    if ($productosvista[$i]['existencias'] >= 1 && $productosvista[$i]['estado']) {
                        $productos[] = $productosvista[$i];
                        $res['data'] = $productos;
                    }
                }
                $res['status'] = 1;
            } elseif (Database::getException()) {
                $res['excep'] = Database::getException();
            } else {
                $res['excep'] = 'No existen productos registrados';
            }

            break;

            // acción para cargar destacados
        case 'destacados':

            $productos = [];

            if ($productosvista = $queryproducto->cargarDestacados()) {
                // recorrer los productos para validar que tenga existencias
                for ($i = 0; $i < count($productosvista); $i++) {

                    // validar que datos mostrar
                    //  ! cuando las existencias sean 1 o mayores
                    //  ! cuando el estado de este no sea false
                    if ($productosvista[$i]['existencias'] >= 1 && $productosvista[$i]['estado']) {
                        $productos[] = $productosvista[$i];
                        $res['data'] = $productos;
                    }
                }
                $res['status'] = 1;
            } elseif (Database::getException()) {
                $res['excep'] = Database::getException();
            } else {
                $res['excep'] = 'No existen productos registrados';
            }


            break;
            // cargar articulo  
        case 'registro':

            if (!PRODUCTO->setId($_POST['idproducto'])) {
                $res['excep'] = 'Error al seleccionar registro';
            } elseif ($res['data'] = $queryproducto->registro()) {
                $res['status'] = 1;
            } else {
                $res['excep'] = Database::getException();
            }
            break;

        case 'comentariosArticulo':

            if ($res['data'] = $querycomentario->cargarComentariosProducto($_POST['producto'])) {
                $res['status'] = 1;
            } else if (Database::getException()) {
                $res['excep'] = Database::getException();
            }

            break;
        default:
            # code...
            break;
    }
}


// establece que el cotenido se utliza para enviar encabezado HTTP, códificado en json
header('content-type: application/json; charset=utf-8');
// por lo cual se debe convertir la respuesta que retornará en json
print(json_encode($res));
