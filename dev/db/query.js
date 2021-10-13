module.exports = {
  getAllRolesExcept: `SELECT 
                            title
                        FROM
                            role
                        WHERE
                            title != (SELECT 
                                            title
                                        FROM
                                            employee
                                                LEFT JOIN
                                            role ON role.id = employee.role_id
                                        WHERE
                                            CONCAT(employee.first_name, ' ', last_name) = ?)`,
  getAllEmployees: `SELECT 
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
                        department ON department.id = role.department_id`,
  getAllDepartments: `SELECT * FROM department`,
  getAllRoles: `SELECT 
                    role.id, title, salary, department.name AS department
                FROM
                    role
                        LEFT JOIN
                    department ON role.department_id = department.id;`,
  getAllEmployeesByDept: `SELECT 
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
                            department ON department.id = role.department_id ORDER BY department`,
  getAllEmployeesByManager: `SELECT 
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
                            ORDER BY CASE when manager = "" THEN 1 ELSE 0 END, manager`,
  addEmployee: `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                VALUES (
                    ?, 
                    ?, 
                    (SELECT id FROM role WHERE title = ?),
                    (SELECT id FROM (SELECT * FROM employee) AS copiedEmployee 
                WHERE CONCAT(first_name, " ", last_name) = ?))`,
  addDepartment: `INSERT INTO department SET name = ?`,
  addRole: `INSERT INTO role (title, salary, department_id)
  VALUES (?,?,(SELECT id FROM department WHERE name = ?))`,
  updateEmployeeRole: `UPDATE employee SET role_id = (SELECT id FROM role WHERE title = ?) 
                        WHERE CONCAT(first_name, " ", last_name) = ?`,
  updateEmployeeManager: `UPDATE employee SET manager_id = (SELECT id FROM (SELECT * FROM employee) AS copied 
                                                            WHERE CONCAT(first_name, " ", last_name) = ?) 
                            WHERE CONCAT(first_name, " ", last_name) = ?`,
  deleteEmployee: `DELETE FROM employee WHERE CONCAT(first_name, " ", last_name) = ?`,
  deleteDept: `DELETE FROM department WHERE name = ?`,
  deleteRole: `DELETE FROM role WHERE title = ?`,
  checkSalaryByDept: `SELECT 
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
                        END , department`
};
