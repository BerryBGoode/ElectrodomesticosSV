<?php
// archivo con las validaciones del lado del servidor
require_once '../../helpers/validate.php';

// instancia de la clase
const COMENTARIO = new Comentario;

// clase con los attrs, getters y setters
class Comentario
{

    // attrs
    private $id;
    private $pedido = array();
    private $comentario;
    private $estado;

    // set, valida el dato recibido y asignar al attr
    public function setId($id)
    {
        if (Validate::checkNaturalNumber($id)) {
            $this->id = $id;
            return true;
        }
    }

    public function setPedido($pedido)
    {
        if (Validate::checkNaturalNumber($pedido)) {
            $this->pedido = $pedido;
            return true;
        }
    }

    public function setComentario($com)
    {
        // if (Validate::checkString($com, 1, 350)) {
            $this->comentario = $com;
            return true;
        // }
    }

    public function setEstado($estado)
    {
        if (Validate::checkBool($estado)) {
            $this->estado = $estado;
            return true;
        }
    }

    // get, retorna el valor del attr
    public function getId()
    {
        return $this->id;
    }

    public function getPedido()
    {
        return $this->pedido;
    }

    public function getComentario()
    {
        return $this->comentario;
    }

    public function getEstado()
    {
        return $this->estado;
    }
}
