const inquirer = require('inquirer');


class Employee {
    constructor(){
        this.employees = []

    }
    addItem(){
       inquirer.prompt([
        {
            type: "input",
            message: "Please provide the employee's first name:",
            name: "firstName"
        },
        {
            type: "input",
            message: "Please provide the employee's last name:",
            name: "lastName"
        },
        {
            type: "list",
            message: "Please specify the employee's role:",
            name: "roleId",
            choices: [${}]
        },
        {
            type: "list",
            message: "Please specify the employee's manager:",
            name: "managerId",
            choices: [${}]
        },
       ]).then( ({firstName, lastName, roleId, managerId}) => {
        this.employees.push(firstName, lastName, roleId, managerId)
        console.log("Employee added to database!")
       })
    }
    removeItem(){
        
    }
}

module.exports = {
    Employee
}