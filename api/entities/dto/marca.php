<?php
// archivo con validaciones del lado del servidor
require_once '../../helpers/validate.php';

const MARCA = new marca;

class marca
{

    // attrs según col de la tabla 'marcas'
    private $id;
    private $marca;

    // set, enviar dato donde se invoque, validar y asignar a los attrs
    // get, obtener los datos
    public function setId($id)
    {
        if (Validate::checkNaturalNumber($id)) {
            $this->id = $id;
            return true;
        }
    }

    public function getId()
    {
        return $this->id;
    }

    public function setMarca($marca)
    {
        if (Validate::checkAlphanumeric($marca, 1, 50)) {
            $this->marca = $marca;
            return true;
        }
    }

    public function getMarca()
    {
        return $this->marca;
    }
}
