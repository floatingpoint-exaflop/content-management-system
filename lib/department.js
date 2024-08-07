const inquirer = require('inquirer')
const MaxLengthInputPrompt = require('inquirer-maxlength-input-prompt')
inquirer.registerPrompt('maxlength-input', MaxLengthInputPrompt)

class Department {
    constructor(){}
    addDepartment(){
        return inquirer.prompt([
            {
                type: 'maxlength-input',
                message: "Please provide the Department Name:",
                name: "name",
                maxLength: 30
            }
       ])
    }
}

module.exports = {
    Department
}