-------------------- inquirer.js ----------------------
-- [inquirer.js] updateRoleQ - 2nd question's choices func
-- Bring all roles except current person's role.
SELECT 
    title
FROM
    role
        LEFT JOIN
    employee ON role.id = employee.role_id
WHERE CONCAT(first_name, ' ', last_name) != 'tom dodd' || CONCAT(first_name, ' ', last_name) IS NULL;


-------------------- app.js ----------------------
-- Show all employees
SELECT 
    e.id,
    e.first_name,
    e.last_name,
    role.title,
    department.name AS department,
    salary,
    CONCAT_WS(' ', m.first_name, m.last_name) AS manager
FROM
    employee e
        LEFT JOIN
    employee m ON e.manager_id = m.id
        LEFT JOIN
    role ON role.id = e.role_id
        LEFT JOIN
    department ON department.id = role.department_id;


-- Show all departments
SELECT * FROM department

-- Show all role
SELECT 
    role.id, title, salary, department.name AS department
FROM
    role
        LEFT JOIN
    department ON role.department_id = department.id;

-- Show all employees by department
SELECT 
	department.name AS department,
    first_name,
    last_name,
    role.title,
    salary
FROM
    employee
        LEFT JOIN
    role ON role.id = employee.role_id
        LEFT JOIN
    department ON department.id = role.department_id ORDER BY department;

-- Show all employees by manager
SELECT 
    IFNULL(CONCAT(m.first_name, ' ', m.last_name),"") AS manager,
    e.first_name,
    e.last_name,
    role.title,
    salary
FROM
    employee e
        LEFT JOIN
    employee m ON m.id = e.manager_id
        LEFT JOIN
    role ON role.id = e.role_id
        LEFT JOIN
    department ON department.id = role.department_id
ORDER BY CASE when manager = "" THEN 1 ELSE 0 END, manager;


-- Add employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (
        ?, 
        ?, 
        (SELECT id FROM role WHERE title = ?),
        (SELECT id FROM (SELECT * FROM employee) AS copiedEmployee WHERE CONCAT(first_name, " ", last_name) = ?)
        );

-- Add department
INSERT INTO department SET name = ?;


-- Update employee's role
UPDATE employee SET role_id = (SELECT id FROM role WHERE title = ?) WHERE CONCAT(first_name, " ", last_name) = ?;

-- Update employee's manager
UPDATE employee SET manager_id = (SELECT id FROM (SELECT * FROM employee) AS copied WHERE CONCAT(first_name, " ", last_name) = ?) WHERE CONCAT(first_name, " ", last_name) = ?;


-- Delete employee
DELETE FROM employee WHERE CONCAT(first_name, " ", last_name) = ?;

-- Delete department
DELETE FROM department WHERE name = ?

-- Delete role
DELETE FROM role WHERE title = ?


-- Check the total salaries of each department
SELECT 
    IFNULL(name, 'no dept') AS department, IFNULL(SUM(salary),0) AS total
FROM
    employee
        LEFT JOIN
    role ON employee.role_id = role.id
        LEFT JOIN
    department ON department.id = role.department_id
GROUP BY name
ORDER BY CASE
    WHEN department = 'no dept' THEN 1
    ELSE 0
END , department;