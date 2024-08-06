const inquirer = require('inquirer');


class Department {
    constructor(){
        this.departments = []

    }
    addItem(){
       inquirer.prompt([
        {
            type: "input",
            message: "Please provide the Department Name:",
            name: "name"
        }
       ]).then( ({name}) => {
        this.departments.push(name)
        console.log("Department added to database!")
       })
    }
    removeItem(){
        
    }
}

module.exports = {
    Department
}