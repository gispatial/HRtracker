const inquirer = require("inquirer");

const createDB = require("./db/db");
const query = require("./db/query");

//! [Choice refresher]
//! : Dynamically fill questions' choices with data
exports.refreshChoices = async () => {
  // 1. Connect DB and import connection.query(), connection.end() methods
  const db = createDB();

  // 2. Bring data from DB for all questions' choices
  const roles = await db.query("SELECT title FROM role");
  const employees = await db.query(
    "SELECT CONCAT(first_name, ' ' , last_name) AS name FROM employee"
  );
  const departments = await db.query(
    "SELECT name AS department FROM department"
  );

  // 3. Fill each question's choices with data
  roles.forEach(el => {
    questions.addEmployeeQ[2].choices.push(el.title);
    questions.deleteRoleQ[0].choices.push(el.title);
  });

  employees.forEach(el => {
    questions.addEmployeeQ[3].choices.push(el.name);
    questions.updateRoleQ[0].choices.push(el.name);
    questions.updateManagerQ[0].choices.push(el.name);
    questions.deleteEmployeeQ[0].choices.push(el.name);
  });

  departments.forEach(el => {
    questions.addRoleQ[2].choices.push(el.department);
    questions.deleteDepartmentQ[0].choices.push(el.department);
  });

  //* [Special case] addEmployeeQ - 3rd question's choices
  // : Add "none" choice for 'manager_id'.
  if (!questions.addEmployeeQ[3].choices.includes("none")) {
    questions.addEmployeeQ[3].choices.unshift("none");
  }

  //* [Special case] updateRoleQ - 2nd question's choices func
  // : Show all roles except the person's current role.
  questions.updateRoleQ[1].choices = async answers => {
    const rows = await db.query(query.getAllRolesExcept, answers.employee);

    const rolesArr = rows.map(row => {
      return row.title;
    });

    // Delete duplicated roles
    return Array.from(new Set(rolesArr));
  };

  //* [Special case] updateManagerQ - 2nd question's choice func
  // : Show all employees except himself/herself and include "none".
  questions.updateManagerQ[1].choices = answers => {
    // 1. Delete himself/herself from employees array
    const employeesExceptMe = questions.updateManagerQ[0].choices.filter(
      el => el !== answers.employeeToUpdateManager
    );

    // 2. Include "none"
    if (!employeesExceptMe.includes("none")) {
      employeesExceptMe.unshift("none");
    }

    return employeesExceptMe;
  };

  // db.end();
};

//! [Questions]
const questions = {
  mainQ: [
    {
      type: "list",
      name: "mainQ",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all departments",
        "View all roles",
        "View all employees by department",
        "View all employees by manager",
        "Add an employee",
        "Add a department",
        "Add a role",
        "Update employee's role",
        "Update employee's manager",
        "Delete an employee",
        "Delete a department",
        "Delete a role",
        "Check the total salaries of each department",
        "Exit"
      ]
    }
  ],
  addEmployeeQ: [
    {
      type: "input",
      name: "fname",
      message: "What is this employee's first name?",
      validate: nameValidator,
      filter: input => {
        return input.trim();
      }
    },
    {
      type: "input",
      name: "lname",
      message: "What is this employee's last name?",
      validate: nameValidator,
      filter: input => {
        return input.trim();
      }
    },
    {
      type: "list",
      name: "role",
      message: "What is the role of this employee?",
      choices: []
    },
    {
      type: "list",
      name: "manager",
      message: "Who is the manager of this employee?",
      choices: []
    }
  ],
  addDepartmentQ: [
    {
      type: "input",
      name: "department",
      message: "What is the new department's name?",
      validate: uniqueValidator("department", "name"),
      filter: input => {
        return input.trim();
      }
    }
  ],
  addRoleQ: [
    {
      type: "input",
      name: "title",
      message: "What role do you want to newly add?",
      validate: uniqueValidator("role", "title"),
      filter: input => {
        return input.trim();
      }
    },
    {
      type: "input",
      name: "salary",
      message: "How much is this role's salary?",
      validate: input => {
        return isNaN(input) ? "Invalid input. Please enter a number" : true;
      },
      filter: input => {
        return input.trim();
      }
    },
    {
      type: "list",
      name: "deptOfRole",
      message: "What department does this role belong to?",
      choices: []
    }
  ],
  updateRoleQ: [
    {
      type: "list",
      name: "employee",
      message: "who's role do you want to change?",
      choices: []
    },
    {
      type: "list",
      name: "newRole",
      message: "What is this employee's new role?",
      choices: []
    }
  ],
  updateManagerQ: [
    {
      type: "list",
      name: "employeeToUpdateManager",
      message: "Who's manager do you want to change?",
      choices: []
    },
    {
      type: "list",
      name: "newManager",
      message: "who is the new manager of this employee?",
      choices: []
    }
  ],
  deleteEmployeeQ: [
    {
      type: "list",
      name: "employeeToDel",
      message: "who do you want to delete?",
      choices: []
    }
  ],
  deleteDepartmentQ: [
    {
      type: "list",
      name: "deptToDel",
      message: "Which department do you want to delete?",
      choices: []
    }
  ],
  deleteRoleQ: [
    {
      type: "list",
      name: "roleToDel",
      message: "Which role do you want to delete?",
      choices: []
    }
  ]
};

//! [Inquirer prompter] Prompt inquiries in CLI with proper questions
exports.getAnswer = async category => {
  let q = [];

  switch (category) {
    case "main":
      q = questions.mainQ;
      break;

    case "addEmployee":
      q = questions.addEmployeeQ;
      break;

    case "addRole":
      q = questions.addRoleQ;
      break;

    case "addDepartment":
      q = questions.addDepartmentQ;
      break;

    case "updateEmployeeRole":
      q = questions.updateRoleQ;
      break;

    case "updateManager":
      q = questions.updateManagerQ;
      break;

    case "deleteEmployee":
      q = questions.deleteEmployeeQ;
      break;

    case "deleteDepartment":
      q = questions.deleteDepartmentQ;
      break;

    case "deleteRole":
      q = questions.deleteRoleQ;
      break;

    case "checkSalary":
      q = questions.deleteRoleQ;
      break;
  }

  return await inquirer.prompt(q);
};

//! Validation functions
function nameValidator(name) {
  if (name === undefined) return "No input entered. Please enter a valid name.";

  let verdit = true;
  for (char of name.trim()) {
    if (!/[a-zA-Z ]/.test(char))
      verdit = "Invalid input. Please enter a valid name.";
  }
  return verdit;
}

function uniqueValidator(table, column) {
  return async answer => {
    const db = createDB();
    const results = await db.query(
      `SELECT ${column} FROM ${table} WHERE ${column} = "${answer}"`
    );
    if (results.length > 0) {
      return `The ${table} having the same name already exists. The ${column} should be unique.`;
    }
    return true;
  };
}
