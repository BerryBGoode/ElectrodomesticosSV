import { request } from "../controller.js";

const COMENTARIO = 'business/private/comentario.php';
const PEDIDO = 'business/private/pedido.php'
const CATEGORIA = 'business/private/categoria.php'
const MARCA = 'business/private/marca.php';


document.addEventListener('DOMContentLoaded', async () => {
    cantidadComentarioProducto();
    productoMasVendido();
    productosCategoria();
    ventasByMes();
    productosMarca();
})

/**
 * Metodo para crear gráfica de dona según la cantidad de comentarios que tiene un producto
 */
let cantidadComentarioProducto = async () => {
    // realizar la petición
    const JSON = await request(COMENTARIO, 'cantidadComentariosProducto')
    if (JSON.status) {
        // arreglo para guarda de manera individual los campos obtenidos
        let count = [], producto = [];
        JSON.data.forEach(element => {
            count.push(element.count);
            producto.push(element.nombre);
        });
        // crear gráfica
        doughnut(producto, count, 'Top 5 productos con más comentarios', 'comentarios-producto');
    }
}

/**
 * Metodo para crear una gráfica de barra según el producto más vendido
 */
let productoMasVendido = async () => {
    // realizar petición
    const JSON = await request(PEDIDO, 'masVendido');
    // verificar sí petición -> ok
    if (JSON.status) {
        // obtener todo slos datos
        let data = [...JSON.data];
        // guardar en un arreglo llamado '', que sea igual a lo que venta del arreglo
        // cuando el nombre del objeto sea nombre
        let nombres = data.map(obj => obj.nombre)
        let count = data.map(obj => obj.count)
        bar('mas-vendidos', nombres, count, 'Cantidad', 'Productos más vendidos')
    }
}

/**
 * Método que realiza una petición que obtiene la cantidad de productos que hay por categoria
 * y las agrupa por categoria
 */
let productosCategoria = async () => {
    const JSON = await request(CATEGORIA, 'getProductosCategoria')
    if (JSON.status) {
        let data = [...JSON.data];
        let categoria = data.map(obj => obj.categoria)
        let count = data.map(obj => obj.count)
        pie('producto-categoria', 'Cantidad de productos por categoria', count, categoria)
    }
}

/**
 * Método que realizar una petición para obtener la cantidad de productos que hay por marca
 * y agruaparlas por ella
 */
let productosMarca = async () => {
    const JSON = await request(MARCA, 'productosCategoria');
    if (JSON.status) {
        let data = [...JSON.data];
        let marca = data.map(obj => obj.marca)
        let count = data.map(obj => obj.count)
        pie('producto-marca', 'Cantidad de productos por marca', count, marca)
    }
}

/**
 * Método que realiza una petición para obtener las ventas por año y renderizar la gráfica
 */
let ventasByMes = async () => {
    const JSON = await request(PEDIDO, 'ventasMes');
    if (JSON.status) {
        // guardar los datos en un arreglo con los datos de la base
        let data = [...JSON.data];
        // guardar cuando del arreglo data obtenga el elemento llamado mes
        let mes = data.map(obj => obj.mes);
        // guardar cuando del arreglo data obtenga el elemento llamado ventas
        let ventas = data.map(obj => obj.ventas)
        // generar la gráfica
        line('ventas', mes, ventas, 'Ventas')
    }
}

/**
 * Método para generar gráfica de dona
 * @param {*} labels nombre de cada elemento de la gráfica
 * @param {*} values datos de la gráfica
 * @param {*} tl titulo de la gráfica
 * @param {*} dom elemento del dom donde se aplica
 */
const doughnut = (lbl, values, tl, dom) => {
    let colors = [];
    let element = document.getElementById(dom).getContext('2d');
    values.forEach(() => {
        colors.push('#' + (Math.random().toString(16).substring(2, 8)))
    });
    let graph = new Chart(element, {
        type: 'doughnut',
        data: {
            labels: lbl,
            datasets: [{
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: tl
                }
            }
        }
    })
}

/**
 * Método para generar gráfica de barra
 * @param {*} dom elemento html donde se carga
 * @param {*} x elemento x de la gráfica
 * @param {*} y elemento y de la gráfica
 * @param {*} lbl nombre del elemento a estudiar en la gráfica
 * @param {*} tlt titulo de la gráfica
 */
const bar = (dom, x, y, lbl, tlt) => {
    let colors = [];
    let element = document.getElementById(dom).getContext('2d');
    y.forEach(() => {
        colors.push('#' + (Math.random().toString(6).substring(2, 8)))
    });
    let graph = new Chart(element, {
        type: 'bar',
        data: {
            labels: x,
            datasets: [{
                label: lbl,
                data: y,
                backgroundColor: colors,
                borderWidth: 2,
                barPercentage: 1

            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: tlt,
                title: {
                    display: true,
                    text: tlt
                }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    })
}


const pie = (dom, tlt, values, msg) => {
    // colores para agregar al gráfico
    let colors = [];
    // generar los colores en base a la cantidad de registros recibidos
    values.forEach(() => {
        // generar un color hex 
        colors.push('#' + (Math.random().toString(16)).substring(2, 8));
    });
    // elemento donde se mostrará la gráfica
    const element = document.getElementById(dom).getContext('2d');
    const graph = new Chart(element, {
        type: 'pie',
        data: {
            labels: msg,
            datasets: [{
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: tlt
                }
            }
        }
    })
}


/**
 * Método para generar una gráfica lineal (preferiblemente para ventas)
 * @param {*} dom elemento del DOM donde se mostrará la gráfica
 * @param {*} labels elementos a índependientes a estudiar 
 * @param {*} values valores a mostrar en la gráfica
 * @param {*} title titulo de la gráfica
 */
function line(dom, labels, values, title) {
    // obtener elemento del DOM donde se mostrará
    // labels = Utils.months({count: 7})
    const element = document.getElementById(dom).getContext('2d');
    // instancia del obj con las opciones de la gráfica
    const graph = new Chart(element, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: values,
                fill: true,
                borderColor: '#FFFBF2',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    })
}