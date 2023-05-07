<?php
// archivo con las validaciones del lado del servidor
require_once '../../helpers/validate.php';

// instancia de la clase
const PRODUCTO = new Producto;

// clase son los attrs, getter y setter
class Producto
{

    // attrs
    private $id;
    private $producto;
    private $descripcion;
    private $precio;
    private $existencias;
    private $categoria;
    private $marca;
    private $estado;
    private $img;
    public $path = '../../images/productos/';

    // set, método para validar dato recibido y asignar al attr
    public function setId($id)
    {
        if (Validate::checkNaturalNumber($id)) {
            $this->id = $id;
            return true;
        }
    }

    public function setDescripcion($descripcion)
    {
        if (Validate::checkAlphanumeric($descripcion, 1, 150)) {
            $this->descripcion = $descripcion;
            return true;
        }
    }

    public function setProducto($producto)
    {
        if (Validate::checkAlphabetic($producto, 1, 55)) {
            $this->producto = $producto;
            return true;
        }
    }

    public function setPrecio($precio)
    {
        if (Validate::checkMoney($precio)) {
            $this->precio = $precio;
            return true;
        }
    }

    public function setExistencias($exis)
    {
        if (Validate::checkNaturalNumber($exis) && $exis >= 1) {
            $this->existencias = $exis;
            return true;
        }
    }

    public function setCategoria($categoria)
    {
        if (Validate::checkNaturalNumber($categoria)) {
            $this->categoria = $categoria;
            return true;
        }
    }

    public function setMarca($marca)
    {
        if (Validate::checkNaturalNumber($marca)) {
            $this->marca = $marca;
            return true;
        }
    }

    public function setEstado($estado)
    {
        if (Validate::checkBool($estado)) {
            $this->estado = $estado;
            return true;
        }
    }

    public function setImg($name)
    {
        if (Validate::checkImg($name, 700, 700)) {
            $this->img = Validate::getFilename();
            return true;
        }
    }

    // get, retorna el valor que tiene el attr
    public function getId()
    {
        return $this->id;
    }

    public function getProducto()
    {
        return $this->producto;
    }

    public function getDescripcion()
    {
        return $this->descripcion;
    }

    public function getPrecio()
    {
        return $this->precio;
    }

    public function getExistencias()
    {
        return $this->existencias;
    }

    public function getCategoria()
    {
        return $this->categoria;
    }

    public function getMarca()
    {
        return $this->marca;
    }

    public function getEstado()
    {
        return $this->estado;
    }

    public function getImg()
    {
        return $this->img;
    }

    public function getPath()
    {
        return $this->path;
    }
}
?>