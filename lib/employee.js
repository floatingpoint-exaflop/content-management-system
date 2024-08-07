const inquirer = require('inquirer')
const MaxLengthInputPrompt = require('inquirer-maxlength-input-prompt')
inquirer.registerPrompt('maxlength-input', MaxLengthInputPrompt)

class Employee {
    constructor(){}
    addEmployee(){
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
                choices: [SHOWITEMSFROMTABLE]
            },
            {
                type: "list",
                message: "Please specify the employee's manager:",
                name: "managerId",
                choices: [SHOWITEMSFROMTABLE]
            }
        ])
    }
    updateEmployee(){
        return inquirer.prompt([
            {
                type: "list",
                message: "Which employee is changing roles?",
                name: "selectedEmployee",
                choices: [SHOWITEMSFROMTABLE]
            },
            {
                type: "list",
                message: "Please specify the employee's new role (or pick their currnet one if no change):",
                name: "newRoleId",
                choices: [SHOWITEMSFROMTABLE]
            },
            {
                type: "list",
                message: "Please specify the employee's new manager (or pick their current one if no change):",
                name: "newManagerId",
                choices: [SHOWITEMSFROMTABLE]
            }
        ])
    }
}

module.exports = {
    Employee
}