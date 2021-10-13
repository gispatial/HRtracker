DROP DATABASE IF EXISTS hr_tracker;
CREATE DATABASE hr_tracker;

USE hr_tracker;

CREATE TABLE department (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);    

CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT,
    FOREIGN KEY (department_id)
        REFERENCES department (id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT DEFAULT NULL,
    FOREIGN KEY (role_id)
        REFERENCES role (id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (manager_id)
        REFERENCES employee (id) ON DELETE SET NULL ON UPDATE CASCADE
);






