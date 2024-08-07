const inquirer = require('inquirer')
const MaxLengthInputPrompt = require('inquirer-maxlength-input-prompt')
inquirer.registerPrompt('maxlength-input', MaxLengthInputPrompt)

class Role {
    constructor(){}
    addRole(){
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
                choices: [SHOWITEMSFROMTABLE]
            }
        ])
}}

module.exports = {
    Role
}