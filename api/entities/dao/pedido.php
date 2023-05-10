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
}
