<?php
// archivo con los datos de la conexión
require_once('config.php');

header('Access-Control-Allow-Origin: *');

class Database
{
    // attr para instanciar PDO
    private static $con = null;
    // attr para ejecutar sentencias
    private static $statement = null;
    // attr para obtener y restornar errores
    private static $err = null;


    /*
     * método para hacer procedimiento de datos según el query enviado en el $query
     * este método retornará un int
     * $query es la sentencia de SQL
     * $data son los valores para el query
     * retorna 0 si existe un error en el código dentro del 'try...'
     * sino retorna los datos al realizar el 'store'
     */
    public static function storeProcedure($query, $data)
    {
        try {
            //llamar al attr, por medio de "self" referirse a la clase
            //crear objeto de la clase PDO con los attr de la conexión
            self::$con = new PDO('pgsql:host=' . SERVER . '; dbname=' . DATABASE . ';port=' . PORT, USER, PASSWORD);
            //sino hara el proceso de almacenado
            //preparando la sentencia INSERT 
            self::$statement = self::$con->prepare($query);
            //ejecutar el query con los datos y retornar el resultado
            return self::$statement->execute($data);
        } catch (PDOException $exep) {
            //si algo está mal dentro del catch retornará 0
            return self::formatError($exep->getCode(), $exep->getMessage());;
        }
    }

    /**
     * método para cargar todos los datos de una consulta sin parametros (fetchAll)
     * $query sentencia SQL
     * $values valores que retorna la consulta
     * 
     */
    public static function all($query, $data = null)
    {
        if (self::storeProcedure($query, $data)) {
            return self::$statement->fetchAll(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }

    /**
     * método para cargar todos los datos de una consulta con parametros (fetch)
     * $query sentencia SQL
     * $values valores que retorna la consulta
     * 
     */
    public static function row($query, $data = null)
    {
        if (self::storeProcedure($query, $data)) {
            return self::$statement->fetch(PDO::FETCH_ASSOC);
        } else {
            return false;
        }
    }

    /*
     * Método para obtener el id de la última fila agregada
     * $query en la consulta, $data son los parametros 
     * retorna el último id o 0 si ocurrio un problema
     */
    public static function getLastId($query, $data)
    {
        if (self::storeProcedure($query, $data)) {
            $id = self::$con->lastInsertId();
        } else {
            $id = 0;
        }
        return $id;
    }

    /*
     * Método para formatear los mensajes de error en una exepción
     * $type es el tipo de error y $msg el mensaje nativo de php (PDOExeption)
     * retorno $error o mensaje de error
     */
    public static function formatError($type, $msg)
    {
        //en dado caso el mensaje nativo se le asigna al error
        self::$err = $msg . PHP_EOL;
        //en caso de que el error nativo sea de algún tipo de tipo, establecido en el switch
        switch ($type) {
            case '7':
                //error con el servidor
                self::$err = 'Something is wrong in the server :(';
                break;
            case '42703':
                //error en algún campo de la sentencia
                self::$err = 'Field unknown';
                break;
            case '23505':
                //error de duplicación de clave en SQL
                self::$err = 'Primary key data already exist';
                break;
            case '42P01':
                //Entidad desconocida
                self::$err = 'Object or entitie unknwon';
                break;
            case '23503':
                //error de violación de llave foránea
                self::$err = 'Foreign key data already exists';
                break;
            default:
                //otro tipo de error en SQL
                self::$err = 'Something was wrong in the database';
                break;
        }
        return self::$err;
    }

    public static function getException()
    {
        return self::$err;
    }
}
