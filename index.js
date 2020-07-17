const inquirer = require("inquirer")
const mysql = require("mysql");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Theyankees1",
    database: "employee_trackerdb"
  });

  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
  });

//make empty employee array to push employees into (will need for later inquirer functions, to choose from existing employees)
var employeeArray = []

//function to get employees, push into employee array
function getEmployees () {
    connection.query("SELECT first_name, last_name FROM employees", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        res.forEach(employee=>{
          employeeArray.push({first_name: employee.first_name, last_name: employee.last_name})
          return employeeArray
        })
        //console.log(employeeArray)
      });
}
getEmployees()



//make empty department array to push departments into (will need for later inquirer functions, to choose from existing departments)
var departmentArray = []

//function to get departments, push into departments array
function getDepartments () {
    connection.query("SELECT name FROM departments", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        res.forEach(departments=>{
          departmentArray.push(departments)
          return departmentArray
        })
        //console.log(departmentArray)
      });
}
getDepartments()

//make empty role array to push roles into (will need for later inquirer functions, to choose from existing roles)
var rolesArray = []

//function to get roles, push into roles array
function getRoles () {
    connection.query("SELECT title FROM roles", function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        res.forEach(roles=>{
          rolesArray.push(roles)
          return rolesArray
        })   
        //console.log(rolesArray)
      });
}
getRoles()

//start function - brings master list to menu to choose what they want to view, add, update, or delete
function start () {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "action",
            choices: ["View departments", "View roles", "View employees", "Add department", "Add role", "Add employee", "Update employee role", "Update employee manager", "View Department Utilized Budget",  "View employees by manager", "Exit"]
        }
        ]).then(function(answers) {
            switch (answers.action) {
            case "View departments":
                viewDepartment()
                break
            case "View roles":
                viewRoles()
                break
            case "View employees":
                viewEmployees()
                break
            case "Add department": 
                addDepartment()
                break
            case "Add role":
                addRole()
                break
            case "Add employee":
                addEmployee()
                break
            case "Update employee role":
                updateRole()
                break
              case "Update employee manager":
                updateManager()
                break
              case "View Department Utilized Budget":
                  viewTotalSalaries()
                break
              case "View employees by manager":
                  viewEmployeesByManager()
                break
            case "Exit":
                connection.end()
                break
            }
        })
    }

//view roles function
function viewRoles () {
  // inquirer
  // .prompt({
  //   name: "role",
  //   type: "list",
  //   message: "Which roles would you like to see information for for?",
  //   choices: rolesArray
  // }) {
    connection.query("SELECT roles.id AS role_id, roles.title, roles.salary, roles.department_id, departments.id, departments.name FROM roles INNER JOIN departments ON roles.department_id = departments.id", function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
//3 - console.tables(query)?
        console.log("ID: " + res[i].role_id + " || Role Title: " + res[i].title + " || Role Salary: " + res[i].salary + " || Department ID: " + res[i].department_id + "|| Department Name: " + res[i].name);
      }
      start();
    });
  };



//view department function
function viewDepartment () {
    // inquirer
    // .prompt({
    //   name: "department",
    //   type: "list",
    //   message: "Which department would you like to search for?",
    //   choices: departmentArray
    // })
    // .then(function(answers) {
      connection.query("SELECT * FROM departments", function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
//3 - console.tables(query)?
          console.log("ID: " + res[i].id + " || Department Name: " + res[i].name);
        }
        start();
      });
}



//view employees function
function viewEmployees () {
    // inquirer.prompt({
    //   name: "employees",
    //   type: "list",
    //   message: "Which employee would you like to see information for?",
    //   choices: employeeArray
    // })
    // .then(function(answers) {
      connection.query("SELECT employees.id AS eid, employees.first_name, employees.last_name, employees.role_id, employees.manager_id, roles.id AS role_id, roles.title, roles.salary, roles.department_id, departments.id AS department_id, departments.name FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments on roles.department_id = departments.id",function(err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          console.log("ID: " + res[i].eid + " || First Name: " + res[i].first_name + " || Last Name: " + res[i].last_name + " || Role ID: " + res[i].role_id + " || Manager ID: " + res[i].manager_id + " || Role Name: "+ res[i].title + "|| Salary: "+ res[i].salary + " || Department: "+ res[i].name)
        }
        start();
      });
    };



function addDepartment () {
    inquirer.prompt({
      name: "departmentName",
      type: "input",
      message: "What is the name of the new department you would like to add?"
    })
    .then(function(answers) {
      connection.query("INSERT INTO departments SET ?",
      [
          {
              name: answers.departmentName
          }
      ], function(err, res) {
        if (err) throw err;
        console.log(answers.departmentName + " department successfully added!")
        start();
    })
    });
}

