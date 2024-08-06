const inquirer = require('inquirer');


class Role {
    constructor(){
        this.roles = []

    }
    addItem(){
       inquirer.prompt([
        {
            type: "input",
            message: "Please provide the role title:",
            name: "title"
        },
        {
            type: "input",
            message: "Please provide the role salary:",
            name: "salary"
        },
        {
            type: "list",
            message: "Please specify the role department:",
            name: "departmentId",
            choices: [${}]
        }
       ]).then( ({title, salary, departmentId}) => {
        this.roles.push(title, salary, departmentId)
        console.log("Role added to database!")
       })
    }
    removeItem(){
        
    }
}

module.exports = {
    Role
}