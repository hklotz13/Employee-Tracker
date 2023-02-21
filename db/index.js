const {inquirer} = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
require("console.table");
initApp();

function initApp() {
    const logoText = logo({ name: "Employee Manager" }).render();
    console.log(logoText);
    loadMainPrompts();
}

function loadPrompts() {
    prompt([
        {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
            "View All Employees",
            "View Department",
            "View Roles",
            "Add Employee",
            "Add Department",
            "Add Role",
            "Update Role",
            "Quit"
        ]
    }])
        .then(function(answer) {
            console.log(answer);
            if (answer.choices === "View All Employees") {
                viewEmployees();
            } else if (answer.choices === "View Departments") {
                viewDepartments();
            } else if (answer.choices === "View Roles") {
                viewRoles();
            } else if (answer.choices === "Add Employee") {
                addEmployee();
            } else if (answer.choices === "Add Department") {
                addDepartment();
            } else if (answer.choices === "Add Role") {
                addRole();
            } else if (answer.choices === "Update Role") {
                updateRole();
            } else if (answer.choices === "Quit") {
                Connection.end();
            }
        })
}

//Functions for above choices
function viewEmployees() {
  const query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
    ON e.role_id = r.id
  LEFT JOIN department d
    ON d.id = r.department_id
  LEFT JOIN employee m
    ON m.id = e.manager_id`
    connection.query(query, function (err, res) {
        if(err) throw err;
        console.table(res);
        loadPrompts();
    })
};

function viewDepartments() {
    const query = `SELECT d.id AS id, d.department_name AS department FROM department`;
    connection.query(query, function (err, res) {
        if(err) throw err;
        console.table(res);
        loadPrompts();
    }
)};

function viewRoles() {

}

function addEmployee() {
   const query = `SELECT r.id, r.title, r.salary FROM role r`;
   connection.query(query, function (err, res) {
    if(err) throw err;
    console.table(res);
   })
   const roles = res.map(({id, title, salary}) => ({
    value: id, title: `${title}`, salary: `${salary}`
   }));
   console.table(res);
   employeePrompts(roles);
}

function employeePrompts(roles) {
    prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name?"
        },
        {
            type: 'list',
            name: 'roles',
            message: "What is the employee's role?",
            choices: roles
        }
    ]) .then(function(answers) {
        console.log(answers);
        const query = `INSERT INTO employee SET ?`
        connection.query(query,
            {
                first_name: answers.first_name,
                last_name: answers.last_name,
                roles: answers.roles
            },
            function (err, res) {
                if(err) throw err;
                console.table(res);
                loadPrompts();
            })
    })
}