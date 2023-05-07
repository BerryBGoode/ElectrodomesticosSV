<?php
// archivo con los queries
require_once '../../entities/dao/categoria.php';
// archivo cons los attrs y la instancia
require_once '../../entities/dto/categoria.php';
// arreglo con los resultados
$res = array('status' => 0, 'msg' => null, 'excep' => null, 'data' => null);

// verficar sí existe una acción
if (!isset($_GET['action'])) {
    $res['excep'] = 'Acción inexistente';
} else {
    // reanudar la sesion 
    session_start();

    // instancia
    $query = new CategoriaQuery;
    // verificar síno existe una sesion
    if (!isset($_SESSION['idusuario'])) {
        // cuando no exista sesión enviará un mensaje de warning para redireccionar al login
        $res['status'] = -1;
        $res['excep'] = 'Sesion inactiva, se te redireccionará para iniciar sesión';
    } else {
        switch ($_GET['action']) {
            case 'cargar':

                if ($res['data'] = $query->cargar()) {
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

                if (!CATEGORIA->setCategoria($_POST['categoria'])) {
                    $res['excep'] = 'Categoria incorrecta';
                } elseif ($query->guardar()) {
                    $res['status'] = 1;
                    $res['msg'] = 'Registro guardado';
                } else {
                    $res['excep'] = Database::getException();
                }


                break;
            case 'registro':

                if (!CATEGORIA->setId($_POST['idcategoria'])) {
                    $res['excep'] = 'Error al obtener registro';
                } elseif ($res['data'] = $query->registro()) {
                    $res['status'] = 1;
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'Registro no encontrado';
                }


                break;
            case 'actualizar':
                $_POST = Validate::form($_POST);

                if (!CATEGORIA->setCategoria($_POST['categoria'])) {
                    $res['excep'] = 'Categoria incorrecta';
                } elseif (!CATEGORIA->setId($_POST['idcategoria'])) {
                    $res['excep'] = 'Error al obtener registro o no coincide';
                } elseif ($query->actualizar()) {
                    $res['status'] = 1;
                    $res['msg'] = 'Registro modificado';
                } else {
                    $res['excep'] = Database::getException();
                }


                break;
            case 'eliminar':

                if (!CATEGORIA->setId($_POST['idcategoria'])) {
                    $res['excep'] = 'Error al obtener registro';
                } elseif ($query->eliminar()) {
                    $res['status'] = 1;
                    $res['msg'] = 'Registro eliminado';
                } else {
                    $res['excep'] = 'Error al eliminar, probablemte está categoria tiene productos registrado, se recomienda no eliminar';
                }


                break;
            default:
                $res['excep'] = 'Acción no encontrada';
                break;
        }
    }
}

header('content-type: application/json; charset=utf-8');
print(json_encode($res));
