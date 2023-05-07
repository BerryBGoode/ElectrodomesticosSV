<?php
// archivo con las validaciones del lado del servidor

class Validate
{
    //attr privadas para realzar validaciones
    //attr para especificar la contraseña incorrecta
    private static $errorPassword = null;
    //attr para especificar el error en el archivo
    private static $errorFile = null;
    //attr con el nombre del archivo ingresado u obtenido
    private static $filename = null;

    /**
     * Método para obtener el error en la contraseña
     * retorna la contraseña erronea
     */
    public static function errorPassword()
    {
        return self::$errorPassword;
    }

    /**
     * Método para obtener el nombre de un archivo
     * retorna el nombre del archivo
     */
    public static function getFilename()
    {
        return self::$filename;
    }

    /**
     * Método para obtener el error cuando se valida un archivo
     * retorna el error
     */
    public static function errorFile()
    {
        return self::$errorFile;
    }

    /**
     * Método para quitar los espacios al prinicipio y final del dato que recibe
     * $data campos del formulario 
     * retorna los campos sin espacios al prinicipio y final del dato
     */
    public static function form($data)
    {
        foreach ($data as $key => $value) {
            //al dato del arreglo de $data
            //el valor del dato es igual al el mismo pero eliminando espacios demás
            $value = trim($value);
            //el param en la posición recorrida es igual valor sin espacios demás
            $data[$key] = $value;
        }
        return $data;
    }

    /**
     * Método para verficar un número natural cuando se ingresa un ID
     * $number para verificar si es natural
     * retorna true si es natural, sino retorna false
     */
    public static function checkNaturalNumber($number)
    {
        //sí el filtro aplicado a la param es un número entero que su rango menor es >= 1
        //debido q un ID no puede ser 0
        if (filter_var($number, FILTER_VALIDATE_INT, array('min_range' => 1))) {
            return true;
        }
        return false;
    }

    /**
     * Método para validar un tipo imagen
     * $file archivo, <== ($maxwidth ancho máximo, $maxheight alto máximo)
     * returna true si es con el formato establecido en este método
     */
    public static function checkImg($file, $maxwidth, $maxheight)
    {
        //variable para cuando se ejecute el caso de "verificar el tipo de imagen"
        //sea true, en caso q no se ejecute el método retornará false
        $result = false;
        //declarar el ancho, alto y el tipo de la imagen
        //es igual al getsize de la imagen del param
        list($width, $heght, $type) = getimagesize($file['tmp_name']);
        //if's con los posibles errores
        if (($file['size'] > 2097152)) {
            self::$errorFile = 'El tamaño del archivo es muy grande, deber ser menor a 2MB';
        } else if ($width > $maxwidth || $heght > $maxheight) {
            self::$errorFile = 'El tamaño de la imagen es más grande del permitido';
        } else {
            self::$errorFile = 'El formato de la imagen deber ser .jpg o .png';
        }
        //if con el caso ideal, validando el tipo de imagen
        if ($type == 2 || 3) {
            //después verificar el valor de está var
            $result = true;
            //obtener la extensión del archivo para convertir a minúsculas
            $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            //se da el valor del nombre único para archivo
            self::$filename = uniqid() . '.' . $extension;
        }
        //if para verificar si ha habido un problema o se ejecuto el 2do if
        //este if es para retornar
        if ($result) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Método para validar el formato del correo ingresado por el usuario
     * $email email ingresado por el usuario
     * retona true si es formato correcto
     */
    public static function checkEmail($email)
    {
        //si $email es tiene el formato de un "email" retorna true
        if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return true;
        }
    }

    /**
     * Método para validar un tipo booleando
     * $data valida este dato
     * retorna si el dato es booleando
     */
    public static function checkBool($data)
    {
        //verificar el param se booleano
        if ($data == 1 || $data ==  0 || $data ==  true || $data ==  false) {            
            return true;
        }
    }

    /**
     * Método para validar que el valor se un string
     * $data dato obtenido del cliente, $min long. mínima, $maxm log. máxima
     * retorna true si es un cadena
     */
    public static function checkString($data, $min, $max)
    {
        //verificar si el param cumple con la expresión regular y la long.
        if (preg_match('/^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s\,\;\.]{' . $min . ',' . $max . '}$/', $data)) {
            return true;
        }
    }

    /**
     * Método para verificar si el dato ingresado es alfabético
     * $data dato obtenido del cliente, $min long. mínima, $maxm log. máxima
     * retorna true si alfabético
     */
    public static function checkAlphabetic($data, $min, $max)
    {
        //verificar si el param cumple con la expresión regular y la long.
        if (preg_match('/^[a-zA-ZñÑáÁéÉíÍóÓúÚ\s]{' . $min . ',' . $max . '}$/', $data)) {
            return true;
        }
    }

