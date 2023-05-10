<?php
// archivon con las validaciones del lado del servidor
require_once '../../helpers/validate.php';

// instancia de la clase 
const PEDIDO = new Pedido;
// clase con los attr. de la tabla pedidos
class Pedido
{
    // attrs
    private $id;
    private $fecha;
    private $producto;
    private $factura;
    private $cantidad;
    private $estado;

    // set, valida el dato recibido y lo asigna al respectivo attr
    public function setId($id)
    {
        if (Validate::checkNaturalNumber($id)) {
            $this->id = $id;
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

    public function setProducto($producto)
    {
        if (Validate::checkNaturalNumber($producto)) {
            $this->producto = $producto;
            return true;
        }
    }

    public function setFactura($factura)
    {
        if (Validate::checkNaturalNumber($factura)) {
            $this->factura = $factura;
            return true;
        }
    }

    public function setCantidad($cantidad)
    {
        if (Validate::checkNaturalNumber($cantidad)) {
            $this->cantidad = $cantidad;
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

    // get, retorna el valor de attr invocado
    public function getId()
    {
        return $this->id;
    }

    public function getFecha()
    {
        return $this->fecha;
    }

    public function getProducto()
    {
        return $this->producto;
    }
    public function getFactura()
    {
        return $this->factura;
    }

    public function getCantidad()
    {
        return $this->cantidad;
    }

    public function getEstado()
    {
        return $this->estado;
    }
}
?>