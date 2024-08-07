//-------------------------------------------------------
const pool = require('pg');

const {Department} = require("./lib/department");
const {Employee} = require("./lib/employee");
const {Role} = require("./lib/role");

pool.connect();
//-------------------------------------------------------
//viewAll functions
//-------------------------------------------------------
async function viewAllEmployees(){
    const employees = await pool.query('SELECT * FROM employees');
    console.table(employees);
    start();
}
//-------------------------------------------------------
async function viewAllDepartments(){
    const departments = await pool.query('SELECT * FROM departments');
    console.table(departments);
    start();
}
//-------------------------------------------------------
async function viewAllRoles(){
    const roles = await pool.query('SELECT * FROM roles');
    console.table(roles);
    start();
}
//-------------------------------------------------------
//addNew functions
//-------------------------------------------------------
async function addNewEmployee(){
    const employeeInst = new Employee;
    const data = await employeeInst.addEmployee();
    const insert = await pool.query('INSERT INTO employees(first_name, last_name, role_id, manager_id) VALUES($1, $2, $3, $4)', [data.firstName, data.lastName, data.roleId, data.managerId]);
    console.log(`New ${data.roleId} ${data.firstName} ${data.lastName} added!`);
    start();
}
//-------------------------------------------------------
async function addNewDepartment(){
    const deptInst = new Department;
    const data = await deptInst.addDepartment();
    const insert = await pool.query('INSERT INTO departments(name) VALUES($1)', [data.name]);
    console.log(`New ${data.name} Department added!`);
    start();
}
//-------------------------------------------------------
async function addNewRole(){
    const roleInst = new Role;
    const data = await roleInst.addRole();
    const insert = await pool.query('INSERT INTO employees(title, salary, department_id) VALUES($1, $2, $3)', [data.title, data.salary, data.departmentId]);
    console.log(`New employee role ${data.title} has been added; the salart is ${data.salary}!`);
    start();
}
//-------------------------------------------------------
//updateEmployeeRole function
//-------------------------------------------------------
async function updateEmployeeRole(){
    const employeeInst = new Employee;
    const data = await employeeInst.updateEmployee();
    const update = await pool.query('????', [data.firstName, data.lastName, data.newRoleId, data.newManagerId]);
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
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role"]
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