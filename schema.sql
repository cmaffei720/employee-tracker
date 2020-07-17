DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackerDB;

CREATE TABLE employees (
id INTEGER NOT NULL AUTO_INCREMENT,
first_name VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INTEGER NOT NULL,
manager_id INTEGER,
PRIMARY KEY (id)
)

CREATE TABLE roles (
    id INTEGER NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    PRIMARY KEY (id)
)

CREATE TABLE departments (
    id INTEGER NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
)