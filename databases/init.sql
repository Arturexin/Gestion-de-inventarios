USE karpovick_db;

CREATE TABLE `users` (/* usuarios */
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(80) NOT NULL,
  phone VARCHAR(22) NOT NULL,
  password VARCHAR(255) NOT NULL,
  ruc VARCHAR(11) NOT NULL,
  direccion VARCHAR(155) NOT NULL,
  moneda VARCHAR(45) NOT NULL,
  web VARCHAR(155) NOT NULL,
  date_record datetime NOT NULL,
  state TINYINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE employees (/* colaboradores */
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  last_name VARCHAR(70) NOT NULL,
  doc VARCHAR(20) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  position VARCHAR(100) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  pension TINYINT NOT NULL,
  family TINYINT NOT NULL,
  security TINYINT NOT NULL,
  id_location INT NOT NULL,/*  */
  id_user INT NOT NULL,/*  */
  date_record DATETIME NOT NULL,
  state TINYINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


CREATE TABLE `inventory` (/* inventario */
  id INT(11) NOT NULL AUTO_INCREMENT,
  codigo VARCHAR(45) NOT NULL,
  description VARCHAR(150) NOT NULL,
  extent VARCHAR(10) NOT NULL,
  cu DECIMAL(10,2) NOT NULL,
  pv DECIMAL(10,2) NOT NULL,
  batch TINYINT NOT NULL,
  q_0 INT(11) NOT NULL,
  q_1 INT(11) NOT NULL,
  q_2 INT(11) NOT NULL,
  q_3 INT(11) NOT NULL,
  q_4 INT(11) NOT NULL,
  q_5 INT(11) NOT NULL,
  q_6 INT(11) NOT NULL,
  q_7 INT(11) NOT NULL,
  q_8 INT(11) NOT NULL,
  q_9 INT(11) NOT NULL,
  id_category INT NOT NULL,/*  */
  id_supplier INT NOT NULL,/*  */
  id_user INT NOT NULL,/*  */
  date_record DATETIME NOT NULL,
  state TINYINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `categories` (/* categorias */
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  extent VARCHAR(45) NOT NULL,
  c_0 VARCHAR(10) NOT NULL,
  c_1 VARCHAR(10) NOT NULL,
  c_2 VARCHAR(10) NOT NULL,
  c_3 VARCHAR(10) NOT NULL,
  c_4 VARCHAR(10) NOT NULL,
  c_5 VARCHAR(10) NOT NULL,
  c_6 VARCHAR(10) NOT NULL,
  c_7 VARCHAR(10) NOT NULL,
  c_8 VARCHAR(10) NOT NULL,
  c_9 VARCHAR(10) NOT NULL,
  c_10 VARCHAR(10) NOT NULL,
  c_11 VARCHAR(10) NOT NULL,
  id_user INT NOT NULL,/*  */
  date_record DATETIME NOT NULL,
  state TINYINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


CREATE TABLE `customers` (/* clientes */
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  doc VARCHAR(11) NOT NULL,
  email VARCHAR(60) NOT NULL,
  phone VARCHAR(12) NOT NULL,
  address VARCHAR(150) NOT NULL,
  -- class TINYINT NOT NULL,
  id_user INT NOT NULL,/*  */
  date_record DATETIME NOT NULL,
  state TINYINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


CREATE TABLE `suppliers` (/* proveedores */
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  doc VARCHAR(11) NOT NULL,
  email VARCHAR(60) NOT NULL,
  phone VARCHAR(12) NOT NULL,
  address VARCHAR(150) NOT NULL,
  -- class TINYINT NOT NULL,
  id_user INT(11) NOT NULL,/*  */
  date_record DATETIME NOT NULL,
  state TINYINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


CREATE TABLE `stock_in` (/* entradas */
  id INT(11) NOT NULL AUTO_INCREMENT,
  q_in INT(11) NOT NULL,
  q_out INT(11) NOT NULL,
  cause_return TINYINT NOT NULL,
  id_inventory INT NOT NULL,/*  */
  id_location INT NOT NULL,/*  */
  id_shoping INT NOT NULL,/*  */
  id_employee INT NOT NULL,/*  */
  id_user INT NOT NULL,/*  */
  date_record datetime NOT NULL,
  state TINYINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


CREATE TABLE `shoping` (/* compras */
  id INT(11) NOT NULL AUTO_INCREMENT,
  tipo_voucher VARCHAR(50),
  serie_voucher VARCHAR(20),
  num_voucher VARCHAR(20),
  modo_efectivo DECIMAL(10,2),
  modo_credito DECIMAL(10,2),
  modo_tarjeta DECIMAL(10,2),
  modo_digital DECIMAL(10,2),
  canal_venta TINYINT NOT NULL,
  situation VARCHAR(22) NOT NULL,
  id_supplier INT NOT NULL,/*  */
  id_location INT NOT NULL,/*  */
  id_user INT NOT NULL,/*  */
  date_record datetime NOT NULL,
  state TINYINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


CREATE TABLE `stock_out` (/* salidas */
  id INT(11) NOT NULL AUTO_INCREMENT,
  q_out INT(11) NOT NULL,
  q_in INT(11) NOT NULL,
  pv DECIMAL(10,2) NOT NULL,
  cause_return TINYINT NOT NULL,
  id_inventory INT NOT NULL,/*  */
  id_location INT NOT NULL,/*  */
  id_sales INT NOT NULL,/*  */
  id_employee INT NOT NULL,/*  */
  id_user INT NOT NULL,/*  */
  date_record datetime NOT NULL,
  state TINYINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


CREATE TABLE `sales` (/* ventas */
  id INT(11) NOT NULL AUTO_INCREMENT,
  tipo_voucher VARCHAR(50) NOT NULL,
  serie_voucher VARCHAR(20) NOT NULL,
  num_voucher VARCHAR(20) NOT NULL,
  modo_efectivo DECIMAL(10,2) NOT NULL,
  modo_credito DECIMAL(10,2) NOT NULL,
  modo_tarjeta DECIMAL(10,2) NOT NULL,
  modo_digital DECIMAL(10,2) NOT NULL,
  canal_venta TINYINT NOT NULL,
  situation VARCHAR(22) NOT NULL,
  id_location INT NOT NULL,/*  */
  id_customer INT NOT NULL,/*  */
  id_user INT NOT NULL,/*  */
  date_record datetime NOT NULL,
  state TINYINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


CREATE TABLE `write_off` (/* salidas sin efectivo */
  id INT(11) NOT NULL AUTO_INCREMENT,
  q INT(11) NOT NULL,
  description VARCHAR(22) NOT NULL,
  id_location INT NOT NULL,/*  */
  id_inventory INT NOT NULL,/*  */
  id_user INT NOT NULL,/*  */
  date_record datetime NOT NULL,
  state TINYINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


CREATE TABLE `location` (/* sucursales */
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  date_record datetime NOT NULL,
  id_user INT NOT NULL,/*  */
  state TINYINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


CREATE TABLE `transfers` (/* transferencias */
  id INT(11) NOT NULL AUTO_INCREMENT,
  q INT(11) NOT NULL,
  tipo_voucher VARCHAR(50) NOT NULL,
  serie_voucher VARCHAR(20) NOT NULL,
  num_voucher VARCHAR(20) NOT NULL,
  id_inventory INT NOT NULL,/*  */
  id_location_in INT NOT NULL,/*  */
  id_location_out INT NOT NULL,/*  */
  id_employee INT NOT NULL,/*  */
  id_user INT NOT NULL,/*  */
  date_record datetime NOT NULL,
  state TINYINT NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;


ALTER TABLE employees 
  ADD CONSTRAINT employees_users FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT employees_location FOREIGN KEY (id_location) REFERENCES location(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE inventory
  ADD CONSTRAINT inventory_categories FOREIGN KEY (id_category) REFERENCES categories(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT inventory_suppliers FOREIGN KEY (id_supplier) REFERENCES suppliers(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT inventory_users FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE stock_in
  ADD CONSTRAINT stockin_inventory FOREIGN KEY (id_inventory) REFERENCES inventory(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT stockin_location FOREIGN KEY (id_location) REFERENCES location(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT stockin_employee FOREIGN KEY (id_employee) REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT stockin_users FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE shoping
  ADD CONSTRAINT shoping_location FOREIGN KEY (id_location) REFERENCES location(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT shoping_suppliers FOREIGN KEY (id_supplier) REFERENCES suppliers(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT shoping_users FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE stock_out
  ADD CONSTRAINT stockout_inventory FOREIGN KEY (id_inventory) REFERENCES inventory(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT stockout_location FOREIGN KEY (id_location) REFERENCES location(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT stockout_employee FOREIGN KEY (id_employee) REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT stockout_sales FOREIGN KEY (id_sales) REFERENCES sales(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT stockout_users FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE sales
  ADD CONSTRAINT sales_location FOREIGN KEY (id_location) REFERENCES location(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT sales_customers FOREIGN KEY (id_customer) REFERENCES customers(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT sales_users FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE write_off
  ADD CONSTRAINT writeoff_location FOREIGN KEY (id_location) REFERENCES location(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT writeoff_inventory FOREIGN KEY (id_inventory) REFERENCES inventory(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT writeoff_users FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE transfers
  ADD CONSTRAINT transfers_locationin FOREIGN KEY (id_location_in) REFERENCES location(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT transfers_locationout FOREIGN KEY (id_location_out) REFERENCES location(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT transfers_inventory FOREIGN KEY (id_inventory) REFERENCES inventory(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT transfers_employee FOREIGN KEY (id_employee) REFERENCES employees(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT transfers_users FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE categories
  ADD CONSTRAINT categories_users FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE customers
  ADD CONSTRAINT customers_users FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE suppliers
  ADD CONSTRAINT suppliers_users FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE location
  ADD CONSTRAINT location_users FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE; 


INSERT INTO `users` (`id`, `name`, `last_name`, `username`, `email`, `phone`, `password`, `ruc`, `direccion`, `moneda`, `web`, `date_record`, `state`) VALUES
(1, 'Arturo', 'Trejo', 'Arturín', 'arturotrejo@hotmail.com', '926729705', 'Luter123.', '20102030401', 'Arequipa', 'Soles', '', '2025-05-18 22:04:43', 1);