<?php
// archivo la clase para ejecutar las sentencias
require_once('../../helpers/database.php');
// archivo con los attrs
require_once('../../entities/dto/usuario.php');
// clase con los queries para usuarios

class UsuarioQuery
{

    // método para verificar sí el usuario admin en el login existe
    public function validateUsuarioAdmin($usuario)
    {
        $sql = 'SELECT idusuario FROM usuarios WHERE nombreusuario = ? AND tipousuario = ?';
        $param = array($usuario, 1);
        $res = Database::row($sql, $param);
        if ($res) {
            USUARIO->setId($res['idusuario']);
            return true;
        }
    }

    // método para verificar la clave de ese usuario
    public function validateClaveAdmin($clave)
    {
        $sql = 'SELECT clave FROM usuarios WHERE idusuario = ?';
        $param = array(USUARIO->getId());
        $res = Database::row($sql, $param);
        if (password_verify($clave, $res['clave'])) {
            return true;
        }
    }

    // método para agregar usuario
    public function storeAdmin()
    {
        $sql = 'INSERT INTO usuarios(nombreusuario, clave, nombre, apellido, correo, direccion, estado, tipousuario)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array(
            USUARIO->getUsuario(), USUARIO->getClave(), USUARIO->getNombres(), USUARIO->getApellidos(),
            USUARIO->getCorreo(), USUARIO->getDireccion(), USUARIO->getEstado(), USUARIO->getTipoUsuario()
        );
        return Database::storeProcedure($sql, $params);
    }
}
// try {
//     //code...
//     USUARIO->setUsuario('loop');
//     USUARIO->setClave('loop12345');
//     USUARIO->setNombres('Fernando');
//     USUARIO->setApellidos('Mena');
//     USUARIO->setCorreo('fernandomena3131@gmail.com');
//     USUARIO->setDireccion('aaaaaa');
//     USUARIO->setEstado(1);
//     USUARIO->setTipoUsuario(1);
//     $a = new UsuarioQuery;
//     echo $a->storeAdmin();
// } catch (\Throwable $th) {
//     echo $th;
// }

