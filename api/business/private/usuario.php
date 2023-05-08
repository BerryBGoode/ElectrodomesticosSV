<?php
// archivo con los queries
require_once('../../entities/dao/usuario.php');
// archivo con los attrs
require_once('../../entities/dto/usuario.php');

// arreglo con los resultados
$res = array('status' => 0, 'session' => 0, 'msg' => null, 'excep' => null, 'data' => null);

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
                    $res['msg'] = 'Bienvenido ' . $_POST['usuario'];
                    $_SESSION['idusuario'] = USUARIO->getId();
                    $_SESSION['usuario'] = $_POST['usuario'];
                } else {
                    $res['excep'] = 'Usuario o contraseña incorrecta';
                }

                break;

            default:
                $res['excep'] = 'Acción fuera de sesión no encontrada';
                break;
        }
    } else {

        switch ($_GET['action']) {
            case 'crear':
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
                } elseif (!USUARIO->setTipoUsuario(1)) {
                    $res['excep'] = 'Tipo de usuario invalido';
                } elseif ($query->storeAdmin() &&  !Database::getException()) {
                    $res['status'] = 1;
                    $res['msg'] = 'Registro guardado';
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'Usuario o correo ya está registrado, utilizar otros datos';
                }
                break;

            case 'cargarAdmins':

                if ($res['data'] = $query->cargarAdmins()) {
                    $res['status'] = 1;
                    $res['msg'] = count($res['data']);
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'No se encontraron registros';
                }

                break;

            case 'registroAdmin':

                if (!USUARIO->setId($_POST['idusuario'])) {
                    $res['excep'] = 'Error al seleccionar registro';
                } elseif ($res['data'] = $query->registroAdmin()) {
                    $res['status'] = 1;
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'No se encontró registro';
                }

                break;

            case 'actualizarEstado':

                if (!USUARIO->setId($_POST['idusuario'])) {
                    $res['excep'] = 'Error al seleccionar registro';
                } elseif (!USUARIO->setEstado($_POST['estado'])) {
                    $res['excep'] = 'Error al obtener estado';
                } elseif ($query->actualizarEstado()) {
                    $res['status'] = 1;
                } else {
                    $res['excep'] = Database::getException();
                }

                break;
            case 'eliminar':

                if (!USUARIO->setId($_POST['idusuario'])) {
                    $res['excep'] = 'Error al obtener registro';
                } elseif ($query->eliminarUsuario()) {
                    $res['status'] = 1;
                    $res['msg'] = 'Registro eliminado';
                } else {
                    $res['excep'] = Database::getException();
                }

                break;
            default:
                $res['excep'] = 'Acción dentro de sesión no encontrada';
                break;
        }
    }
} else {
    $res['excep'] = 'Acción no registrada';
}
header('content-type: application/json; charset=utf-8');
print(json_encode($res));
