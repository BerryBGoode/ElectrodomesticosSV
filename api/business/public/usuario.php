<?php
// archivo con la clase de los queries
require_once '../../entities/dao/usuario.php';
// archivo con la clase con los attributos
require_once '../../entities/dto/usuario.php';

// arreglo que retorna la respuesta
$res = array('status' => 0, 'msg' => null, 'excep' => null, 'data' => null);

// verificar sí existe acción
if (!isset($_GET['action'])) {
    $res['excep'] = 'Acción inexistente';
} else {

    session_start();
    $query = new UsuarioQuery;

    switch ($_GET['action']) {

        case 'login':

            $_POST =  Validate::form($_POST);

            if (!$query->validateUsuario($_POST['usuario'])) {
                $res['excep'] = 'Usuario no registrado';
            } elseif ($query->validateClaveAdmin($_POST['clave'])) {
                $res['status'] = 1;
                $res['msg'] = 'Bienvenido ' . $_POST['usuario'];
                $_SESSION['idcliente'] = USUARIO->getId();
                $_SESSION['cliente'] = $_POST['usuario'];
            } else {
                $res['excep'] = 'Usuario o contraseña incorrecta';
            }
            
            break;
        case 'validarEstadoCuenta':

            // verificar sí existen sesión 

            break;

        default:
            # code...
            break;
    }
}


// retornar el arreglo 
header('content-type: application/json; charset=utf-8');
print(json_encode($res));
