<?php
// archivo con las validaciones del lado del servidor
require_once '../../helpers/validate.php';

// instancia de la clase con los attr
const FACTURA  = new Factura;

class Factura
{
    // attrs de factura
    private $id;
    private $cliente;
    private $fecha;
    private $estado;

    // set: valida el dato recibido y asigna a los attrs
    public function setId($id)
    {
        if (Validate::checkNaturalNumber($id)) {
            $this->id = $id;
            return true;
        }
    }

    public function setCliente($cliente)
    {
        if (Validate::checkNaturalNumber($cliente)) {
            $this->cliente = $cliente;
            return true;
        }
    }

    public function setFecha($fecha)
    {
        if (Validate::checkDate($fecha)) {
            $this->fecha = $fecha;
            return true;
        }
    }

    public function setEstado($estado)
    {
        if (Validate::checkNaturalNumber($estado)) {
            $this->estado = $estado;
            return true;
        }
    }

    // get, obtene el valor que tiene el attr
    public function getId()
    {
        return $this->id;
    }

    public function getCliente()
    {
        return $this->cliente;
    }

    public function getFecha()
    {
        return $this->fecha;
    }

    public function getEstado()
    {
        return $this->estado;
    }
}
