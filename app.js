const dotenv = require("dotenv");
const path = require("path");
const figlet = require("figlet");
require("console.table");

//! Uncaught exception error handling:
process.on("uncaughtException", err => {
  console.log("🚧 Error: ", err.message);
  process.exit(1);
});

const { catchAsync, showTable } = require("./dev/util/util");

// Connect to DB
const createDB = require("./dev/db/db");

// Bring queries
const query = require("./dev/db/query");

// Set env
dotenv.config({ path: path.join(__dirname, "test.env") });

// Import Inquirer
const { refreshChoices, getAnswer } = require("./dev/inquirer");

//! FUCTION : init
const init = catchAsync(async () => {
  let loop = true;

  //* APP Logo print
  console.log(
    figlet.textSync(" HR Tracker", {
      font: "ANSI Shadow",
      horizontalLayout: "default",
      verticalLayout: "default"
    })
  );

  //* Do ~ While loop
  do {
    // 1. Dynamically fill questions' choices with latest data in every loop
    await refreshChoices();

    // 2. Get answer to the main question
    const { mainQ } = await getAnswer("main");

    // 3. Connect DB and import connection.query(), connection.end() methods
    const db = createDB();

    // 4. Based on the mainQ answer, print a query result right away or continue to following questions.
    switch (mainQ) {
      case "View all employees":
        showTable(db, mainQ, query.getAllEmployees);
        break;

      case "View all departments":
        showTable(db, mainQ, query.getAllDepartments);
        break;

      case "View all roles":
        showTable(db, mainQ, query.getAllRoles);
        break;

      case "View all employees by department":
        showTable(db, mainQ, query.getAllEmployeesByDept);
        break;

      case "View all employees by manager":
        showTable(db, mainQ, query.getAllEmployeesByManager);
        break;

      case "Add an employee":
        // 1. Get additional answers to related questions
        const { fname, lname, role, manager } = await getAnswer("addEmployee");

        // 2. Print
        showTable(db, mainQ, query.addEmployee, [fname, lname, role, manager]);
        break;

      case "Add a department":
        const { department } = await getAnswer("addDepartment");
        showTable(db, mainQ, query.addDepartment, [department]);
        break;

      case "Add a role":
        const { title, salary, deptOfRole } = await getAnswer("addRole");
        showTable(db, mainQ, query.addRole, [title, salary, deptOfRole]);
        break;

      case "Update employee's role":
        const { employee, newRole } = await getAnswer("updateEmployeeRole");

        showTable(db, mainQ, query.updateEmployeeRole, [newRole, employee]);
        break;

      case "Update employee's manager":
        const { employeeToUpdateManager, newManager } = await getAnswer(
          "updateManager"
        );
        showTable(db, mainQ, query.updateEmployeeManager, [
          newManager,
          employeeToUpdateManager
        ]);
        break;

      case "Delete an employee":
        const { employeeToDel } = await getAnswer("deleteEmployee");
        showTable(db, mainQ, query.deleteEmployee, [employeeToDel]);
        break;

      case "Delete a department":
        const { deptToDel } = await getAnswer("deleteDepartment");
        showTable(db, mainQ, query.deleteDept, [deptToDel]);
        break;

      case "Delete a role":
        const { roleToDel } = await getAnswer("deleteRole");
        showTable(db, mainQ, query.deleteRole, [roleToDel]);
        break;

      case "Check the total salaries of each department":
        showTable(db, mainQ, query.checkSalaryByDept);
        break;

      case "Exit":
        // Stop looping the prompt then end database and process
        loop = false;
        db.end();
        process.exit(0);
    }
  } while (loop);
});

init();

//! Unhandled rejection error handling : hide error stack and print a general error message
process.on("unhandledRejection", err => {
  console.log(err.message);
  db.end();
  process.exit(1);
});
