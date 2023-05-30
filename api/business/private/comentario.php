<?php
// archivo con los queries
require_once '../../entities/dao/comentario.php';
// archivo con los attrs, getters y setters
require_once '../../entities/dto/comentario.php';

// arreglo con las respuestas
$res = array('status' => 0, 'msg' => null, 'excep' => null, 'data' => null);

// verificar sí existe una acción
if (!isset($_GET['action'])) {
    $res['Acción inexistente'];
} else {
    // renudar variables de sesion
    session_start();

    // instnaciar clase con los queries
    $query = new ComentarioQuery;

    // veríficar si existe una sesión
    if (!isset($_SESSION['idusuario']) || !isset($_SESSION['idcliente'])) {
        // cuando no exista sesión enviará un mensaje de warning para redireccionar al login
        $res['status'] = -1;
        $res['excep'] = 'Sesion inactiva, se te redireccionará para iniciar sesión';
    } else {
        
        // evaluar la acción enviada de la petición del front
        switch ($_GET['action']) {
            case 'guardar':
                
                $_POST = Validate::form($_POST);
                // settear datos

                if (!COMENTARIO->setPedido($_POST['pedidos'])) {
                    $res['excep'] = 'Error al obtener pedido';
                }elseif (!COMENTARIO->setEstado(true)) {
                    $res['excep'] = 'Error al obtener estado';
                }elseif (!COMENTARIO->setComentario($_POST['comentario'])) {
                    $res['excep'] = 'Erro al obtener comentario';
                }elseif ($query->guardar()) {
                    $res['status'] = 1;
                    $res['msg']  = 'Registro guardado';
                }  else {
                    $res['excep'] = Database::getException();
                }
                
                break;
        
            case 'cargarPedidos':
                // buscar las facturas que tiene este cliente
                if ($facturas = $query->validarCliente($_POST['usuarios'])) {
                    // recorrer la cantidad de facturas encontradas
                    for($i = 0; $i < count($facturas); $i++){
                        // convertir de array a string la factura recorrida
                        $factura = implode(' ',$facturas[$i]);
                        // buscar el pedido con el producto selccionado
                        // y el valor de la factura por la que está pasando
                        if($res['data'] = $query->validatePedido($factura, $_POST['productos'])){
                            $res['status'] = 1;
                            $res['excep'] = null;
                        }elseif (Database::getException()) {
                            $res['excep'] = Database::getException();
                        }else {
                            $res['excep'] = 'Este cliente no tiene un pedido con este producto';
                        }
                    }
                }elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'Este cliente no tiene facturas registradas';
                }
                
                break;

            case 'cargar':
                
                if ($res['data'] = $query->cargar()) {
                    $res['status'] = 1;
                    $res['msg'] = count($res['data']);
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {                    
                    $res['excep'] = 'No existen registros';
                }
                
                break;

            case 'actualizarEstado':
                
                
                if (!COMENTARIO->setId($_POST['idcomentario'])) {
                    $res['exce'] = 'Error al obtener registro';
                } elseif (!COMENTARIO->setEstado($_POST['estado'])) {
                    $res['excep'] = 'Error al obtener nuevo estado';
                } elseif ($query->actualizarEstado()) {
                    $res['status'] = 1;
                } else {
                    $res['excep'] = Database::getException();
                }
                

                break;

            case 'registro':
                
                if (!COMENTARIO->setId($_POST['idcomentario'])) {
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

                if (!COMENTARIO->setId($_POST['idcomentario'])) {
                    $res['excep'] = 'Error al obtener registro';
                } elseif (!COMENTARIO->setPedido($_POST['pedidos'])) {
                    $res['excep'] = 'Error al cargar pedido';
                } elseif (!COMENTARIO->setComentario($_POST['comentario'])) {
                    $res['excep'] = 'Comentario incorrecto';
                } elseif ($query->actualizar()) {
                    $res['status'] = 1;
                    $res['msg'] = 'Registro modificado';
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'Error al modificar registro';
                }
                
                break;

            case 'eliminar':
                
                if (!COMENTARIO->setId($_POST['idcomentario'])) {
                    $res['excep'] = 'Error al obtener registro';
                } elseif ($query->eliminar()) {
                    $res['status'] = 1;
                    $res['msg'] = 'Registro eliminado';
                } else {
                    $res['excep'] = Database::getException();
                }
                

                break;

                // acción para publicar comentario
            case 'publicarComentario':
                
                // arreglos vacíos para obtener los datos después del filtro
                // de verificar sí tiene las facturas de un cliente
                // y en las facturas de este cliente donde este el producto que desea comentar
                $factura = [];
                $pedido = [];
                // obtener las facturas del cliente
                if ($facturas = $query->getFacturasCliente($_SESSION['idcliente'])) {
                    // recorrer las facturas encontradas
                    // para encontrar las facturas que tengan el producto a comentar
                    foreach ($facturas as $facturascliente) {
                        $factura[] = $facturascliente;
                        // verificar que la orden que esta pasando tenga el producto a comentar
                        if ($pedidos = $query->getPedidosFactoraCliente(implode(' ',$facturascliente), $_POST['producto'])) {
                            
                            foreach ($pedidos as $pedidoscliente) {
                                $pedido[] = $pedidoscliente;                                      
                            }                        

                        }
                        
                    }
                    if ($pedido) {                        
                        // establecer un indice random
                        $rndindex = array_rand($pedido);
                        // obtener el valor del indice random
                        // aquí ya se obtiene el valor random
                        $rndpedido[1] = $pedido[$rndindex];
                        // ahora se procede a agregar comentario
                            // enviar valores del comentanrio                                                
                        // $res['data'] = $rndpedido;
                        if (!COMENTARIO->setComentario($_POST['comentario'])){
                            $res['excep'] = 'Error en el comentario';
                        }
                        else if (!COMENTARIO->setPedido(implode(' ', $rndpedido[1]))){
                            $res['excep'] = 'Error al obtener publicar comentario';                        
                        }
                        else if (!COMENTARIO->setEstado(true)){
                            $res['excep'] = 'Error en el estado';
                        }
                        // validar que resulto bien la inserción
                        else if ($query->guardar()) {
                            $res['status'] = 1;                            
                        }else {
                            $res['excep'] = Database::getException();
                        }
                    }else {
                        $res['excep'] = 'No ha comprado este producto';
                    }
                } else {
                    $res['excep'] = 'Debe comprar producto antes de comentar';
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
