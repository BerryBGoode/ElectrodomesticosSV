<?php
// archivo con los queries
require_once '../../entities/dao/factura.php';
require_once '../../entities/dao/pedido.php';
// archivos con los attrs...
require_once '../../entities/dto/factura.php';
require_once '../../entities/dto/pedido.php';

// arreglo que retorna las respuestas según el proceso
$res = array('status' => 0, 'msg' => null, 'excep' => null, 'data' => null);

// verificar sí existe acción
if (!isset($_GET['action'])) {
    $res['excep'] = 'Acción inexistente';
} else {

    // inicializar variables de sesión
    session_start();

    // instanciar clases con queries
    $pedidoquery = new PedidoQuery;
    $facturaquery = new FacturaQuery;

    // verifícar sesión de cliente
    if (!isset($_SESSION['idcliente'])) {
        $res['status'] = -1;
    } else {

        // evaluar la acción
        switch ($_GET['action']) {
            case 'validarPedido':


                $pendiente = 2; //estado pendiente
                // verificar sí este usuario tiene facturas con estado 3 (pendiente)
                if ($facturascliente = $facturaquery->getFacturasCliente($_SESSION['idcliente'], $pendiente)) {
                    // 
                    // pasar factura por factura para verificar sí tiene un pedido
                    for ($i = 0; $i < count($facturascliente); $i++) {
                        // convertir a string la factura
                        $factura = implode(' ', $facturascliente[$i]);

                        // verificar sí esa factura que tiene el cliente tiene pedido
                        if (!$pedidoscliente = $pedidoquery->getPedidosFactura($factura)) {

                            // eliminar factura sin pedidos
                            FACTURA->setId($factura);
                            $facturaquery->eliminar();
                        }
                        // las facturas que no tiene pedidos han sido eliminadas antes
                        // a esta parte solo llegan las facturas con pedidos


                        // verificar si la factura pendiente no tiene producto agregado 
                        // y sí ya tiene un pedido con es producto
                        if ($pedidoscliente = $pedidoquery->getPedidoFacturaProducto($factura, $_POST['producto'])) {

                            // modificar cantidad
                            $pedidoquery->modificarCantidad($_POST['cantidad'], $pedidoscliente[$i]['idpedido'], 1);
                            $res['status'] = 1;
                            $res['msg'] = '+1 producto en el carrito';
                        } else {

                            // definiar horario local
                            date_default_timezone_set('America/El_Salvador');
                            $hoy = date('Y-m-d');

                            // crear pedido, con nuevo producto
                            $disponible = 1;

                            if (!PEDIDO->setFecha($hoy)) {
                                $res['excep'] = 'Fecha incorrecta, revisar formato';
                            } elseif (!PEDIDO->setProducto($_POST['producto'])) {
                                $res['excep'] = 'Producto incorrecto';
                            } elseif (!PEDIDO->setFactura($factura)) {
                                $res['excep'] = 'Error al obtener factura';
                            } elseif (!PEDIDO->setCantidad($_POST['cantidad'])) {
                                $res['excep'] = 'Error con la cantidad seleccionada';
                            } elseif (!PEDIDO->setEstado($disponible)) {
                                $res['excep'] = 'Estado inexistente';
                            } elseif ($pedidoquery->guardarPedido() && !Database::getException()) {
                                // restar existencias
                                $res['status'] = 1;
                                $res['msg'] = 'Producto agregado al carrito';
                            } else {
                                $res['excep'] = Database::getException();
                            }
                        }
                    }
                } else {
                    $res['msg'] = 'Crear factura-> pedido';
                }


                break;

            default:
                # code...
                break;
        }
    }
}


// retorna la respuesta y la convierte en json
header('content-type: application/json; charset=utf-8');
print(json_encode($res));
