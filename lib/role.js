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

class Role {
    constructor(){}
    
    async pullDepts(){
        const result = await pool.query('SELECT id, name FROM department');
        return result.rows.map(department => ({
            name: department.name,
            value: department.id
        }))
    }
    
    async addRole(){
        const departments = await this.pullDepts();
        return inquirer.prompt([
            {
                type: 'maxlength-input',
                message: "Please provide the role title:",
                name: "title",
                maxLength: 30
            },
            {
                type: "input",
                message: "Please provide the role salary:",
                name: "salary",
                validate: (salary) => {
                    if (isNaN(salary)) {
                        return 'salary must be a number; please try again.';
                    } return true;
                }
            },
            {
                type: "list",
                message: "Please specify the role department:",
                name: "departmentId",
                choices: departments
            }
        ])
}}

module.exports = {
    Role
}