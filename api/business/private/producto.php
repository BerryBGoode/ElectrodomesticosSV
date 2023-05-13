<?php
// archivo con los queries
require_once '../../entities/dao/producto.php';
// archivo con los attrs, getter y setter
require_once '../../entities/dto/producto.php';

$res = array('status' => 0, 'msg' => null, 'excep' => null, 'data' => null);

// verificar sí viene una acción
if (!isset($_GET['action'])) {
    $res['excep'] = 'Acción inexistente';
} else {

    session_start();

    $query = new ProductoQuery;

    if (!isset($_SESSION['idusuario'])) {
        $res['status'] = -1;
        $res['excep'] = 'Sesion inactiva, se te redireccionará para iniciar sesión';
    } else {

        switch ($_GET['action']) {

                // endpoint para guardar datos
            case 'crear':
                $_POST = Validate::form($_POST);

                if (!PRODUCTO->setProducto($_POST['producto'])) {
                    $res['excep'] = 'Nombre incorrecto';
                } elseif (!PRODUCTO->setDescripcion($_POST['descripcion'])) {
                    $res['excep'] = 'Descripción incorrecto';
                } elseif (!PRODUCTO->setPrecio($_POST['precio'])) {
                    $res['excep'] = 'Formato del precio incorrecto';
                } elseif (!PRODUCTO->setExistencias($_POST['existencias'])) {
                    $res['excep'] = 'Existencias invalidas';
                } elseif (!is_uploaded_file($_FILES['image']['tmp_name'])) {
                    $res['excep'] = 'Select one image';
                } elseif (!PRODUCTO->setImg($_FILES['image'])) {
                    $res['excep'] = Validate::getErrorFile();
                } elseif (!PRODUCTO->setCategoria($_POST['categorias'])) {
                    $res['excep'] = 'Categoria incorrecto';
                } elseif (!PRODUCTO->setMarca($_POST['marcas'])) {
                    $res['excep'] = 'Marca incorrecto';
                } elseif (!PRODUCTO->setEstado($_POST['chkestado'])) {
                    $res['excep'] = 'Estado incorrecto';
                } elseif ($query->guardar()) {
                    $res['status'] = 1;
                    if (Validate::storeFile($_FILES['image'], PRODUCTO->getPath(), PRODUCTO->getImg())) {
                        $res['msg'] = 'Registro guardado';
                    } else {
                        $res['msg'] = 'Registro guardado sin imagen';
                    }
                } else {
                    $res['excep'] = Database::getException();
                }
                break;
                // endpoint para recuperar datos (cargar y buscar)
            case 'cargar':

                if ($res['data'] = $query->cargar()) {
                    $res['status'] = 1;
                    $res['msg'] = count($res['data']);
                } elseif (Database::getException()) {
                    $res['excep'] = Database::getException();
                } else {
                    $res['excep'] = 'No existen datos registrados';
                }


                break;

            case 'eliminar':

                if (!PRODUCTO->setId($_POST['idproducto'])) {
                    $res['excep'] = 'Error al seleccionar producto';
                    // obtener datos de la imagen a borrar
                } elseif (!$producto = $query->registro()) {
                    $res['excep'] = 'Producto no registrado';
                } elseif ($query->eliminar()) {
                    $res['status'] = 1;
                    // eliminar imagen
                    if (Validate::destroyFile(PRODUCTO->getPath(), $producto['imagen'])) {
                        $res['msg'] = 'Registro eliminado';
                    } else {
                        $res['msg'] = 'Registro eliminado, ' . Validate::getErrorFile();
                    }
                } else {
                    $res['excep'] = Database::getException();
                }


                break;
                // end point para actualizar estado
            case 'actualizarEstado':


                if (!PRODUCTO->setId($_POST['idproducto'])) {
                    $res['excep'] = 'Error al seleccionar registro';
                } elseif (!PRODUCTO->setEstado($_POST['estado'])) {
                    $res['excep'] = 'Error al obtener nuevo estado';
                } elseif ($query->actualizarEstado()) {
                    $res['status'] = 1;
                } else {
                    $res['excep'] = Database::getException();
                }

                break;

            case 'registro':

                if (!PRODUCTO->setId($_POST['idproducto'])) {
                    $res['excep'] = 'Error al seleccionar registro';
                } elseif ($res['data'] = $query->registro()) {
                    $res['status'] = 1;
                } else {
                    $res['excep'] = Database::getException();
                }


                break;

            case 'actualizar':
                $_POST = Validate::form($_POST);

                // print_r($_POST);
                // print_r($_FILES['image']);

                if (!PRODUCTO->setId($_POST['idproducto'])) {
                    $res['excep'] = 'Error al obtener registro';
                    // obtener el registro, para obtener el nombre de la imagen anterior
                } elseif (!$producto = $query->registro()) {
                    $res['excep'] = 'Producto no registrado';
                } elseif (!PRODUCTO->setProducto($_POST['producto'])) {
                    $res['excep'] = 'Nombre incorrecto';
                } elseif (!PRODUCTO->setDescripcion($_POST['descripcion'])) {
                    $res['excep'] = 'Descripción incorrecto';
                } elseif (!PRODUCTO->setPrecio($_POST['precio'])) {
                    $res['excep'] = 'Formato del precio incorrecto';
                } elseif (!PRODUCTO->setExistencias($_POST['existencias'])) {
                    $res['excep'] = 'Existencias invalidas';
                    // si no se seleccionado nueva imagen
                } elseif (!PRODUCTO->setCategoria($_POST['categorias'])) {
                    $res['excep'] = 'Categoria incorrecto';
                } elseif (!PRODUCTO->setMarca($_POST['marcas'])) {
                    $res['excep'] = 'Marca incorrecto';
                } elseif (!is_uploaded_file($_FILES['image']['tmp_name'])) {

                    // sino se subio la imagen asignar valor ya guardado en el registro                    
                    if ($query->actualizarSinImg() && !Database::getException()) {
                        $res['status'] = 1;
                        $res['msg'] = 'Registro modificado';
                    } else {
                        $res['excep'] = Database::getException();
                    }
                } elseif (!PRODUCTO->setImg($_FILES['image'])) {
                    $res['excep'] = Validate::getErrorFile();
                }   // si se ha seleccionado una imagen nueva
                elseif ($query->actualizar($query->getImgByProducto(PRODUCTO->getId())) && !Database::getException()) {
                    $res['status'] = 1;

                    if (Validate::storeFile($_FILES['image'], PRODUCTO->getPath(), PRODUCTO->getImg())) {
                        $res['msg'] = 'Registro modificado nueva imagen';
                    } else {
                        $res['msg'] = 'Registro modificado sin imagen';
                    }
                } else {
                    $res['excep'] = Database::getException();
                }
                break;
            default:
                $res['excep'] = 'Acción no encontrada';
                break;
        }
    }
}
header('content-type: application/json; charset=utf-8');
print(json_encode($res));
