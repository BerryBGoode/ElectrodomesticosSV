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
    if (!isset($_SESSION['idusuario'])) {
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
                    # code...
                }elseif (!COMENTARIO->setEstado(true)) {
                }elseif (!COMENTARIO->setComentario($_POST['comentario'])) {
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
            default:
                $res['excep'] = 'Acción no encontrada';
                break;
        }

    }
}

header('content-type: application/json; charset=utf-8');
print(json_encode($res));
?>