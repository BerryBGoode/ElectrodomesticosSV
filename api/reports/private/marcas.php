<?php
// importar las clases necesarias para crear el reporte
require_once('../../helpers/report.php');
require_once('../../entities/dao/producto.php');
require_once('../../entities/dao/marca.php');

$pdf = new Report;

$pdf->reportHeader('Productos por marca');
$marca = new MarcaQuery;
$producto = new ProductoQuery;

if ($values = $marca->cargarMarcas()) {
    $pdf->SetFillColor(200);
    foreach ($values as $data) {
        $pdf->SetFillColor(175);
        $pdf->Cell(0, 10, $pdf->stringEncoder('Marca: ' . $data['marca']), 1, 1, 'C', 1);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(10, 10, '#', 1, 0, 'C', 1);
        $pdf->Cell(75, 10, 'Nombre', 1, 0, 'C', 1);
        $pdf->Cell(25, 10, 'Precio (US$)', 1, 0, 'C', 1);
        $pdf->Cell(75.9, 10, 'Descripcion', 1, 1, 'C', 1);

        $pdf->SetFillColor(225);
        $pdf->SetFont('Arial', 'B', 10);
        if ($rows = $producto->getProductosByMarca($data['idmarca'])) {
            $num = 0;
            foreach ($rows as $row) {
                $num++;
                $pdf->Cell(10, 10, $num, 1, 0, 'C');
                $pdf->Cell(75, 10, $pdf->stringEncoder($row['nombre']), 1, 0);
                $pdf->Cell(25, 10, '$' . $row['precio'], 1, 0);
                $pdf->Cell(75.9, 10, $pdf->stringEncoder($row['descripcion']), 1, 1);
            }
        } else {
            $pdf->cell(0, 10, $pdf->stringEncoder('Esta marca no tiene productos registrados'), 1, 1);
        }
    }
} else {
    $pdf->cell(0, 10, $pdf->stringEncoder('No se encontraron marcas registradas'), 1, 1);
}
$pdf->output('I', 'marcas-productos.pdf');
