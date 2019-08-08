create database BAMAZON;

drop table products;

create table products ( 
item_id VARCHAR(100),
product_name VARCHAR(100),
department_name VARCHAR (100),
price int,
stock_quantity int);

insert into products (item_id, product_name, department_name, price, stock_quantity) value ('POO', 'Diapers', 'Grocery', '11', 19);

select * from products
