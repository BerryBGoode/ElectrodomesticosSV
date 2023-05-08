<?php
// archivo con las validaciones
require_once('../../helpers/validate.php');

const USUARIO = new Usuario;

class Usuario
{


    // attrs según col de la tabla usuarios
    private $id;
    private $usuario;
    private $clave;
    private $nombres;
    private $apellidos;
    private $correo;
    private $direccion;
    /**
     * * tipos de usuarios: 
     * * 1 = Administrador
     * * 2 = Cliente
     */
    private $tipo;
    /**
     * * estados:
     * * 1 = Activo
     * * 2 = Inactivo
     */
    private $estado;

    // get, obtener los datos de esta clase
    // set, enviar los datos a los attrs de esta clase

    public function getId()
    {
        return $this->id;
    }

    public function setId($id)
    {
        if (Validate::checkNaturalNumber($id)) {
            $this->id = $id;
            return true;
        }
    }

    public function getUsuario()
    {
        return $this->usuario;
    }

    public function setUsuario($usuario)
    {
        if (Validate::checkAlphabetic($usuario, 1, 80)) {
            $this->usuario = $usuario;
            return true;
        }
    }

    public function getClave()
    {
        return $this->clave;
    }

    public function setClave($clave)
    {
        if (Validate::checkPassword($clave)) {
            $this->clave = password_hash($clave, PASSWORD_DEFAULT); //2y en la clave hashada
            return true;
        }
    }

    public function getNombres()
    {
        return $this->nombres;
    }

    public function setNombres($nombres)
    {
        if (Validate::checkAlphabetic($nombres, 1, 35)) {
            $this->nombres = $nombres;
            return true;
        }
    }

    public function getApellidos()
    {
        return $this->apellidos;
    }

    public function setApellidos($apellidos)
    {
        if (Validate::checkAlphabetic($apellidos, 1, 45)) {
            $this->apellidos = $apellidos;
            return true;
        }
    }

    public function getCorreo()
    {
        return $this->correo;
    }

    public function setCorreo($correo)
    {
        if (Validate::checkEmail($correo)) {
            $this->correo = $correo;
            return true;
        }
    }

    public function getDireccion()
    {
        return $this->direccion;
    }

    public function setDireccion($direccion)
    {
        if (Validate::checkString($direccion, 1, 400)) {
            $this->direccion = $direccion;
            return true;
        }
    }

    public function getTipoUsuario()
    {
        return $this->tipo;
    }

    public function setTipoUsuario($tipo)
    {
        if (Validate::checkNaturalNumber($tipo)) {
            $this->tipo = $tipo;
            return true;
        }
    }

    public function getEstado()
    {
        return $this->estado;
    }

    public function setEstado($estado)
    {
        if (Validate::checkNaturalNumber($estado)) {
            $this->estado = $estado;
            return true;
        }
    }
}
