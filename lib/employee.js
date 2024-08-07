const { Pool } = require('pg');
const inquirer = require('inquirer')
const MaxLengthInputPrompt = require('inquirer-maxlength-input-prompt')
inquirer.registerPrompt('maxlength-input', MaxLengthInputPrompt)

const pool = new Pool({
    user: 'timothyscallon',
    host: 'localhost',
    database: 'employees_db',
    password: '',
    port: 5432,
  });

class Employee {
    constructor(){}

    async pullRoles(){
        const result = await pool.query('SELECT id, title FROM role');
        return result.rows.map(role => ({
            name: role.title,
            value: role.id
        }))
    }

    async pullEmployees(){
        const result = await pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS fullname FROM employee');

        return result.rows.map(employee => ({
            name: employee.fullname,
            value: employee.id
        }))
    }

    async addEmployee(){
        const roles = await this.pullRoles();
        const managers = await this.pullEmployees();
        return inquirer.prompt([
            {
                type: 'maxlength-input',
                message: "Please provide the employee's first name:",
                name: "firstName",
                maxLength: 30
            },
            {
                type: 'maxlength-input',
                message: "Please provide the employee's last name:",
                name: "lastName",
                maxLength: 30
            },
            {
                type: "list",
                message: "Please specify the employee's role:",
                name: "roleId",
                choices: roles
            },
            {
                type: "list",
                message: "Please specify the employee's manager:",
                name: "managerId",
                choices: [...managers, {name: "No Manager", value: null}]
            }
        ])
    }
    async updateEmployee(){
        const roles = await this.pullRoles();
        const employees = await this.pullEmployees();
        const updatedEmployees = employees.map(employee => ({...employee, name: employee.name}));

        return inquirer.prompt([
            {
                type: "list",
                message: "Which employee is changing roles?",
                name: "selectedEmployee",
                choices: updatedEmployees
            },
            {
                type: "list",
                message: "Please specify the employee's new role (or pick their current one if no change):",
                name: "newRoleId",
                choices: roles
            },
            {
                type: "list",
                message: "Please specify the employee's new manager (or pick their current one if no change):",
                name: "newManagerId",
                choices: [...employees, { name: 'None', value: null }]
            }
        ])
    }
}

module.exports = {
    Employee
}