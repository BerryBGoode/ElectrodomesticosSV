<?php
require_once('../../helpers/publicReport.php');
require_once('../../entities/dao/factura.php');
require_once('../../entities/dao/usuario.php');
$pdf = new PublicReport;
$factura = new FacturaQuery;
$usuario = new UsuarioQuery;
$total = array();

// session_start();
// print_r($_SESSION);
$pdf->reportHeader('Factura');
if ($clientes = $usuario->getClienteByUser($_SESSION['cliente'])) {

    $pdf->SetFillColor(175);

    $pdf->Cell(0, 10, $pdf->stringEncoder('Cliente: ' . $clientes['nombre'] . ' ' . $clientes['apellido']), 1, 1, 'C', 1);
    $pdf->Cell(10, 10, '#', 1, 0, 'C', 1);
    $pdf->Cell(60, 10, 'Producto', 1, 0, 'C', 1);
    $pdf->Cell(35, 10, 'Precio (US$)', 1, 0, 'C', 1);
    $pdf->Cell(35, 10, 'Cantidad', 1, 0, 'C', 1);
    $pdf->Cell(46, 10, 'Subtotal', 1, 1, 'C', 1);
    if ($rows = $factura->getFactura($_SESSION['factura'])) {
        $num = 0;
        $pdf->SetFillColor(300);
        foreach ($rows as $row) {
            $num++;
            array_push($total, $row['subtotal']);
            $pdf->Cell(10, 10, $pdf->stringEncoder($num), 1, 0, 'C', 1);
            $pdf->Cell(60, 10, $pdf->stringEncoder($row['nombre']), 1, 0, 'C', 1);
            $pdf->Cell(35, 10, $pdf->stringEncoder('$' . $row['precio']), 1, 0, 'C', 1);
            $pdf->Cell(35, 10, $pdf->stringEncoder($row['cantidad']), 1, 0, 'C', 1);
            $pdf->Cell(46, 10, $pdf->stringEncoder('$' . $row['subtotal']), 1, 1, 'C', 1);
        }
        $pdf->SetFillColor(175);
        $pdf->Cell(140, 10, $pdf->stringEncoder('Total'), 1, 0, 'C', 1);
        $pdf->SetFillColor(300);
        $pdf->Cell(46, 10, $pdf->stringEncoder('$' . array_sum(array_values($total))), 1, 1, 'C', 1);
    }
} else {
    $pdf->cell(0, 10, $pdf->stringEncoder('Cliente no encontrado'), 1, 1);
}
$pdf->Output('I', 'factura.pdf');
