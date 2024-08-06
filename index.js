const fs = require('fs');
const inquirer = require('inquirer')
const MaxLengthInputPrompt = require('inquirer-maxlength-input-prompt')
const {Circle, Square, Triangle} = require("./lib/shapes")
inquirer.registerPrompt('maxlength-input', MaxLengthInputPrompt)

//question colors stuff
//This is a list of every named html color; we can prevent the user from entering color keywords that are invalid to pass directly into the template literal.
const htmlNamedColors = [
    "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue",
    "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk",
    "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki",
    "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue",
    "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey",
    "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod",
    "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender",
    "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow",
    "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray",
    "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine",
    "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise",
    "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive",
    "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip",
    "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue", "saddlebrown",
    "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey",
    "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white",
    "whitesmoke", "yellow", "yellowgreen"
  ];
//just in case the user types crazy, we'll normalize the text as lower case.
const isNamedColor = (color) => htmlNamedColors.includes(color.toLowerCase());

const isHexColor = (hex) => /^#([0-9A-F]{3}){1,2}$/i.test(hex);
// Regular Expression to ensure a proper hex code, starting with a # and including 3 or 6 numbers or letters A thru F (hex codes can be 3 char too and still be valid). 
//The letters can be upper or lowercase (hence the i), though hexcodes themselves are not case-sensitive anyway; the user can type them however they like as long as the format is valid.


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