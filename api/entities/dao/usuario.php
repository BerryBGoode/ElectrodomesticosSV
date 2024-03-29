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
    // método para verificar sí el usuario admin en el login existe
    public function validateUsuario($usuario)
    {
        $sql = 'SELECT idusuario FROM usuarios WHERE nombreusuario = ? AND estado = ?';
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

    /**
     * Método para agregar usuario
     * $dirección, agregar dirección si validar nula
     * $tipousuario, tipo usuario a agregar
     * 1 = admin
     * 2 = cliente
     * retorna el resultado del proceso
     */
    public function guardar($direccion = null, $tipousuario)
    {
        $sql = 'INSERT INTO usuarios(nombreusuario, clave, nombre, apellido, correo, direccion, estado, tipousuario)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array(
            USUARIO->getUsuario(), USUARIO->getClave(), USUARIO->getNombres(), USUARIO->getApellidos(),
            USUARIO->getCorreo(), $direccion, USUARIO->getEstado(), $tipousuario
        );
        return Database::storeProcedure($sql, $params);
    }


    /**
     * Método para cargar los datos de los usuarios administradores
     * retorna un arreglo con los datos recuperados
     */
    public function cargar($tipo)
    {
        $sql = 'SELECT * FROM usuarios WHERE tipousuario = ? ORDER BY idusuario ASC';
        $param = array($tipo);
        return Database::all($sql, $param);
    }

    /**
     * Método para cargar el correo de los clientes
     * retorna un arreglo con los datos recuperados
     */
    public function getCorreo()
    {
        $cliente  = 2;
        $sql = 'SELECT idusuario, correo FROM usuarios WHERE tipousuario = ?';
        $param = array($cliente);
        return Database::all($sql, $param);
    }

    /**
     * Método para recuperar los datos según registro seleccionado
     * retorna un arreglo con los datos recuperados 
     */
    public function registro()
    {
        $sql = 'SELECT * FROM usuarios WHERE idusuario = ?';
        $param = array(USUARIO->getId());
        return Database::row($sql, $param);
    }

    /**
     * Método para actualizar el estado de un usuario
     * retorna el resultado del proceso
     */
    public function actualizarEstado()
    {
        $sql = 'UPDATE usuarios SET estado = ? WHERE idusuario = ?';
        $params = array(USUARIO->getEstado(), USUARIO->getId());
        return Database::storeProcedure($sql, $params);
    }

    /**
     * Método para eliminar registro seleccionado
     * retorna el resultado del proceso
     */
    public function eliminarUsuario()
    {
        $sql = 'DELETE FROM usuarios WHERE idusuario = ?';
        $param = array(USUARIO->getId());
        return Database::storeProcedure($sql, $param);
    }

    /**
     * Método para actualizar datos del registro seleccionado
     * retorna el resultado del proceso
     */
    public function actulizarUsuario($direccion)
    {
        $sql = 'UPDATE usuarios
                SET nombreusuario = ?, nombre = ?, apellido = ?, correo = ?,
                direccion = ?
                WHERE idusuario = ?';
        $params = array(
            USUARIO->getUsuario(), USUARIO->getNombres(),
            USUARIO->getApellidos(), USUARIO->getCorreo(),
            $direccion, USUARIO->getId()
        );
        return Database::storeProcedure($sql, $params);
    }


    /**
     * Método para verificar sí existen usuarios
     * sí existen retorna true sino false
     */
    public function verificarUsuarios()
    {
        $sql = 'SELECT * FROM usuarios WHERE tipousuario = ?';
        $param = array(1);
        return Database::all($sql, $param);
    }

    /**
     * Método para obtener los datos para el generar el reporte con los clientes
     * más frecuentes
     */
    public function getClientesFrecuentesReporte()
    {
        $sql = 'SELECT u.nombre, u.apellido, count(f.idcliente) as compras
                FROM facturas f
                INNER JOIN usuarios u ON u.idusuario = f.idcliente
                WHERE u.tipousuario = 2
                GROUP BY u.nombre, u.apellido
                ORDER BY count(f.idcliente) DESC LIMIT 7';
        return Database::all($sql);
    }

    public function getClienteByUser($user)
    {
        $sql = 'SELECT nombre, apellido FROM usuarios WHERE nombreusuario = ?';
        $param = array($user);
        return Database::row($sql, $param);
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