    /**
     * Método para verificar si el dato es Alfanumérico 
     * $data dato obtenido del cliente, $min long. mínima, $maxm log. máxima
     * retorna true si es un cadena
     */
    public static function checkAlphanumeric($data, $min, $max)
    {
        //verificar si el param cumple con la expresión regular y la long.
        if (preg_match('/^[a-zA-Z0-9ñÑáÁéÉíÍóÓúÚ\s]{' . $min . ',' . $max . '}$/', $data)) {
            return true;
        }
    }

    /**
     * Método para verificar si el dato es referente al dolar
     * $data dato obtenido del cliente a verificar
     * retorna true si es monetario
     */
    public static function checkMoney($data)
    {
        //verificar si el param cumple con la expresión regular 
        if (preg_match('/^[0-9]+(?:\.[0-9]{1,2})?$/', $data)) {
            return true;
        }
    }

    /**
     * Método para verificar si la contraseña tiene el formato establecido en el método
     * $password contraseña a verificar
     * retorna true si la 6 < contraseña <= 60
     */
    public static function checkPassword($password)
    {
        //verificar la long. de la contraseña
        if (strlen($password) < 5) {
            self::$errorPassword = 'La contraseña debe tener más de 6 caracteres';
        } elseif (strlen($password) <= 25) {
            return true;
        } else {
            self::$errorPassword = 'La contraseña deber ser menor a 40 caracteres';
        }
    }

    /**
     * Método para verificar el formato del DUI
     * $data dato a verificar si tiene formato DUI (00000000-0)
     * retorna true si el formato es correcto
     */
    public static function checkDUI($data)
    {
        if (preg_match('/^[0-9]{8}[-][0-9]{1}$/', $data)) {
            return true;
        }
    }

    /**
     * Método para verificar el formato de télefono "+503"
     * $data dato a verificar si tiene formato 0000-0000
     * retorna true si cumple el formato
     */
    public static function checkPhone($data)
    {
        if (preg_match('/^[2,6,7]{1}[0-9]{3}[-][0-9]{4}$/', $data)) {
            return true;
        }
    }

    /** 
     * Método para validar cuando se sube un archivo al servidor
     * $file archivo, $path ruta del directorio y $filename nombre del archivo
     * retorna true cuando se suba el archivo al servidor de manera correcta
     */
    public static function storeFile($file, $path, $filename)
    {
        try {
            //si al subir al archivo obteniendo el nombre temporarl de archivo mientras se sube
            //pasandole la dirección donde se encuntrar el archivo y concat. con el nombre del archivo
            if (move_uploaded_file($file['tmp_name'], $path . $filename)) {
                return true;
            }
        } catch (\Throwable $th) {
            //si ocurre un problema mandar en el mensaje de error lo que sucedio
            self::$errorFile = $th;
            return false;
        }
    }

    /**
     * Método para validar la acción deborrar el archivo del servidor
     * $path es el directorio de archivo y $filename el nombre del archivo
     */
    public static function destroyFile($path, $filename)
    {
        try {
            //eliminar un archivo (unlink) pasandole la dirección de archivo y el nombre                       
            if (@unlink($path . $filename)) {
                return true;
            }
        } catch (\Throwable $th) {
            //si ocurre un problema mandar en el mensaje de error lo que sucedio
            self::$errorFile = $th;
            return false;
        }
    }

    /**
     * Método para validar cuando se sube un .pdf
     * $file refiere al archivo recibido del lado del cliente
     * retorna true sí se supo subir
     */
    public static function FunctionName($file)
    {
        //si el mime content o descripción del archivo del param es igual a la de un pdf
        if (mime_content_type($file['tmp_name']) == 'aplication/pdf') {
            //obtener la extensión del archivo para convertir en minúsculas
            $exten = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            //asignar un valor único al archivo
            self::$filename = uniqid() . '.' . $exten;
            return true;
        }
        //caso  erroneos
        if ($file['size'] > 4097152) {
            self::$errorFile = 'El archivo es mayor a 4MB';
        } else {
            self::$errorFile = 'Tipo de archivo erroneo, debe ser .pdf';
        }
    }

    /**
     * Método para recuperar el error al verificar un archivo 
     */
    public static function getErrorFile()
    {
        return self::$errorFile;
    }

    /**
     * Método para verificar el formato de una fecha
     * $date fecha a verificar
     * retorna true si el formato yyyy-mm-dd
     */
    public static function checkDate($date)
    {
        //dividir el parametro en partes, con separador '-'
        $date = explode('-', $date);
        if (checkdate($date[1], $date[2], $date[0])) {
            return true;
        }
    }
}
?>