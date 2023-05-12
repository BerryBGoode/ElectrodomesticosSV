CREATE TABLE categorias(
	idcategoria serial primary key,
	categoria character varying(50) not null
);

CREATE TABLE marcas(
	idmarca serial primary key,
	marca character varying(50) not null
);

CREATE TABLE usuarios(
	idusuario serial primary key,
	nombreusuario character varying(80) not null,
	clave character varying(1000) not null,
	nombre character varying(35) not null,
	apellido character varying(45) not null,
	correo character varying(150) not null,
	direccion character varying(400) null,
	tipousuario integer not null,
	estado integer not null,
	constraint u_nombreusuario unique (nombreusuario),
	constraint u_correo unique (correo)
);


CREATE TABLE productos(
	idproducto serial primary key,
	nombre character varying(55) not null,
	descripcion character varying(150),
	precio numeric(5,2) not null,
	existencias integer not null,
	imagen character varying(75) not null,
	idcategoria integer not null,
	idmarca integer not null,
	estado boolean not null,
	constraint chk_existencia check (existencias >= 0),
	constraint fk_categoria foreign key (idcategoria) references categorias(idcategoria),
	constraint fk_marca foreign key (idmarca) references marcas(idmarca)
);

CREATE TABLE facturas(
	idfactura serial primary key,
	fecha date not null default current_date,
	idcliente integer not null,
	estado integer not null,
	constraint fk_cliente foreign key (idcliente) references usuarios(idusuario)
);

CREATE TABLE pedidos(
	idpedido serial primary key,
	fecha date not null default current_date,
	idproducto integer not null,
	idfactura integer not null,
	cantidad integer not null,
	estado integer not null,
	constraint chk_cantidad CHECK (cantidad >= 1),
	constraint fk_producto foreign key (idproducto) references productos(idproducto),
	constraint fk_factura foreign key (idfactura) references facturas(idfactura)
);

CREATE TABLE comentarios(
	idcomentario serial primary key,
	comentario character varying(350) not null,
	idpedido integer not null,
	fecha date not null default current_date, 
	constraint fk_pedido foreign key (idpedido) references pedidos(idpedido)
);

insert into categorias (categoria) values ('Televisores'), ('Camaras'), ('Lavadoras'), ('Cafeteras'), ('Planchas');
insert into marcas(marca) values ('Samsung'), ('Sony'), ('LG');
SELECT * FROM productos

SELECT c.idcategoria, c.categoria, count(p.idproducto) as Productos
                FROM categorias c
                LEFT JOIN productos p ON p.idcategoria = c.idcategoria
                GROUP BY c.idcategoria, c.categoria
                ORDER BY c.idcategoria ASC

SELECT p.idproducto, p.nombre, p.precio, p.existencias, p.imagen, c.categoria, c.idcategoria, m.marca, m.idmarca, p.estado, p.descripcion
FROM productos p
INNER JOIN categorias c ON c.idcategoria = p.idcategoria
INNER JOIN marcas m ON m.idmarca = p.idmarca
ORDER BY p.idproducto ASC

SELECT * FROM usuarios

SELECT f.idfactura, f.idcliente, u.nombre, u.apellido, u.correo, f.fecha, f.estado
FROM facturas f
INNER JOIN usuarios u ON u.idusuario = f.idcliente

CREATE OR REPLACE FUNCTION FUN_descontarExistencia() 
RETURNS TRIGGER 
LANGUAGE PLPGSQL
AS
$$
DECLARE 
	_cantidad_ integer;
BEGIN
	SELECT cantidad FROM pedidos ORDER BY idpedido DESC LIMIT 1 INTO _cantidad_;
	UPDATE productos SET existencias = existencias - _cantidad_;
	RETURN NEW;
END
$$;
SELECT * FROM pedidos
CREATE OR REPLACE TRIGGER TGG_descontarExistencia AFTER INSERT ON pedidos
	FOR EACH ROW
	EXECUTE PROCEDURE FUN_descontarExistencia()
	
	
CREATE OR REPLACE FUNCTION FUN_agregarExistencia() RETURNS TRIGGER AS $$
BEGIN
	UPDATE productos
	SET existencias = existencias + (OLD.cantidad - NEW.cantidad)
	WHERE idproducto = OLD.idproducto;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql

CREATE OR REPLACE TRIGGER TGG_agregarExistencia
AFTER UPDATE ON pedidos
FOR EACH ROW
EXECUTE FUNCTION FUN_agregarExistencia();


select * from PRODUCTOS

INSERT INTO pedidos(fecha, idproducto, idfactura, cantidad, estado)
                    VALUES ('2023-05-04', 34, 1, 2, 1)

UPDATE pedidos SET fecha = '2023-05-04', idproducto = 34, cantidad = 4 WHERE idpedido = 22
                    VALUES (, 34, 1, 2, 1)
	
	ALTER TABLE productos DROP CONSTRAINT chk_existencia
SELECT o.idpedido, o.fecha, p.idproducto, p.nombre, p.precio, o.cantidad, (o.cantidad * p.precio) as Subtotal, o.estado
FROM pedidos o
INNER JOIN productos p ON p.idproducto = o.idproducto

ALTER TABLE comentarios ADD column estado boolean not null default false

SELECT idfactura FROM facturas WHERE idcliente = 29

SELECT c.fecha, u.correo, p.nombre, c.comentario, c.estado
FROM comentarios c
INNER JOIN pedidos o ON o.idpedido = c.idpedido
INNER JOIN productos p ON p.idproducto = o.idproducto
INNER JOIN facturas f ON f.idfactura = o.idfactura
INNER JOIN usuarios u ON u.idusuario = f.idcliente

SELECT c.idcomentario, c.fecha, o.idpedido ,u.correo, p.nombre, c.comentario, c.estado
                FROM comentarios c
                INNER JOIN pedidos o ON o.idpedido = c.idpedido
				
			
                INNER JOIN productos p ON p.idproducto = o.idproducto
                INNER JOIN facturas f ON f.idfactura = o.idfactura
                INNER JOIN usuarios u ON u.idusuario = f.idcliente
				WHERE c.idcomentario = 1
                ORDER BY c.idcomentario ASC           