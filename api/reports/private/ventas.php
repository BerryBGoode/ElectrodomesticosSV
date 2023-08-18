<?php
require_once('../../helpers/report.php');
require_once('../../entities/dao/factura.php');

$pdf = new Report;
$pdf->reportHeader('Ventas por fechas');

$factura = new FacturaQuery;

if ($fechas = $factura->getFechasFacturas()) {
    $pdf->SetFillColor(200);
    foreach ($fechas as $fecha) {
        $pdf->SetFillColor(175);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(186, 10, $pdf->stringEncoder('Fecha: ' . $fecha['fecha']), 1, 1, 'C', 1);
        $pdf->Cell(10, 10, '#', 1, 0, 'C', 1);
        $pdf->Cell(45, 10, 'Nombres', 1, 0, 'C', 1);
        $pdf->Cell(45, 10, 'Apellidos', 1, 0, 'C', 1);
        $pdf->Cell(65, 10, 'Correo', 1, 0, 'C', 1);
        $pdf->Cell(21, 10, 'Pedidos', 1, 1, 'C', 1);
        $pdf->SetFillColor(225);
        $pdf->SetFont('Arial', 'B', 10);
        if ($rows = $factura->getFacturasByFechas($fecha['fecha'])) {
            $num = 0;
            foreach ($rows as $row) {
                $num++;
                $pdf->Cell(10, 10, $num, 1, 0, 'C', 1);
                $pdf->Cell(45, 10, $pdf->stringEncoder($row['nombre']), 1, 0, 'C', 1);
                $pdf->Cell(45, 10, $pdf->stringEncoder($row['apellido']), 1, 0, 'C', 1);
                $pdf->Cell(65, 10, $pdf->stringEncoder($row['correo']), 1, 0, 'C', 1);
                if ($pedidos = $factura->getCountPedidos($row['idfactura'])) {
                    foreach ($pedidos as $key) {
                        $pdf->Cell(21, 10, $pdf->stringEncoder($key['pedidos']), 1, 1, 'C', 1);
                        # code...
                    }
                }
            }
        } else {
            $pdf->cell(0, 10, $pdf->stringEncoder('No se encontraron ventas registradas en esa fecha'), 1, 1);
        }
    }
} else {
    $pdf->cell(0, 10, $pdf->stringEncoder('No se encontraron ventas registradas'), 1, 1);
}
$pdf->Output('I', 'ventas.pdf');
