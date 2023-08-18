<?php
// archivo con los proceso en la db
require_once '../../helpers/database.php';
require_once '../../entities/dto/producto.php';
// clase con los queries
class ProductoQuery
{

    /**
     * Método para agregar un producto
     * retorna el valor de los datos agregados
     */
    public function guardar()
    {
        $sql = 'INSERT INTO productos(nombre, descripcion, precio, existencias, imagen, idcategoria, idmarca, estado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        $params = array(
            PRODUCTO->getProducto(), PRODUCTO->getDescripcion(), PRODUCTO->getPrecio(), PRODUCTO->getExistencias(),
            PRODUCTO->getImg(), PRODUCTO->getCategoria(), PRODUCTO->getMarca(), PRODUCTO->getEstado()
        );
        return Database::storeProcedure($sql, $params);
    }

    /**
     * Método para cargar datos
     * retorna un arreglo con los datos según la consulta
     */
    public function cargar()
    {
        $sql = 'SELECT p.idproducto, p.nombre, p.precio, p.existencias, p.imagen, c.categoria, c.idcategoria, m.marca, m.idmarca, p.estado, p.descripcion
                FROM productos p
                INNER JOIN categorias c ON c.idcategoria = p.idcategoria
                INNER JOIN marcas m ON m.idmarca = p.idmarca
                ORDER BY p.idproducto ASC';
        return Database::all($sql);
    }


    /**
     * Método para cargar productos destacados
     */
    public function cargarDestacados()
    {
        $sql = 'SELECT p.idproducto, p.nombre, p.precio, p.existencias, 
                p.imagen, c.categoria, c.idcategoria, m.marca, m.idmarca, 
                p.estado, p.descripcion, count(o.idproducto)
                FROM productos p
                INNER JOIN categorias c ON c.idcategoria = p.idcategoria
                INNER JOIN marcas m ON m.idmarca = p.idmarca
                LEFT JOIN pedidos o ON o.idproducto = p.idproducto
                GROUP BY p.idproducto, p.nombre, p.precio, p.existencias, 
                p.imagen, c.categoria, c.idcategoria, m.marca, m.idmarca, 
                p.estado, p.descripcion
                ORDER BY count(o.idproducto) DESC';
        return Database::all($sql);
    }

    /**
     * Método para eliminar producto seleccionado
     * retorna el número de registros eliminados
     */
    public function eliminar()
    {
        $sql = 'DELETE FROM productos WHERE idproducto = ?';
        $param = array(PRODUCTO->getId());
        return Database::storeProcedure($sql, $param);
    }

    /**
     * Método para actualizar estado de un producto
     * retorna el número de registros modificados
     */
    public function actualizarEstado()
    {
        $sql = 'UPDATE productos SET estado = ? WHERE idproducto = ?';
        $params = array(PRODUCTO->getEstado(), PRODUCTO->getId());
        return Database::storeProcedure($sql, $params);
    }

    /**
     * Método para obtener los datos del registro seleccionado
     * retorna un arreglo con los datos recuperados
     */
    public function registro()
    {
        $sql = 'SELECT p.idproducto, p.nombre, p.precio, p.existencias, p.imagen, c.categoria, c.idcategoria, m.marca, m.idmarca, p.estado, p.descripcion
                FROM productos p
                INNER JOIN categorias c ON c.idcategoria = p.idcategoria
                INNER JOIN marcas m ON m.idmarca = p.idmarca
                WHERE idproducto = ?';
        $param = array(PRODUCTO->getId());
        return Database::row($sql, $param);
    }

    /**
     * Método para recuperar la imagen de un registro 
     * (este método solo se usuará cuando se sube una imagen nueva)
     * retorna en una arreglo el dato recuperado
     */
    public function getImgByProducto($id)
    {
        $sql  = 'SELECT imagen FROM productos WHERE idproducto = ?';
        $param = array($id);
        $value = Database::row($sql, $param);
        return $value;
    }

    /**
     * Método para actualizar datos segú registro seleccionado
     * retorna la cantidad de registros modificados
     */
    public function actualizar($img)
    {
        // verificar la imagen, para así quitar la actual y agregar la nueva
        // (PRODUCTO->getImg() == $img) ? Validate::destroyFile(PRODUCTO->getPath(), $img) : PRODUCTO->setImg($img);        
        // borrar imagen para agregar nueva
        // print_r($img);
        // print(PRODUCTO->getPath());
        Validate::destroyFile(PRODUCTO->getPath(), $img);
        $sql = 'UPDATE productos 
                SET nombre = ?, precio = ?, existencias = ?, imagen = ?, 
                idcategoria = ?, idmarca = ?, descripcion = ? 
                WHERE idproducto = ?';

        $params = array(
            PRODUCTO->getProducto(), PRODUCTO->getPrecio(), PRODUCTO->getExistencias(),
            PRODUCTO->getImg(), PRODUCTO->getCategoria(), PRODUCTO->getMarca(),
            PRODUCTO->getDescripcion(), PRODUCTO->getId()
        );
        return Database::storeProcedure($sql, $params);
    }
    /**
     * Método para actualizar registro sin imagen
     * retorna la cantidad de registros modificados
     */
    public function actualizarSinImg()
    {
        $sql = 'UPDATE productos SET nombre = ?, precio = ?, existencias =  ?,
                idcategoria = ?, idmarca = ?, descripcion = ?
                WHERE idproducto = ?';
        $params = array(
            PRODUCTO->getProducto(), PRODUCTO->getPrecio(), PRODUCTO->getExistencias(),
            PRODUCTO->getCategoria(), PRODUCTO->getMarca(), PRODUCTO->getDescripcion(),
            PRODUCTO->getId()
        );
        return Database::storeProcedure($sql, $params);
    }

    /**
     * Metodo para obtener los productos por marcas
     */
    public function getProductosByMarca($marca)
    {
        $sql = 'SELECT nombre, precio FROM productos WHERE idmarca = ?';
        $param = array($marca);
        return Database::all($sql, $param);
    }

    /**
     * Método para obetener los productos por categoria
     */
    public function getProductoByCategoria($categoria)
    {
        $sql = 'SELECT nombre, precio FROM productos WHERE idcategoria = ?';
        $param = array($categoria);
        return Database::all($sql, $param);
    }
}
