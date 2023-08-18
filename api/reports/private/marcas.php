<?php
// importar las clases necesarias para crear el reporte
require_once('../../helpers/report.php');
require_once('../../entities/dao/producto.php');
require_once('../../entities/dao/marca.php');

// instanciar la clase con los estilos de la página para reportes
$pdf = new Report;
// settear el título del reporte
$pdf->reportHeader('Productos por marca');
// instanciar clases necesarias para obtener los datos requeridos
// en base al reporte
$marca = new MarcaQuery;
$producto = new ProductoQuery;

// obtener las marcas 
if ($values = $marca->cargarMarcas()) {
    // settear un color para la página
    $pdf->SetFillColor(200);
    // recorrer los valores o marcas obtenidas
    foreach ($values as $data) {
        // settear color para el encabezado de la tabla
        $pdf->SetFillColor(175);
        // setteando datos del encabezado de la tabla
        $pdf->Cell(0, 10, $pdf->stringEncoder('Marca: ' . $data['marca']), 1, 1, 'C', 1);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(10, 10, '#', 1, 0, 'C', 1);
        $pdf->Cell(130, 10, 'Nombre', 1, 0, 'C', 1);
        $pdf->Cell(46, 10, 'Precio (US$)', 1, 1, 'C', 1);

        $pdf->SetFillColor(225);
        $pdf->SetFont('Arial', 'B', 10);
        // de la marca que se en encontrado
        // buscar los productos que tenga registrado
        if ($rows = $producto->getProductosByMarca($data['idmarca'])) {
            $num = 0;
            // iterando los productos encontrados de la marca que 
            // se esta recorriendo
            foreach ($rows as $row) {
                // setteando los valores de la tabla
                $num++;
                $pdf->Cell(10, 10, $num, 1, 0, 'C');
                $pdf->Cell(130, 10, $pdf->stringEncoder($row['nombre']), 1, 0);
                $pdf->Cell(46, 10, '$' . $row['precio'], 1, 1);
            }
        } else {
            $pdf->cell(0, 10, $pdf->stringEncoder('Esta marca no tiene productos registrados'), 1, 1);
        }
    }
} else {
    $pdf->cell(0, 10, $pdf->stringEncoder('No se encontraron marcas registradas'), 1, 1);
}
// generando el reporte
$pdf->output('I', 'marcas-productos.pdf');
