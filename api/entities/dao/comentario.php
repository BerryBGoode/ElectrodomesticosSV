<?php
// archivo con las tranferencias directo con la base de datos
require_once '../../helpers/database.php';

class ComentarioQuery
{

    /**
     * Método para validar que existe un pedido que pertenezca
     * al cliente de seleccionado y producto
     * retorna un arreglo con las facturas registradas por ese cliente
     */
    public function validarCliente($cliente)
    {

        $sql = 'SELECT idfactura FROM facturas WHERE idcliente = ?';
        $param = array($cliente);
        return Database::all($sql, $param);
    }

    /**
     * Método para verificar sí ese cliente ha pedido ese producto
     * retorna un arreglo con los pedidos
     */
    public function validatePedido($factura, $producto)
    {

        // verificar en que factura se consumi el producto seleccionado                        
        $sql = 'SELECT * FROM pedidos WHERE idfactura = ? AND idproducto = ?';
        $params = array($factura, $producto);
        return Database::all($sql, $params);
    }


    /**
     * Método para registrar un nuevo comentario
     * retorna el número de registros ingresados
     */
    public function guardar()
    {
        $sql = 'INSERT INTO comentarios(comentario, idpedido, estado) VALUES (?, ?, ?)';
        $params = array(COMENTARIO->getComentario(), COMENTARIO->getPedido(), COMENTARIO->getEstado());
        return Database::storeProcedure($sql, $params);
    }


    /**
     * Método para cargar los datos en la tabla de la vista de comentarios
     * retorna un arreglo con los datos recuperados de la consulta
     */
    public function cargar()
    {
        $sql = 'SELECT c.idcomentario, c.fecha, o.idpedido ,u.correo, p.nombre, c.comentario, c.estado
                FROM comentarios c
                INNER JOIN pedidos o ON o.idpedido = c.idpedido
                INNER JOIN productos p ON p.idproducto = o.idproducto
                INNER JOIN facturas f ON f.idfactura = o.idfactura
                INNER JOIN usuarios u ON u.idusuario = f.idcliente
                ORDER BY c.idcomentario ASC';
        return Database::all($sql);
    }

    /**
     * Método para actualizar estado de un comentario
     * retorna los registros modificados
     */
    public function actualizarEstado()
    {
        $sql = 'UPDATE comentarios SET estado = ? WHERE idcomentario = ?';
        $param = array(COMENTARIO->getEstado(), COMENTARIO->getId());
        return Database::storeProcedure($sql, $param);
    }

    /**
     * Método para obtener el registro seleccionado
     * retorna un arreglo con los datos obtenidos según la consulta '$sql'
     */
    public function registro()
    {
        $sql = 'SELECT c.idcomentario, c.fecha, o.idpedido ,u.correo, u.idusuario, p.nombre, p.idproducto, c.comentario, c.estado
                FROM comentarios c
                INNER JOIN pedidos o ON o.idpedido = c.idpedido
                INNER JOIN productos p ON p.idproducto = o.idproducto
                INNER JOIN facturas f ON f.idfactura = o.idfactura
                INNER JOIN usuarios u ON u.idusuario = f.idcliente
                WHERE c.idcomentario = ?
                ORDER BY c.idcomentario ASC';
        $param = array(COMENTARIO->getId());
        return Database::row($sql, $param);
    }

    /**
     * Método para actualizar el registro seleccionado
     * retorna la cantidad de registros modificados
     */
    public function actualizar()
    {
        $sql = 'UPDATE comentarios SET idpedido = ?, comentario = ? 
                WHERE idcomentario = ?';
        $params = array(COMENTARIO->getPedido(), COMENTARIO->getComentario(), COMENTARIO->getId());
        return Database::storeProcedure($sql, $params);
    }

    /**
     * Método para eliminar el registro seleccionado de la tabla
     * retorna la cantidad de registro eliminados
     */
    public function eliminar()
    {
        $sql = 'DELETE FROM comentarios WHERE idcomentario = ?';
        $param = array(COMENTARIO->getId());
        return Database::storeProcedure($sql, $param);
    }

    /**
     * Método para cargar los comentarios de un producto
     * retorna un arreglo con los datos recuperados de la consulta
     */
    public function cargarComentariosProducto($producto)
    {
        $sql = 'SELECT c.idcomentario, c.comentario, c.fecha, u.nombreusuario  
                FROM comentarios c
                INNER JOIN pedidos o ON o.idpedido = c.idpedido
                INNER JOIN productos p ON p.idproducto = o.idproducto
                INNER JOIN facturas f ON f.idfactura = o.idfactura
                INNER JOIN usuarios u ON u.idusuario = f.idcliente
                WHERE c.estado = ? AND u.estado = ? AND p.idproducto = ?';
        $params = array(true, 1, $producto);
        return Database::all($sql, $params);
    }
}
