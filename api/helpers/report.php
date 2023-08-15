<?php
// importar la clase que genera los pdf
require_once('../../libraries/fpdf182/fpdf.php');

/**
 * clase de hereda de FPDF para personalizar la página
 */
class Report extends FPDF
{
    // url para acceder a las acciones o endpoints
    const URL = 'http://localhost/electrodomesticossv/private/';
    // attributo para guardar el título del reporte
    private $title = null;


    /*
     *  Método para iniciar el reporte con el encabezado del documento
     * Parámetro $title (título del reporte).
     * Sin retorno
     */

    public function reportHeader($title)
    {
        //Se establece la zona horaria que se quiere utilizar cuando se genere el documento del reporte
        ini_set('data.timezone', 'America/El_Salvador');
        //Se inicia una sesión o sigue la actual para poder utilizar variables de sesión en el reporte
        session_start();
        //Se verifica si se ha iniciado sesión en el sitio privado para generar el reporte, si no es así, se direcciona a la página principal.
        if (isset($_SESSION['id_user'])) {
            //Se asigna un título al documento a la propiedad de la clase.
            $this->title = $title;
            //Se esablece el título del documento (true = utf-8).
            $this->setTitle('Private - Report', true);
            //Se establecen margenes al documento en la parte izquierda, derecha y arriba.
            $this->setMargins(15, 15, 15);
            //Se añade una nueva págida al documento, de orientación vertical y en formato carta, llamando al método header().
            $this->addPage('p', 'letter');
            //Se define un alias para el número total de páginas que se muestre en el pie del documento.
            $this->aliasNbPages();
        } else {
            header('location:' . self::URL);
        }
    }

    /**
     *     Método que codifica una cadena de alfabeto español a UTF-8
     *     Parámetros: $string (cadena)
     *     Retordo, cadena convertida
     */

    public function stringEncoder($string)
    {
        return mb_convert_encoding($string, 'ISO-8859-1', 'utf-8');
    }

    /*
       *    Se modifica el método existente en la librería para configurar la plantilla del encabezado de los informes.
       *    Se manda a llamar en el método addPage()
    */
    public function header()
    {
        //Se asigna el logo
        $this->image('../../../resources/img/logos/logo.png', 15, 15, 20);
        //Se ubica el título
        $this->cell(20);
        $this->setFont('Arial', 'B', 15);
        $this->cell(166, 10, $this->stringEncoder($this->title), 0, 1, 'C');
        // Se incluye un salto de línea para visualizar el contenido principal del documento.
        $this->cell(20);
        $this->setFont('Arial', 'B', 10);
        $this->cell(166, 10, 'Date: ' . date('d/m/Y'), 0, 1, 'C');
        $this->cell(25, 10, 'Usuario: ' . $_SESSION['usuario'], 1, 1, 'C');
        $this->ln(10);
    }

    /*
       *    Se modifica el método existente en la librería para configurar la plantilla del pie de los informes.
       *    Se manda a llamar en el método addPage()
       */
    public function footer()
    {
        // Se establece la posición para el número de página (necesariamente a 15 milimetros del final).
        $this->setY(-15);
        // Se asigna fuente para el número de página
        $this->setFont('Arial', 'I', 8);
        //Se imprime una celda con el número de página
        $this->cell(0, 10, $this->stringEncoder('Página ') . $this->pageNo() . '/{nb}', 0, 0, 'C');
    }
}
