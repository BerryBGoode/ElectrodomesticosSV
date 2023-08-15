<?php
// archivo con los queries
require_once '../../entities/dao/marca.php';
// archivo con los attrs
require_once '../../entities/dto/marca.php';

$res = array('status' => 0, 'msg' => null, 'data' => null, 'excep' => null);

// verificar sí existe acción
if (isset($_GET['action'])) {

    // reanudar sesión
    session_start();

    // verificar sí existe sesión activa
    if (isset($_SESSION['idusuario'])) {

        // instancia con los queries
        $query = new MarcaQuery;

        switch ($_GET['action']) {
            case 'productosCategoria':
                if ($res['data'] = $query->productosMarca()) {
                    $res['status'] = 1;
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'No existen datos registrados';
                }

                break;

            case 'cargar':

                if ($res['data'] = $query->cargarMarcas()) {
                    $res['status'] = 1;
                    $res['msg'] = count($res['data']);
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'No existen datos registrados';
                }

                break;

            case 'crear':
                $_POST = Validate::form($_POST);
                if (!MARCA->setMarca($_POST['marca'])) {
                    $res['excep'] = 'Marca incorrecta';
                } elseif ($query->guardarMarca()) {
                    $res['status'] = 1;
                    $res['msg'] = 'Registro guardado';
                } else {
                    $res['excep'] = Database::getException();
                }

                break;

            case 'cargaRegistro':

                if (!MARCA->setId($_POST['idmarca'])) {
                    $res['excep'] = 'Error al seleccionar registro';
                } elseif ($res['data'] = $query->obtenerRegistro()) {
                    $res['status'] = 1;
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'No se encontraron registros';
                }

                break;

            case 'actualizar':

                if (!MARCA->setId($_POST['idmarca'])) {
                    $res['excep'] = 'Error al obtener registro o no coincide';
                } elseif (!MARCA->setMarca($_POST['marca'])) {
                    $res['excep'] = 'Marca incorrecta';
                } elseif ($query->actualizarMarca()) {
                    $res['status'] = 1;
                    $res['msg'] = 'Registro modificado';
                } else {
                    $res['excep'] = Database::getException();
                }


                break;

            case 'eliminar':

                if (!MARCA->setId($_POST['idmarca'])) {
                    $res['excep'] = 'Error al seleccionar registro';
                } elseif ($query->eliminarMarca()) {
                    $res['status'] = 1;
                    $res['msg'] = 'Registro eliminado';
                } else {
                    $res['excep'] = 'Error al eliminar, probablemte está marca tiene productos registrados, se recomienda no eliminar';
                }


                break;
            default:
                $res['excep'] = 'Acción no encontrada';
                break;
        }
    } else {
        // cuando no exista sesión enviará un mensaje de warning para redireccionar al login
        $res['status'] = -1;
        $res['excep'] = 'Sesion inactiva, se te redireccionará para iniciar sesión';
    }
} else {
    $res['excep'] = 'Acción inexistente';
}


header('content-type: application/json; charset=utf-8');
print(json_encode($res));
