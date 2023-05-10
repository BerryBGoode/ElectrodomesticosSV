<?php
// archivo con los queris de pedidos
require_once '../../entities/dao/pedido.php';
// archivo con los attrs, getter y setter
require_once '../../entities/dto/pedido.php';

// arreglo que retornará las respuestas según la acción
$res = array('status' => 0, 'msg' => null, 'excep' => null, 'data' => null);

// verificar sí existe una acción
if (!isset($_GET['action'])) {
    $res['excep'] = 'Acción inexistente';
} else {

    // reundar var de sesion
    session_start();

    // instanciar clase con queries
    $query = new PedidoQuery;

    // verifica la existencia de una sesión activa
    if (!isset($_SESSION['idusuario'])) {
        $res['status'] = -1;
        $res['excep'] = 'Sesion inactiva, se te redireccionará para iniciar sesión';
    } else {

        // evaluar la acción (endpoints)
        switch ($_GET['action']) {
            case 'guardar':

                $_POST = Validate::form($_POST);

                $disponible = 1;

                if (!PEDIDO->setFecha($_POST['fecha'])) {
                    $res['excep'] = 'Fecha incorrecta, revisar formato';
                } elseif (!PEDIDO->setProducto($_POST['productos'])) {
                    $res['excep'] = 'Producto incorrecto';
                } elseif (!PEDIDO->setFactura($_POST['idfactura'])) {
                    $res['excep'] = 'Error al obtener factura';
                } elseif (!PEDIDO->setCantidad($_POST['cantidad'])) {
                    $res['excep'] = 'Error con la cantidad seleccionada';
                } elseif (!PEDIDO->setEstado($disponible)) {
                    $res['excep'] = 'Estado inexistente';
                } elseif ($query->guardarPedido() && !Database::getException()) {
                    // restar existencias
                    $res['status'] = 1;
                    $res['msg'] = 'Registro guardado';
                } else {
                    $res['excep'] = Database::getException();
                }

                break;

            case 'cargar':

                if (!PEDIDO->setFactura($_POST['idfactura'])) {
                    $res['excep'] = 'Error al obtener factura';
                }
                elseif ($res['data'] = $query->cargar()) {
                    $res['status']  = 1;
                    $res['msg'] = count($res['data']);
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'No existen pedidos en de esta factura';
                }


                break;
            
            case 'actualizarEstado':
                
                
                if (!PEDIDO->setId($_POST['idpedido'])) {
                    $res['excep'] = 'Error al obtener pedido';
                } elseif (!PEDIDO->setEstado($_POST['estado'])) {
                    $res['excep'] = 'Error al obtener nuevo estado';
                } elseif ($query->actualizarEstdo()) {
                    $res['status'] = 1;
                } else {
                    $res['excep'] = Database::getException();
                }
                
                break;

            case 'registro':
                
                if (!PEDIDO->setId($_POST['idpedido'])) {
                    $res['excep'] = 'Error al obtener pedido';
                } elseif ($res['data'] = $query->registro()) {
                    $res['status'] =1;
                } else {
                    $res['excep'] = Database::getException();
                }                

                break;

            case 'actualizar':
                $_POST = Validate::form($_POST);
                

                if (!PEDIDO->setId($_POST['idpedido'])) {
                    $res['excep'] = 'Error al obtener registro';
                } elseif (!PEDIDO->setFecha($_POST['fecha'])) { 
                    $res['excep'] = 'Fecha incorrecto, revisar formato';
                } elseif (!PEDIDO->setProducto($_POST['productos'])) { 
                    $res['excep'] = 'Producto seleccionado incorrecto';
                } elseif (!PEDIDO->setCantidad($_POST['cantidad'])) {
                    $res['excep'] = 'Cantidad incorrecto';
                } elseif ($query->actualizar()) {
                    $res['status'] = 1;
                    $res['msg'] = 'Registro modificado';
                } else {
                    $res['excep'] = Database::getException();
                }
                

                break;
            default:
                # code...
                break;
        }
    }
}



header('content-type: application/json; charset=utf-8');
print(json_encode($res));
