<?php
// archivo con los procesos directo con la base de datos
require_once '../../helpers/database.php';

// clase con los queries
class PedidoQuery
{
    /**
     * Método para cargar los productos
     * retorna un arreglo con los datos recuperados
     */
    public function cargaProducto(){
        $sql = 'SELECT * FROM productos';
        return Database::all($sql);
    }
    
}
?>