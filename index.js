const pg = require('pg');
const inquirer = require('inquirer')
const MaxLengthInputPrompt = require('inquirer-maxlength-input-prompt')
inquirer.registerPrompt('maxlength-input', MaxLengthInputPrompt)

const {Department} = require("./lib/department");
const {Employee} = require("./lib/employee");
const {Role} = require("./lib/role");


function start(){
    inquirer.prompt([
        {type: "list",
        message: "Hello! Please select an option:",
        name: "options",
        choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role"]
        }
    ]).then( ({options}) =>{
        if(options === "View All Departments"){
            SELECT * FROM departments;
        } else if(options === "View All Roles"){
            SELECT * FROM roles;
        } else if(options === "View All Employees"){
            SELECT * FROM employees;
        } else if(options === "Add a Department"){
            const department = new Department()
            askAboutAdd(department)
        } else if(options === "Add a Role"){
            const role = new Role()
            askAboutAdd(role)
        } else if(options === "Add an Employee"){
            const employee = new Employee()
            askAboutAdd(employee)
        } else if(options === "Update an Employee Role"){
            // const cart = new Cart()
            // askAboutAdd(cart)
        } else {
            console.log("Have a nice day!")
            process.exit()//this terminates the entire process and cancels anything downstream in the same process
        }
    })
}

function askAboutAdd(cart){
    inquirer.prompt([
        {
            type: "list",
            message: "Would you like to add a product?",
            name: "okToAdd",
            choices: ["yes", "no"]
        }
    ]).then( ({okToAdd}) => {
        if(okToAdd === "yes"){
        cart.addProduct() 
    } else {
            console.log("Have a nice day!")
            process.exit()
            }
}
    )
}

start()


//questions; note that for colors, the user is unable to enter anything that isn't a valid hex or html named color.
function userShapeQ(){
    return [
    {
        type: 'maxlength-input',
        message: "Let's make an svg! You can enter up to three characters of text:",
        name: 'text',
        maxLength: 3
    },
    {
        type: "input",
        name: "textcolor",
        message: "What color should the text be? Please give an HTML color name or hexcode.",
        validate: (textcolor) => {
            if (isHexColor(textcolor) || isNamedColor(textcolor)) {
                return true;
            }
            return 'Not a valid HTML color name or hex code; please try again.'
        }
    },
    {
         type: "list",
         message: "What shape do you want?",
         name: "shape",
         choices: ["Circle","Triangle","Square"]
    },
    {
        type: "input",
        name: "shapecolor",
        message: "What color should the shape be? Please give an HTML color name or hexcode.",
        validate: (shapecolor) => {
            if (isHexColor(shapecolor) || isNamedColor(shapecolor)) {
                return true;
            }
            return 'Not a valid HTML color name or hex code; please try again.'
        }
    }
 ]};


//The main function: this brings in the questions and calls the correct class constructor for the chosen shape, which is created with the other chosen properties.
async function init(){
    const questions = userShapeQ();
    const answers = await inquirer.prompt(questions);
    let shape;
    if (answers.shape === "Circle"){
        shape = new Circle(answers.shapecolor, answers.text, answers.textcolor)
    } else if (answers.shape === "Triangle"){
        shape = new Triangle(answers.shapecolor, answers.text, answers.textcolor)
    } else if (answers.shape === "Square"){
        shape = new Square(answers.shapecolor, answers.text, answers.textcolor)
    }
    const outputSVG = shape.render();
    fs.writeFile('logo.svg', outputSVG, (err) =>{
        if (err){
            console.error("The SVG file could not be generated; you aren't much of a painter...")
        } else {
            console.log("SVG file successfully generated from the information collected. You're an artist!")
        }
    })
};

init();