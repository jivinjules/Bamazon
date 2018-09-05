var mysql = require("mysql");
var inquirer = require("inquirer");
var {table} = require("table");

//cli-color npm package will give color.
var clc = require('cli-color');

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon_db"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

//color for viewing products for sale
var prodcutSalesColor = clc.green;

//color for viewing low inventory
var newDeptColor = clc.blue;

var data = [
    ['0A', '0B', '0C'],
    ['1A', '1B', '1C'],
    ['2A', '2B', '2C']
];

var output = table(data);

function start() {

    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Welcome, Supervisor! Would you like to access the database at this time?",
        default: true

    }]).then(function (user) {
        if (user.confirm === true) {
            chooseAction();
        } else {
            console.log("Thank you! Your session has ended. Goodbye.");
            connection.end();
        }
    });
}

function chooseAction() {// function which prompts the user for what action they should take
    inquirer
        .prompt([{
            name: "doToday",
            type: "rawlist",
            message: "What action would you like to take? (Please enter the item number)",
            choices: ["VIEW PRODUCT SALES BY DEPARTMENT", "CREATE A NEW DEPARTMENT"]
        }])
        .then(function (answer) {
               if (answer.doToday.toUpperCase() === "VIEW PRODUCT SALES BY DEPARTMENT") {
                //function if the user chooses to view all product sales by department    
                viewProductSales();
            } else if (answer.doToday.toUpperCase() === "CREATE A NEW DEPARTMENT") {
                //function if the user chooses to create a new department  
                createNewDepartment();
            } 
        });
}

function createNewDepartment() {
    //testing function
        // prompt for info about the department being added
        inquirer
            .prompt([
                {
                    name: "department",
                    type: "input",
                    message: newDeptColor("Enter the department you wish to add")
                },
                {
                    name: "overhead_cost",
                    type: "input",
                    message: newDeptColor("What is the overhead cost for the department?")
                }
            ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                connection.query(
                    "INSERT INTO DEPARTMENTS SET ?",
                    {
                        DEPARTMENT_NAME: answer.department,
                        OVERHEAD_COSTS: answer.overhead_cost
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(newDeptColor("You have successfully added the department: " + answer.department + ".\n"));
                        //sends supervisor back to the start
                        start();
                    }
                );
            });
}

function viewProductSales() {
    console.log(prodcutSalesColor(output));
}