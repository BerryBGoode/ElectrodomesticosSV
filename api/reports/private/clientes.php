<?php
// importar métodos para generar los reportes más la clase
// con el método que obtiene los datos que se quieren mostrar
require_once('../../entities/dto/usuario.php');
require_once('../../entities/dao/usuario.php');
require_once('../../helpers/report.php');


$pdf = new Report;

$pdf->reportHeader('Cliente frecuentes');

$clientes = new Usuario;
$query = new UsuarioQuery;
$num = 1;
if ($data = $query->getClientesFrecuentesReporte()) {
    $pdf->SetFillColor(175);
    $pdf->SetFont('Arial', 'B', 11);
    $pdf->Cell(10, 10, '#', 1, 0, 'C', 1);
    $pdf->Cell(62, 10, 'Nombres', 1, 0, 'C', 1);
    $pdf->Cell(62, 10, 'Apellidos', 1, 0, 'C', 1);
    $pdf->Cell(55, 10, 'Compras', 1, 1, 'C', 1);

    $pdf->SetFillColor(225);
    $pdf->SetFont('Arial', '', 11);

    foreach ($data as $element) {
        $pdf->Cell(10, 10, $num, 1, 0, 'C');
        $pdf->Cell(62, 10, $pdf->stringEncoder($element['nombre']), 1, 0, 'C');
        $pdf->Cell(62, 10, $pdf->stringEncoder($element['apellido']), 1, 0, 'C');
        $pdf->Cell(55, 10, $pdf->stringEncoder($element['compras']), 1, 1, 'C');
        $num++;
    }
} else {
    $pdf->Cell(0, 10, $pdf->stringEncoder('No se encontraron resultados'));
}
$pdf->Output('I', 'clientes.pdf');
