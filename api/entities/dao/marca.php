<?php
// archivo con los métodos para realizar los queries
require_once '../../helpers/database.php';

class MarcaQuery
{

    /**
     * Método para recuperar los datos registrados en 'marcas'
     * retorna un arreglo con los datos
     */
    public function cargarMarcas()
    {
        $sql = 'SELECT m.idmarca, m.marca, count(p.idproducto) as Productos
                FROM marcas m
                LEFT JOIN productos p ON p.idmarca = m.idmarca
                GROUP BY m.idmarca, m.marca
                ORDER BY m.idmarca ASC';
        return Database::all($sql);
    }

    /**
     * Método para guarda los datos de un marca
     * retorna el resultado del proceso
     */
    public function guardarMarca()
    {
        $sql = 'INSERT INTO marcas(marca) VALUES (?)';
        $param = array(MARCA->getMarca());
        return Database::storeProcedure($sql, $param);
    }

    /**
     * Método para cargar el registro seleccionado por el cliente
     * retorna un arreglo con los datos obtenidos
     */
    public function obtenerRegistro()
    {
        $sql = 'SELECT * FROM marcas WHERE idmarca = ?';
        $param = array(MARCA->getId());
        return Database::row($sql, $param);
    }

    /**
     * Método para actualizar registro
     * retorna el resultado del proceso (No. de registros actualizados)
     */
    public function actualizarMarca()
    {
        $sql = 'UPDATE marcas SET marca = ? WHERE idmarca = ?';
        $params = array(MARCA->getMarca(), MARCA->getId());
        return Database::storeProcedure($sql, $params);
    }

    /**
     * Método para eliminar registro
     * retorna resultado del proceso (No. de registros eliminados)
     */
    public function eliminarMarca()
    {
        $sql = 'DELETE FROM marcas WHERE idmarca = ?';
        $param = array(MARCA->getId());
        return Database::storeProcedure($sql, $param);
    }
}
