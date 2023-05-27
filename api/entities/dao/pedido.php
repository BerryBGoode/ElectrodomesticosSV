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
                WHERE o.idfactura = ?
                ORDER BY o.idpedido ASC';
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

    /**
     * Método para eliminar pedido
     * retorna la cantidad de registros eliminados
     */
    public function eliminar()
    {
        $sql = 'DELETE FROM pedidos WHERE idpedido = ?';
        $param = array(PEDIDO->getId());
        return Database::storeProcedure($sql, $param);
    }

    /**
     * Método para obtener existencias del producto a eliminar
     * del pedido eliminado
     * retorna un arreglo con la cantidad de productos del pedido
     * a eliminar
     */
    public function getCantidad()
    {
        $sql = 'SELECT idproducto, cantidad FROM pedidos WHERE idpedido = ?';
        $param = array(PEDIDO->getId());
        return Database::row($sql, $param);
    }

    /**
     * Método para actualizar producto (sumar existencias)
     * retorna un arreglo 
     */
    public function agregarExistencias()
    {
        $sql = 'UPDATE productos SET existencias = existencias + ? WHERE idproducto = ?';
        $params = array(PEDIDO->getCantidad(), PEDIDO->getProducto());
        return Database::storeProcedure($sql, $params);
    }

    /**
     * Método para obtener los pedidos de una factura
     */
    public function getPedidosFactura($factura)
    {
        $sql = 'SELECT * FROM pedidos WHERE idfactura = ?';
        $param = array($factura);
        return Database::all($sql, $param);
    }

    /**
     * Método para obtener los pedidos con la facturas especificada
     * y el producto especificado
     */
    public function getPedidoFacturaProducto($factura, $producto)
    {
        $sql = 'SELECT * FROM pedidos WHERE idfactura = ? AND idproducto = ?';
        $params = array($factura, $producto);
        return Database::all($sql, $params);
    }

    /***
     * 
     * Método para modificar la cantidad del pedido
     * { $ope } operación 1 sumar cantidad , 2 restar cantidad
     */
    public function modificarCantidad($cantidad, $pedido, $ope)
    {
        switch ($ope) {
            case 1: //sumar
                $sql = 'UPDATE pedidos 
                        SET cantidad = ? 
                        WHERE idpedido = ?';
                break;

            case 2: //restar
                $sql = 'UPDATE pedidos
                        SET cantidad = ?
                        WHERE idpedido = ?';
                break;
        }
        $params = array($cantidad, $pedido);
        return Database::storeProcedure($sql, $params);
    }

    /**
     * Método para obtener los datos del carrito para la
     * vista del cliente
     */
    public function getCarrito($factura)
    {
        $estado = 2;
        // consulta parametrizada por la factura que se
        // esta gestionando en proceso
        $sql = 'SELECT o.idpedido, o.fecha, o.idproducto, p.nombre, 
                p.precio, o.cantidad, p.precio * o.cantidad as Subtotal,
                p.existencias,o.estado
                FROM pedidos o
                INNER JOIN facturas f ON f.idfactura = o.idfactura
                INNER JOIN productos p ON p.idproducto = o.idproducto
                WHERE f.estado = ? AND f.idfactura = ?
                ORDER BY o.idpedido ASC';
        $params = array($estado, $factura);
        return Database::all($sql, $params);
    }
}
