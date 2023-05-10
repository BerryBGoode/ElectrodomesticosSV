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
    
    // verifica la existencia de una sesión activa
    if (!isset($_SESSION['idusuario'])) {                
        $res['status'] = -1;
        $res['excep'] = 'Sesion inactiva, se te redireccionará para iniciar sesión';
    }else {
        
        // evaluar la acción (endpoints)
        switch ($_GET['action']) {
            case 'cargar':
                # code...
                break;
            
            default:
                # code...
                break;
        }
    }
}



header('content-type: application/json; charset=utf-8');
print(json_encode($res));
