DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (

	item_id INT AUTO_INCREMENT_ID NOT NULL,

	product_name VARCHAR(100) NOT NULL,

	department_name VARCHAR(100) NOT NULL,

	price DECIMAL(10,2) NOT NULL,

	stock_quantity INT (10),

	PRIMARY KEY(item_id)
)

SElECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES 

('Fire TV Stick with Alexa Voice Remote', 'Electronics', 39.99, 500),
('Roku Streaming Stick', 'Electronics', 39.99, 250),
('Apple TV 4K - 32GB', 'Electronics', 179.00, 1000),
('MistAire Ultrasonic Cool Mist Humidifier', 'Home & Kitchen', 33.99, 80),
('Freshware Meal Prep Containers 15-Pack]', 'Home & Kitchen', 14.97, 800),
('Keurig K55/K-Classic Coffee Maker', 'Home & Kitchen', 84.52, 750),
('Digital Kitchen Scale - Food Scale', 'Home & Kitchen', 9.99, 350),
('Scotch Heavy Duty Packaging Tape 6-Rolls', 'Office Products', 12.79, 2000),
('Scissors 8" Straight Titanium Bonded 2-Pack', 'Office Products', 14.99, 900),
('AT-A-GLANCE Monthly Desk Pad Calendar,', 'Office Products', 9.99, 1000),
