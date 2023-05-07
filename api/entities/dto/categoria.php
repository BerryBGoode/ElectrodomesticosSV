<?php
// archivo con los métodos para validar datos del lado del servidor
require_once '../../helpers/validate.php';

const CATEGORIA = new Categoria;

// classe con los attrs y métodos de transferencia de datos
class Categoria
{


    // attrs de la tabla categorias
    private $id;
    private $categoria;

    // set, métodos para validar datos y asignar al attr.
    public function setId($id)
    {
        if (Validate::checkNaturalNumber($id)) {
            $this->id = $id;
            return true;
        }
    }

    public function setCategoria($categoria)
    {
        if (Validate::checkAlphabetic($categoria, 1, 50)) {
            $this->categoria = $categoria;
            return true;
        }
    }

    // get, método para obtener el valor del attr.
    public function getId()
    {
        return $this->id;
    }

    public function getCategoria()
    {
        return $this->categoria;
    }
}
