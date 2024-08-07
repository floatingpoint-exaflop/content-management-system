//-------------------------------------------------------
const { Pool } = require('pg');
const inquirer = require('inquirer');
const { Department } = require("./lib/department");
const { Employee } = require("./lib/employee");
const { Role } = require("./lib/role");

const pool = new Pool({
    user: 'timothyscallon',
    host: 'localhost',
    database: 'employees_db',
    password: '',
    port: 5432,
  });
//-------------------------------------------------------
//viewAll functions
//-------------------------------------------------------
async function viewAllEmployees(){
    const {rows} = await pool.query(`
SELECT employee.id AS id, CONCAT(employee.first_name, \' \', employee.last_name) AS employee_name, role.title AS title, department.name AS department, role.salary AS salary, CONCAT(manager.first_name, \' \', manager.last_name) AS manager_name
FROM employee
INNER JOIN role ON employee.role_id = role.id
INNER JOIN department on department.id = role.department_id
INNER JOIN employee manager on employee.manager_id = manager.id
`);
    console.table(rows);
    start();
}
//-------------------------------------------------------
async function viewAllDepartments(){
    const {rows} = await pool.query(`SELECT id, name FROM department`);
    console.table(rows);
    start();
}
//-------------------------------------------------------
async function viewAllRoles(){
    const {rows} = await pool.query(`SELECT role.id, title, department.name AS department, salary 
    FROM role
    INNER JOIN department on department.id = role.department_id
    `);
    console.table(rows);
    start();
}
//-------------------------------------------------------
//addNew functions
//-------------------------------------------------------
async function addNewEmployee(){
    const employeeInst = new Employee;
    const data = await employeeInst.addEmployee();
    const insert = await pool.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES($1, $2, $3, $4) RETURNING id', [data.firstName, data.lastName, data.roleId, data.managerId]);

    console.log(`New employee ${data.firstName} ${data.lastName} added!`);
    start();
}
//-------------------------------------------------------
async function addNewDepartment(){
    const deptInst = new Department;
    const data = await deptInst.addDepartment();

    const insert = await pool.query('INSERT INTO department(name) VALUES($1) RETURNING id', [data.name]);
    console.log(`New ${data.name} Department added!`);
    start();
}
//-------------------------------------------------------
async function addNewRole(){
    const roleInst = new Role;
    const data = await roleInst.addRole();
    const insert = await pool.query('INSERT INTO role(title, salary, department_id) VALUES($1, $2, $3) RETURNING id', [data.title, data.salary, data.departmentId]);
    console.log(`New employee role ${data.title} has been added; the salary is ${data.salary}!`);
    start();
}
//-------------------------------------------------------
//updateEmployeeRole function
//-------------------------------------------------------
async function updateEmployeeRole(){
    const employeeInst = new Employee;
    const data = await employeeInst.updateEmployee();

    const update = await pool.query('UPDATE employee SET role_id = $1, manager_id = $2 WHERE id = $3',[data.newRoleId, data.newManagerId, data.selectedEmployee]
    );

    const getName = await pool.query('SELECT first_name, last_name FROM employee WHERE id = $1', [data.selectedEmployee]);
    const updatedEmployee = getName.rows[0];

    const getRole = await pool.query('SELECT title FROM role WHERE id = $1', [data.newRoleId]);
    const updatedRole = getRole.rows[0];

    const getManager = await pool.query('SELECT first_name, last_name FROM employee WHERE id = $1', [data.newManagerId]);
    const updatedManager = getManager.rows[0];

    const managerName = updatedManager ? `${updatedManager.first_name} ${updatedManager.last_name}` : 'no one';

    console.log(`${updatedEmployee.first_name} ${updatedEmployee.last_name} is now listed as a ${updatedRole.title} reporting to ${managerName}!`);
    start();
}
//-------------------------------------------------------
//-------------------------------------------------------
function start(){
    inquirer.prompt([
        {type: "list",
        message: "Hello! Please select an option:",
        name: "options",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "Exit"]
        }
    ]).then( ({options}) =>{
        if(options === "View All Departments"){
            viewAllDepartments();
        } else if(options === "View All Roles"){
            viewAllRoles();
        } else if(options === "View All Employees"){
            viewAllEmployees();
        } else if(options === "Add a Department"){
            addNewDepartment();
        } else if(options === "Add a Role"){
            addNewRole();
        } else if(options === "Add an Employee"){
            addNewEmployee();
        } else if(options === "Update an Employee Role"){
            updateEmployeeRole();
        } else {
            console.log("Have a nice day!")
            process.exit()//this terminates the entire process and cancels anything downstream in the same process
        }
    })
}

start()