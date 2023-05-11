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
        $sql = 'SELECT idpedido FROM pedidos WHERE idfactura = ? AND idproducto = ?';
        $params = array($factura, $producto);
        return Database::row($sql, $params);
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
}
