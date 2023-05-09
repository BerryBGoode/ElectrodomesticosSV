<?php
// archivo con los queries 
require_once '../../entities/dao/factura.php';
// archivo con los attrs, getter y setter
require_once '../../entities/dto/factura.php';
// arreglo con las respuestas
$res = array('status' => 0, 'msg' => null, 'excep' => null, 'data' => null);

// verificar sí existe un acción
if (!isset($_GET['action'])) {
    $res['excep'] = 'Acción inexisistente';
} else {

    // reanudar variables de sesion
    session_start();
    // instancia clase con los queries
    $query = new FacturaQuery();
    // verificar sí existe una sesion
    if (!isset($_SESSION['idusuario'])) {
        $res['status'] = -1;
        $res['excep'] = 'Sesion inactiva, se te redireccionará para iniciar sesión';
    } else {

        // evaluar que acción se pide del front
        switch ($_GET['action']) {

            case 'getCliente':

                if ($res['data'] = $query->getClientByCorreo($_POST['idusuario'])) {
                    $res['status'] = 1;
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'Registro no encontrado';
                }

                break;

            case 'crear':
                $_POST = Validate::form($_POST);
                $disponible = 1;
                if (!FACTURA->setCliente($_POST['usuarios'])) {
                    $res['excep'] = 'Error al seleccionar cliente';
                } elseif (!FACTURA->setFecha($_POST['fecha'])) {
                    $res['excep'] = 'Error con el formato de fecha';
                } elseif ($query->guardaFactura($disponible)) {
                    $res['status'] = 1;
                    $res['msg'] = 'Registro guardado';
                } else {
                    $res['excep'] = Database::getException();
                }
                break;

            case 'cargar':

                if ($res['data'] = $query->cargar()) {
                    $res['status'] = 1;
                    $res['msg'] = count($res['data']);
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'No existen facturas registradas';
                }

                break;

            case 'actualizarEstado':

                if (!FACTURA->setEstado($_POST['estado'])) {
                    $res['excep'] = 'Error al obtener nuevo estado';
                } elseif (!FACTURA->setId($_POST['idfactura'])) {
                    $res['excep'] = 'Error al seleccionar registro';
                } elseif ($query->actualizarEstado()) {
                    $res['status'] = 1;
                    $res['msg'] = 'Registro modificado';
                } else {
                    $res['excep'] = 'Error al modificar registro';
                }

                break;

            case 'eliminar':

                if (!FACTURA->setId($_POST['idfactura'])) {
                    $res['excep'] = 'Error al obtener registro';
                } elseif ($query->eliminar()) {
                    $res['status'] = 1;
                    $res['msg'] = 'Registro eliminado';
                } else {
                    $res['excep'] = 'Error al eliminar registro';
                }

                break;
            default:
                $res['excep'] = 'Acción no registrada';
                break;
        }
    }
}



header('content-type: application/json; charset=utf-8');
// converir json la respuesta
print(json_encode($res));
