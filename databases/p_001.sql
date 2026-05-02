
CREATE TABLE IF NOT EXISTS 'products' (
    'id_product' BIGINT NOT NULL AUTO_INCREMENT,
    'name' VARCHAR(255) NOT NULL,
    'description' TEXT,
    'sku' VARCHAR(50) NOT NULL,
    'codigo' VARCHAR(50) NOT NULL,
    'id_category' BIGINT NOT NULL,
    'flag_descuento' TINYINT NOT NULL,
    'flag_impuesto' TINYINT NOT NULL,
    'brand' VARCHAR(255) NOT NULL,
    'model' VARCHAR(255) NOT NULL,
    'date_start' DATETIME NOT NULL,
    'date_update' DATETIME NOT NULL,
    'id_provider' BIGINT NOT NULL,
    'id_user' BIGINT NOT NULL,
    'state' TINYINT NOT NULL,
    PRIMARY KEY ('id_product'),
    UNIQUE KEY 'sku' ('sku'),
    FOREIGN KEY ('id_category') REFERENCES 'category'('id_category'),
    FOREIGN KEY ('id_provider') REFERENCES 'provider'('id_provider'),
    FOREIGN KEY ('id_user') REFERENCES 'users'('id_user')
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS 'category' (
    'id_category' BIGINT NOT NULL AUTO_INCREMENT,
    'name' VARCHAR(255) NOT NULL,
    'description' TEXT,
    'date_start' DATETIME NOT NULL,
    'date_update' DATETIME NOT NULL,
    'state' TINYINT NOT NULL,
    'id_user' BIGINT NOT NULL,
    'id_parent' BIGINT NOT NULL,
    PRIMARY KEY ('id_category'),
    FOREIGN KEY ('id_user') REFERENCES 'users'('id_user'),
    FOREIGN KEY ('id_parent') REFERENCES 'category'('id_category')
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS 'inventary' (
    'id_inventory' BIGINT NOT NULL AUTO_INCREMENT,
    'id_product' BIGINT NOT NULL,
    'stock_now' INT NOT NULL,
    'stock_min' INT NOT NULL,
    'stock_max' INT NOT NULL,
    'id_unit' INT NOT NULL,
    'id_price' BIGINT NOT NULL,
    'id_sucursal' BIGINT NOT NULL,
    'id_user' BIGINT NOT NULL,
    'date_start' DATETIME NOT NULL,
    'date_update' DATETIME NOT NULL,
    'state' TINYINT NOT NULL,
    PRIMARY KEY ('id_inventory'),
    FOREIGN KEY ('id_product') REFERENCES 'products'('id_product'),
    FOREIGN KEY ('id_sucursal') REFERENCES 'sucursal'('id_sucursal'),
    FOREIGN KEY ('id_user') REFERENCES 'users'('id_user'),
    FOREIGN KEY ('id_unit') REFERENCES 'unit'('id_unit'),
    FOREIGN KEY ('id_price') REFERENCES 'price'('id_price')
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE IF NOT EXISTS 'price' (
    'id_price' BIGINT NOT NULL AUTO_INCREMENT,
    'price_cost' DECIMAL(10,2) NOT NULL,
    'price_sale' DECIMAL(10,2) NOT NULL,
    'price_offer' DECIMAL(10,2) NOT NULL,
    'date_start' DATETIME NOT NULL,
    'date_update' DATETIME NOT NULL,
    'state' TINYINT NOT NULL,
    'id_user' BIGINT NOT NULL,
    PRIMARY KEY ('id_price'),
    FOREIGN KEY ('id_user') REFERENCES 'users'('id_user')
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;