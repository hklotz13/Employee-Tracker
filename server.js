const {inquirer} = require("inquirer");
const connection = require('./db/connection');
const logo = require("asciiart-logo");
require("console.table");
initApp();

function initApp() {
    const logoText = logo({ name: "Employee Manager" }).render();
    console.log(logoText);
    loadPrompts();
}

function loadPrompts() {
    inquirer.prompt([
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
                connection.end();
            }
        })
}

//Functions for above choices
function viewEmployees() {
  const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
  FROM employee 
  LEFT JOIN role 
    ON employee.role_id = role.id
  LEFT JOIN department
    ON department.id = role.department_id
  LEFT JOIN employee manager
    ON manager.id = employee.manager_id`
    connection.query(query, function (err, res) {
        if(err) throw err;
        console.table(res);
        loadPrompts();
    })
};

function viewDepartments() {
    const query = `SELECT * FROM department`;
    connection.query(query, function (err, res) {
        if(err) throw err;
        console.table(res);
        loadPrompts();
    }
)};

function viewRoles() {
    const query = `SELECT * FROM role`;
    connection.query(query, function (err, res) {
        if(err) throw err;
        console.table(res);
        loadPrompts();
    }
)}

function addEmployee() {
   const query = `SELECT role.id, role.title, role.salary FROM role`;
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

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the department name?'
        }
    ]).then((res) => {
        const query = `INSERT INTO department SET ?`
        connection.query(query, {name: res.name}, (err, res) => {
            if(err) throw err;
            loadPrompts();
        })
    })
}

function addRole() {
    const selectFrom = `SELECT * FROM department`;
    const showQuery = `SELECT role.id, role.title, role.salary, role.department_id, department.name as 'department_name
    FROM role
    INNER JOIN department ON role.department_id = department.id`;
    connection.query(showQuery, (err, res) => {
        if(err) throw err;
        console.table(res);
    })
    connection.query(selectFrom, (err, res) => {
        if(err) throw err;
        const department = res.map(({id, name}) => ({
            value: id,
            name: `${id} ${name}`
        }));
        addRoleInput(department)
    })
}

function addRoleInput(department) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: "What is the role's title?"
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the role's salary?"
        },
        {
            type: 'list',
            name: 'department',
            message: "What department is this role in?",
            choices: department
        }
    ]).then((res) => {
        const query = `INSERT INTO role SET ?`
        connection.query(query, {
            title: res.title,
            salary: res.salary,
            department_id: res.department
        },(err, res) => {
            if(err) throw err;
            loadPrompts();
        })
    })
}

function employeePrompts(roles) {
    inquirer.prompt([
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
    ]) .then((res) => {
        console.log(res);
        const query = `INSERT INTO employee SET ?`
        connection.query(query,
            {
                first_name: res.first_name,
                last_name: res.last_name,
                roles: res.roles
            },
            function (err, res) {
                if(err) throw err;
                console.table(res);
                loadPrompts();
            })
    })
}

function updateRole() {
    const query = `SELECT
        employee.id,
        employee.first_name,
        employee.last_name,
        role.title,
        department.name,
        role.salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
        FROM employee
        JOIN role ON employee.role_id = role.id
        JOIN department ON department.id = role.department_id`;
    connection.query(query, (err, res) => {
        if(err) throw err;
        const employee = res.map(({id, first_name, last_name}) => ({
            value: id,
            name: `${first_name}, ${last_name}`
        }));
        console.table(res);
        updateRoleChoices();
    })
};

function updateRoleChoices() {
    const query = `SELECT role.id, role.title FROM role`;
    connection.query(query, (err, res) => {
        if(err) throw err;
        const roleChoices = res.map(({id, title}) => ({
            value: id,
            name: `${id} ${title}`
        }));
        console.table(res);
        getRole(employee, roleChoices);
    })
}

function getRole(employee, roleChoices) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee are you updating?',
            choices: employee
        },
        {
            type: 'list',
            name: 'role',
            message: "What is this employee's new role?",
            choices: roleChoices
        }
    ]).then((res) => {
        const query = `UPDATE employee SET role_id = ? WHERE id = ?`
        connection.query(query, [res.role, res.employee], (err, res) => {
            if(err) throw err;
            loadPrompts();
        })
    })
};