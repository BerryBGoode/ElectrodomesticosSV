<?php
// importando las clases necesarias para 
// generar el reporte
require_once('../../helpers/report.php');
require_once('../../entities/dao/producto.php');
require_once('../../entities/dao/categoria.php');

// instanciando la clase para generar reportes
$pdf = new Report;

// setteando el titulo del reporte
$pdf->reportHeader('Productos por categoria');

$categoria = new CategoriaQuery;
$producto = new ProductoQuery;

if ($rows = $categoria->cargar()) {
    $pdf->SetFillColor(200);
    foreach ($rows as $row) {
        $pdf->SetFillColor(175);
        $pdf->Cell(0, 10, $pdf->stringEncoder('Categoria: ' . $row['categoria']), 1, 1, 'C', 1);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(10, 10, '#', 1, 0, 'C', 1);
        $pdf->Cell(130, 10, 'Nombre', 1, 0, 'C', 1);
        $pdf->Cell(46, 10, 'Precio (US$)', 1, 1, 'C', 1);
        $pdf->SetFillColor(225);
        $pdf->SetFont('Arial', 'B', 10);

        if ($values = $producto->getProductoByCategoria($row['idcategoria'])) {
            $num = 0;
            foreach ($values as $value) {
                $num++;
                $pdf->Cell(10, 10, $num, 1, 0, 'C');
                $pdf->Cell(130, 10, $pdf->stringEncoder($value['nombre']), 1, 0);
                $pdf->Cell(46, 10, '$' . $value['precio'], 1, 1);
            }
        } else {
            $pdf->cell(0, 10, $pdf->stringEncoder('Esta categoria no tiene productos registrados'), 1, 1);
        }
    }
} else {
    $pdf->cell(0, 10, $pdf->stringEncoder('No se encontraron categorias registradas'), 1, 1);
}
$pdf->Output('I', 'categorias-productos.pdf');