function addRole () {
  inquirer.prompt([
    {
      name: "roleTitle",
      type: "input",
      message: "What is the title of the new role you would like to add?"
    },
    {
      name: "roleSalary",
      type: "input",
      message: "What is the salary of the new role you are adding?"
    },
    {
      name: "deptID",
      type: "input",
      message: "What is the ID of the department you are adding the new role to?"
    },
  ]).then(function(answers) {
    connection.query("INSERT INTO roles SET ?",
    [
        {
            title: answers.roleTitle,
            salary: answers.roleSalary,
            department_id: answers.deptID
        }
    ], function(err, res) {
      if (err) throw err;
      console.log("Success! This role has been successfully added to the database!")
      start();
  })
  });
}

function addEmployee () {
  inquirer.prompt([
    {
      name: "firstName",
      type: "input",
      message: "What is the first name of the employee you are adding?"
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the last name of the employee you are adding?"
    },
    {
      name: "roleID",
      type: "input",
      message: "What is the role ID of the employee you are adding?"
    },
    {
      name: "managerID",
      type: "input",
      message: "What is the ID of the manager of this employee?"
    }
  ]).then(function(answers) {
    connection.query("INSERT INTO employees SET ?",
    [
        {
            first_name: answers.firstName,
            last_name: answers.lastName,
            role_id: answers.roleID,
            manager_id: answers.managerID,
        }
    ], function(err, res) {
      if (err) throw err;
      console.log("Employee has been successfull added to the database!")
      start();
  })
  });
}


function updateRole () {
  inquirer.prompt([
    {
      name: "firstName",
      type: "input",
      message: "What is the first name of the employee you are updating?"
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the last name of the employee you are updating?"
    },
    {
      name: "newroleID",
      type: "input",
      message: "What is the new role ID of this employee?"
    }
  ]).then(function(answers) {
    connection.query("UPDATE employees SET ? WHERE ? AND ?",
    [
        {
            role_id: answers.newroleID,
        },
        {
          first_name: answers.firstName
        },
        {
          last_name: answers.lastName
        }
    ], function(err, res) {
      if (err) throw err;
      console.log("success!")
      console.table(res)
      start();

  })
  });
}

function updateManager () {
  inquirer.prompt([
    {
      name: "firstName",
      type: "input",
      message: "What is the first name of the employee you are updating?"
    },
    {
      name: "lastName",
      type: "input",
      message: "What is the last name of the employee you are updating?"
    },
    {
      name: "newmanagerID",
      type: "input",
      message: "What is the employee ID of this employee's new manager?"
    }
  ]).then(function(answers) {
    connection.query("UPDATE employees SET ? WHERE ? AND ?",
    [
        {
            manager_id: answers.newmanagerID
        },
        {
          first_name: answers.firstName
        },
        {
          last_name: answers.lastName
        }
    ], function(err, res) {
      if (err) throw err;
      console.log("success!")
      start();
  })
  });
}

function viewTotalSalaries () {
  inquirer.prompt([
    {
      name: "department",
      type: "list",
      message: "What is the department you would like to see total utilized budget for?",
      choices: departmentArray
    }
  ]).then(function(answers) {
    connection.query("SELECT SUM(salary) AS Total, departments.name as Department FROM departments INNER JOIN roles on departments.id = roles.department_id INNER JOIN employees on roles.id = employees.role_id WHERE ?",
    [
        {
            name: answers.department
        }
    ], function(err, res) {
      if (err) throw err;
      for (i=0;  i< res.length; i++ ) 
      console.log("Sum of salary for the " +res[0].Department +" Department is: " + res[0].Total)
      start();
  })
  });
}

function viewEmployeesByManager () {
  inquirer.prompt([
    {
      name: "manager",
      type: "input",
      message: "What manager ID would you like to see the employees by? Need to retrieve this from employees database.",
    }
  ]).then(function(answers) {
    connection.query("SELECT employees.manager_id AS Manager, employees.first_name, employees.last_name, roles.title FROM employees INNER JOIN roles on employees.role_id = roles.id WHERE employees.? GROUP BY employees.manager_id",
    [
        {
            id: answers.manager
        }
    ], function(err, res) {
      if (err) throw err;
      for (i=0;  i< res.length; i++ ) 
      console.log("This manager's id is " +res[0].Manager +" , First Name is: " + res[0].first_name)
      start();
  })
  });
}
