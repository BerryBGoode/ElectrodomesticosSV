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
}
