<?php
// archivo con los queries
require_once('../../entities/dao/usuario.php');
// archivo con los attrs
require_once('../../entities/dto/usuario.php');

// arreglo con los resultados
$res = array('status'=> 0, 'session' => 0, 'msg' => null, 'excep' => null, 'data' => null);

// verificar sí existe una acción
if (isset($_GET['action'])) {
    // crear sesión, esta es necesaria para realizar unas acciones de switch
    session_start();
    // instancia con los queries
    $query = new UsuarioQuery;
    // verificar sí se ha iniciado sesión, para limitar los permisos
    if (!isset($_SESSION['idusuario'])) {
        $res['session'] = 1;
        // verificar que acción se quiere realizar
        switch ($_GET['action']) {
            case 'login':
                $_POST =  Validate::form($_POST);

                if (!$query->validateUsuarioAdmin($_POST['usuario'])) {
                    $res['excep'] = 'Usuario no registrado';
                } elseif ($query->validateClaveAdmin($_POST['clave'])) {
                    $res['status'] = 1;
                    $res['msg'] = 'Bienvenido '.$_POST['usuario'];
                    $_SESSION['idusuario'] = USUARIO->getId();
                    $_SESSION['usuario'] = $_POST['usuario'];
                }else{
                    $res['excep'] = 'Usuario o contraseña incorrecta';
                }
                
                break;
            
            default:
                $res['excep'] = 'Acción fuera de sesión no encontrada';
                break;
        }
    } else {
        
        switch ($_GET['action']) {
            case 'value':
                # code...
                break;
            
            default:
                $res['excep'] ='Acción dentro de sesión no encontrada';
                break;
        }
    }  

}else {
    $res['excep'] = 'Acción no registrada';
}
header('content-type: application/json; charset=utf-8');
print(json_encode($res));
