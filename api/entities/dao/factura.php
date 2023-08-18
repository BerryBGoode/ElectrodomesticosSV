<?php
// archivo con los procesos internos con la base de datos
require_once '../../helpers/database.php';

// clase con los queries
class FacturaQuery
{

    /**
     * Método para cargar los datos del cliente seleccionado
     * por el correo seleccionado
     * retorna un arreglo con los datos
     */
    public function getClientByCorreo($cliente)
    {
        $sql = 'SELECT * FROM usuarios WHERE idusuario = ? OR correo = ?';
        $param = array($cliente, $cliente);
        return Database::row($sql, $param);
    }

    /**
     * Método par agregar un fectua,
     * retorna el resultado del proceso     
     */
    public function guardaFactura($estado)
    {
        $sql = 'INSERT INTO facturas(idcliente, fecha, estado)
                VALUES (?, ?, ?)';
        $params = array(FACTURA->getCliente(), FACTURA->getFecha(), $estado);
        return Database::storeProcedure($sql, $params);
    }

    /**
     * Método para obtener los datos registrados
     * retorna el resultado de la consulta
     */
    public function cargar()
    {
        $sql = 'SELECT f.idfactura, f.idcliente, u.nombre, u.apellido, u.correo, f.fecha, f.estado
                FROM facturas f
                INNER JOIN usuarios u ON u.idusuario = f.idcliente
                ORDER BY f.idfactura ASC';
        return Database::all($sql);
    }

    /**
     * Método par cambiar el estado de una factura
     * retorna el número de registros modificados
     */
    public function actualizarEstado()
    {
        $sql = 'UPDATE facturas SET estado = ? WHERE idfactura = ?';
        $params = array(FACTURA->getEstado(), FACTURA->getId());
        return Database::storeProcedure($sql, $params);
    }

    /**
     * Método para eliminar una factura
     * retorna los registros eliminadosß
     */
    public function eliminar()
    {
        $sql = 'DELETE FROM facturas WHERE idfactura = ?';
        $param = array(FACTURA->getId());
        return Database::storeProcedure($sql, $param);
    }

    /**
     * Método para obtener los datos del registro seleccionado
     * retorna un arreglo con los datos recuperados de la consulta
     */
    public function registro()
    {
        $sql = 'SELECT f.idfactura, f.idcliente, u.nombre, u.apellido, u.correo, f.fecha, f.estado
                FROM facturas f
                INNER JOIN usuarios u ON u.idusuario = f.idcliente
                WHERE f.idfactura = ?';
        $param = array(FACTURA->getId());
        return Database::row($sql, $param);
    }

    /**
     * Método para actualizar registro seleccionado
     * retorna el número de registro modificados
     */
    public function actualizar()
    {
        $sql = 'UPDATE facturas SET idcliente = ?, fecha = ? WHERE idfactura = ?';
        $params = array(FACTURA->getCliente(), FACTURA->getFecha(), FACTURA->getId());
        return Database::storeProcedure($sql, $params);
    }

    /**
     * Método para obtener las facturas pendientes de un cliente
     */
    public function getFacturasCliente($cliente, $estado)
    {
        $sql = 'SELECT idfactura 
                FROM facturas 
                WHERE idcliente = ? AND estado = ?';
        $params = array($cliente, $estado);
        return Database::all($sql, $params);
    }

    /**
     * Método para obtener la factura actual 
     * o pendiente de un cliente
     */
    public function getFacturaActual($cliente)
    {
        $estado = 2;
        $sql = 'SELECT idfactura 
                FROM facturas 
                WHERE idcliente = ? 
                AND estado = ?;';
        $params = array($cliente, $estado);
        return Database::row($sql, $params);
    }

    /**
     * Método para obtener el id de la última factura
     * para poder crear un pedido con esa factura
     */
    public function getLastFactura()
    {
        $sql = 'SELECT idfactura 
                FROM facturas 
                ORDER BY idfactura DESC LIMIT 1';
        return Database::row($sql);
    }

    public function getCountPedidos($factura)
    {
        $sql = 'SELECT count(idfactura) as pedidos
                FROM pedidos
                WHERE idfactura = ?';
        $param = array($factura);
        return Database::all($sql, $param);
    }

    public function getFechasFacturas()
    {
        $sql = 'SELECT fecha
                FROM facturas
                GROUP BY fecha
                ORDER BY fecha ASC';
        return Database::all($sql);
    }

    public function getFacturasByFechas($fecha)
    {
        $sql = 'SELECT u.nombre, u.apellido, u.correo, f.idfactura
                FROM facturas f
                INNER JOIN usuarios u ON u.idusuario = f.idcliente
                WHERE f.fecha = ?
                ORDER BY f.idfactura ASC';
        $param = array($fecha);
        return Database::all($sql, $param);
    }

    /**
     * Método para cargar el historial 
     * de facturas que tiene un cliente
     */
    public function getHistorial($cliente)
    {
        $sql = 'SELECT f.idfactura, f.fecha, sum(o.cantidad) productos ,sum(p.precio * o.cantidad) as total , f.estado
                FROM facturas f
                INNER JOIN pedidos o ON o.idfactura = f.idfactura
                INNER JOIN productos p ON p.idproducto = o.idproducto
                WHERE f.idcliente = ?
                GROUP BY f.idfactura, f.fecha, f.estado';
        $param = array($cliente);
        return Database::all($sql, $param);
    }

    public function getFactura($factura)
    {
        $sql = 'SELECT o.idpedido, f.idfactura, o.fecha, p.nombre, p.precio, o.cantidad, (p.precio * o.cantidad) as subtotal
                FROM pedidos o
                INNER JOIN productos p on o.idproducto = p.idproducto
                INNER JOIN facturas f on f.idfactura = o.idfactura
                WHERE f.idfactura = ?';
        $param = array($factura);
        return Database::all($sql, $param);
    }
}
