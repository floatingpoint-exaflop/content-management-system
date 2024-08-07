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
    const employees = await pool.query('SELECT id, first_name, last_name, title, department, salary, manager_id FROM employee');
    console.table(employees);
    start();
}
//-------------------------------------------------------
async function viewAllDepartments(){
    const departments = await pool.query('SELECT id, name FROM department');
    console.table(departments);
    start();
}
//-------------------------------------------------------
async function viewAllRoles(){
    const roles = await pool.query('SELECT id, title, department_id, salary FROM role');
    console.table(roles);
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
    // const managerId = data.newManagerId === '' ? null : data.newManagerId;
    const update = await pool.query('UPDATE employee SET role_id = $1, manager_id = $2 WHERE first_name = $3 AND last_name = $4',[data.newRoleId, data.newManagerId, data.firstName, data.lastName]
  );
    console.log(`${data.firstName} ${data.lastName} is now listed as a ${data.newRoleId} reporting to ${data.newManagerId}!`);
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