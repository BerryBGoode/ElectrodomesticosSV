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

    // definiar horario local
    date_default_timezone_set('America/El_Salvador');
    $hoy = date('Y-m-d');

    // verifícar sesión de cliente
    if (!isset($_SESSION['idcliente'])) {
        $res['status'] = -1;
    } else {

        // evaluar la acción
        switch ($_GET['action']) {
            case 'generateFactura':

                $_SESSION['factura'] = $_POST['factura'];
                $res['status'] = 1;
                $res['data'] = 'http://localhost/electrodomesticossv/api/reports/public/factura.php';
                break;
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
                            $pedidoquery->AgregarCantidad($_POST['cantidad'], $pedidoscliente[$i]['idpedido']);
                            $res['status'] = 1;
                            $res['msg'] = 'Producto añadido al carrito';
                        } else {

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

                    // crear factura
                    $_POST = Validate::form($_POST);
                    $pendiente = 2;
                    if (!FACTURA->setCliente($_SESSION['idcliente'])) {
                        $res['excep'] = 'Error al seleccionar cliente';
                    } elseif (!FACTURA->setFecha($hoy)) {
                        $res['excep'] = 'Error con el formato de fecha';
                    } elseif ($facturaquery->guardaFactura($pendiente)) {

                        // crear pedido
                        // obtener el id del última factura ingresada
                        $idfactura = implode(' ', $facturaquery->getLastFactura());
                        if ($idfactura) {

                            // crear pedido
                            $disponible = 1;

                            if (!PEDIDO->setFecha($hoy)) {
                                $res['excep'] = 'Fecha incorrecta, revisar formato';
                            } elseif (!PEDIDO->setProducto($_POST['producto'])) {
                                $res['excep'] = 'Producto incorrecto';
                            } elseif (!PEDIDO->setFactura($idfactura)) {
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
                        } else {
                            $res['excep'] = Database::getException();
                        }
                    } else {
                        $res['excep'] = Database::getException();
                    }
                    break;
                }

                break;
                // Acción para obtener la factura actual pendiente
            case 'facturaActual':

                if ($factura = $facturaquery->getFacturaActual($_SESSION['idcliente'])) {
                    // retornar arreglo ocn factura;
                    $res['data'] = implode(' ', $factura);
                    $res['status'] = 1;
                } else {
                    $res['excep'] = 'Debe agregar producto al carrito';
                }

                break;
                // acción para obtener los datos del carrito de la factura por gestionar
            case 'verCarrito':

                if ($res['data'] = $pedidoquery->getCarrito($_POST['factura'])) {
                    $res['status'] = 1;
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'No hay pedido';
                }

                break;

                // acción que se realiza cuando se modifica la cantidad en carrito
            case 'modificarCantidad':

                switch ($_POST['ope']) {
                    case 1:
                        if ($_POST['existencias'] >= $_POST['cantidad']) {
                            ($pedidoquery->modificarCantidad($_POST['cantidad'], $_POST['pedido'], $_POST['ope'])) ?
                                $res['status'] = 1 : $res['excep'] = Database::getException();
                        }
                        break;

                    case 2:
                        $res['data'] = $_POST['cantidad'];
                        ($pedidoquery->modificarCantidad($_POST['cantidad'], $_POST['pedido'], $_POST['ope'])) ?
                            $res['status'] = 1 : $res['excep'] = Database::getException();
                        break;
                    default:
                        $res['excep'] = 'Acción no identificada';
                        break;
                }
                break;
                // acción para cancelar pedidos
                // eliminar los pedidos de una factura
            case 'cancelarPedidos':

                // eliminar pedidos
                if ($pedidoquery->eliminarPedidosFactura($_POST['factura'])) {
                    // eliminar facturas
                    FACTURA->setId($_POST['factura']);
                    if ($facturaquery->eliminar()) {
                        $res['status'] = 1;
                    }
                }

                break;
                // acción para finalizar compra
            case 'finalizarCompra':

                $finalizada = 1;
                FACTURA->setEstado($finalizada);
                FACTURA->setId($_POST['factura']);
                if ($facturaquery->actualizarEstado()) {
                    $res['status'] = 1;
                }
                break;

            case 'historial':

                // print_r($_SESSION);
                if ($res['data'] = $facturaquery->getHistorial($_SESSION['idcliente'])) {
                    $res['status'] = 1;
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'No tiene pedidos registrados';
                }

                break;
            default:
                $res['excep'] = 'Acción no disponible';
                break;
        }
    }
}


// retorna la respuesta y la convierte en json
header('content-type: application/json; charset=utf-8');
print(json_encode($res));
