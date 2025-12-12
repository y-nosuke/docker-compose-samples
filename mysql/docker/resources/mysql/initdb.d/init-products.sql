SET NAMES utf8mb4;

-- 商品管理用データベース作成
CREATE DATABASE IF NOT EXISTS product_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 作成したデータベースを使用
USE product_db;

-- 商品テーブル作成
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
CREATE TABLE products (
	product_id VARCHAR(255) NOT NULL PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	description TEXT,
	price INT NOT NULL,
	category VARCHAR(100) NOT NULL,
	stock INT NOT NULL DEFAULT 0,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 注文テーブル作成
CREATE TABLE orders (
	order_id VARCHAR(255) NOT NULL PRIMARY KEY,
	product_id VARCHAR(255) NOT NULL,
	quantity INT NOT NULL,
	total_price INT NOT NULL,
	status VARCHAR(50) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT fk_order_product FOREIGN KEY (product_id) REFERENCES products(product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 商品データの登録
INSERT INTO products (product_id, name, description, price, category, stock, created_at, updated_at) VALUES
	('product_123', 'サンプル商品A', 'これはサンプル商品Aの説明です', 1000, 'electronics', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
	('product_456', 'サンプル商品B', 'これはサンプル商品Bの説明です', 2000, 'books', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 注文データの登録
INSERT INTO orders (order_id, product_id, quantity, total_price, status, created_at) VALUES
	('order_001', 'product_123', 2, 2000, 'completed', CURRENT_TIMESTAMP),
	('order_002', 'product_123', 1, 1000, 'pending', CURRENT_TIMESTAMP),
	('order_003', 'product_456', 3, 6000, 'completed', CURRENT_TIMESTAMP);

