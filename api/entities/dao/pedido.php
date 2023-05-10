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
    public function cargar(){
        $sql = 'SELECT o.idpedido, o.fecha, p.idproducto, p.nombre, p.precio, o.cantidad, (o.cantidad * p.precio) as Subtotal, o.estado
                FROM pedidos o
                INNER JOIN productos p ON p.idproducto = o.idproducto
                WHERE o.idfactura = ?';
        $param = array(PEDIDO->getFactura());
        return Database::all($sql, $param);
    }
}
