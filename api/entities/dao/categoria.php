<?php
// archivo con los métodos para ejecutar con la db
require_once '../../helpers/database.php';

class CategoriaQuery
{

    /**
     * Método para cargar los datos de la tabla
     * retorna un arreglo con los datos recuperados
     */
    public function cargar()
    {
        $sql = 'SELECT c.idcategoria, c.categoria, count(p.idproducto) as Productos
                FROM categorias c
                LEFT JOIN productos p ON p.idcategoria = c.idcategoria
                GROUP BY c.idcategoria, c.categoria
                ORDER BY c.idcategoria ASC';
        return Database::all($sql);
    }

    /**
     * Métoodo para insertar datos a la tabla 
     * retorna la cantidad de registros ingresados
     */
    public function guardar()
    {
        $sql = 'INSERT INTO categorias (categoria) VALUES (?)';
        $param = array(CATEGORIA->getCategoria());
        return Database::storeProcedure($sql, $param);
    }

    /**
     * Método para cargar el registro ingresado
     * retorna un arreglo con los datos recuperados del registro seleccionado
     */
    public function registro()
    {
        $sql = 'SELECT * FROM categorias WHERE idcategoria = ?';
        $param = array(CATEGORIA->getId());
        return Database::row($sql, $param);
    }

    /**
     * Método para actualizar los datos del registro seleccionado
     * retornar el número de los registros actualizados
     */
    public function actualizar()
    {
        $sql = 'UPDATE categorias SET categoria = ? WHERE idcategoria = ?';
        $params = array(CATEGORIA->getCategoria(), CATEGORIA->getId());
        return Database::storeProcedure($sql, $params);
    }

    /**
     * Método para elimiar el registro seleccionado
     * retorna la cantidad de registros eliminados
     */
    public function eliminar()
    {
        $sql = 'DELETE FROM categorias WHERE idcategoria =?';
        $param = array(CATEGORIA->getId());
        return Database::storeProcedure($sql, $param);
    }

    /**
     * Método para obtener la cantidad de productos que tiene una categoria
     */
    public function getProductosCategoria()
    {
        $sql = 'SELECT count(c.idcategoria), c.categoria
                FROM productos p
                INNER JOIN categorias c ON c.idcategoria = p.idcategoria
                GROUP BY c.categoria
                ORDER BY count(c.idcategoria) DESC';
        return Database::all($sql);
    }
}
