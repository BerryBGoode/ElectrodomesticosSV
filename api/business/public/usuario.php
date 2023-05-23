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
            // acción para verificar el estado de la cuenta
            // verífica sí se ha iniciado sesión para cargar dato en navbar
        case 'validarEstadoCuenta':

            // verificar sí existen sesión 
            if (isset($_SESSION['idcliente']) && isset($_SESSION['cliente'])) {
                $res['status'] = 1;
                $res['data'] = $_SESSION['cliente'];
            } else {
                $res['status'] = -1;
            }

            break;

        case 'logOutCliente':
            // eliminar vatiables de sesión con esos nombres
            unset($_SESSION['idcliente']);
            unset($_SESSION['cliente']);
            $res['status'] = 1;
            break;

        case 'crearCuentaCliente':
            $_POST = Validate::form($_POST);

            if (!USUARIO->setNombres($_POST['nombres'])) {
                $res['excep'] = 'Nombre incorrecto';
            } elseif (!USUARIO->setApellidos(($_POST['apellidos']))) {
                $res['excep'] = 'Apellido incorrecto';
            } elseif (!USUARIO->setUsuario($_POST['usuario'])) {
                $res['excep'] = 'Usuario incorrecto';
            } elseif (!USUARIO->setClave($_POST['clave'])) {
                $res['excep'] = 'Clave incorrecta';
            } elseif (!USUARIO->setCorreo($_POST['correo'])) {
                $res['excep'] = 'Formato de correo incorrecto';
                // el usuario ingresado siempre será activo
            } elseif (!USUARIO->setEstado(1)) {
                $res['excep'] = 'Estado incorrecto';
                // enviar tipo usuario admin
                // no es tabla independiente, es campo
            } elseif ($query->guardar($_POST['direccion'], 2) &&  !Database::getException()) {
                $res['status'] = 1;
                $res['msg'] = 'Registro guardado';
            } elseif (Database::getException()) {
                $res['excep'] = Database::getException();
            } else {
                $res['excep'] = 'Usuario o correo ya está registrado, utilizar otros datos';
            }
            break;
        default:
            # code...
            break;
    }
}


// retornar el arreglo 
header('content-type: application/json; charset=utf-8');
print(json_encode($res));
