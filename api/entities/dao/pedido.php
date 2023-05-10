<?php
// archivo con los procesos directo con la base de datos
require_once '../../helpers/database.php';

// clase con los queries
class PedidoQuery
{
    /**
     * Método para guarda datos recibidos del front
     * retorna las tuplas insertadas
     */
    public function guardarPedido()
    {
        $sql = 'INSERT INTO pedidos(fecha, idproducto, idfactura, cantidad, estado)
                    VALUES (?, ?, ?, ?, ?)';
        $params = array(
            PEDIDO->getFecha(), PEDIDO->getProducto(), PEDIDO->getFactura(),
            PEDIDO->getCantidad(), PEDIDO->getEstado()
        );
        return Database::storeProcedure($sql, $params);
    }

    /** 
     * Método para cargar los datos
     * retorna un arreglo con los datos recuperados en base a la consulta
     */
    public function cargar()
    {
        $sql = 'SELECT o.idpedido, o.fecha, p.idproducto, p.nombre, p.precio, o.cantidad, (o.cantidad * p.precio) as Subtotal, o.estado
                FROM pedidos o
                INNER JOIN productos p ON p.idproducto = o.idproducto
                WHERE o.idfactura = ?';
        $param = array(PEDIDO->getFactura());
        return Database::all($sql, $param);
    }

    /**
     * Método para actualizar estado del pedido seleccionado
     * retorna la cantidad de registro seleccionados
     */
    public function actualizarEstdo()
    {
        $sql = 'UPDATE pedidos SET estado = ? WHERE idpedido = ?';
        $params = array(PEDIDO->getEstado(), PEDIDO->getId());
        return Database::storeProcedure($sql, $params);
    }

    /**
     * Método para obtener registro seleccionado
     * retorna un arreglo con los datos del registro 
     */
    public function registro()
    {
        $sql = 'SELECT * FROM pedidos WHERE idpedido = ?';
        $param = array(PEDIDO->getId());
        return Database::row($sql, $param);
    }

    /**
     * Método para actualizar pedido
     * retorna la cantidad de registro modificados
     */
    public function actualizar()
    {
        $sql = 'UPDATE pedidos SET fecha = ?, idproducto = ?, cantidad = ?
                WHERE idpedido = ?';
        $params = array(
            PEDIDO->getFecha(), PEDIDO->getProducto(), PEDIDO->getCantidad(),
            PEDIDO->getId()
        );
        return Database::storeProcedure($sql, $params);
    }
}
