var mysql = require("mysql");
var inquirer = require("inquirer");

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



function start() {

    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Thank you for shopping with Bamazon! Would you like to purchase an item?",
        default: true

    }]).then(function(user) {
        if (user.confirm === true) {
            chooseDepartment();
        } else {
            console.log("Thank you! Your session has ended");
        }
    });
}

// function which prompts the user for what action they should take
function chooseDepartment() {
    inquirer
        .prompt({
            name: "departmentChoice",
            type: "rawlist",
            message: "Please enter the number for the department you like to shop in today?",
            choices: ["ELECTRONICS", "JEWELRY", "COLLECTIBLES", "CLOTHING/ACCESSORIES", "ART"]
        })
        .then(function (answer) {
            //the function that runs depends on the department
            if (answer.departmentChoice.toUpperCase() === "ELECTRONICS") {
            //function if the user chooses electronics    
                electronics();
            } else if (answer.departmentChoice.toUpperCase() === "JEWELRY") {
             //function if the user chooses jewelry  
                jewelry();
            } else if (answer.departmentChoice.toUpperCase() === "COLLECTIBLES") {
                //function if the user chooses collectibles
                collectibles();
            } else if (answer.departmentChoice.toUpperCase() === "CLOTHING/ACCESSORIES") {
               //function if the user chooses clothing/accessories
                clothing();
            } else if (answer.departmentChoice.toUpperCase() === "ART") {
                //function if the user chooces art
                art();

        }
        });
    }

    function userID() {
   
    inquirer.prompt([{
                name: "id",
                type: "input",
                message: "Which ID would you like to purchase today?"
            },
            {
                name: "stock",
                type: "input",
                message: "Please enter a quantity to purchase."
            }
        ])
        .then(function (answer) {
                      
            var query = "SELECT * FROM PRODUCTS Where ?";
            
            connection.query(query, {
                ID: answer.id

            }, function (error, response) {
                if (error) {
                    console.log("I'm sorry. An error occurred")};
            
                if (response[0].STOCK_QUANTITY < answer.stock) {
                    console.log("Insufficient quantity. Please choose another amount.");
                    userPrompt();
                } else if (response[0].STOCK_QUANTITY >= answer.stock) {
                    console.log("Thank you for your order. It is in queue for shipping.");

                    // Update the mySQL Database
              
                    connection.query( "UPDATE PRODUCTS SET ? WHERE ?", [
                        {
                            STOCK_QUANTITY:response[0].STOCK_QUANTITY - answer.stock
                        },
                        {
                            ID:answer.id
                        }
                    ] ,function (error, data) {
                        if (error) throw error;
                        // console.log(data);
                        console.log("Your order has been processed. Your total is $" + response[0].price * userAmount);
                        endConnection();

                    })
                    
                }
            });
        });
        
}



    function electronics() {

        console.log("Thank you for purchasing from electronics")

           var query = "SELECT ID, PRODUCT_NAME, PRICE FROM PRODUCTS WHERE DEPARTMENT_NAME = 'ELECTRONICS'";
        
        connection.query(query, function(err, results) {
          if (err) throw err;

                  var choiceArray = [];
                  for (var i = 0; i < results.length; i++) {
                    choiceArray.push("ID: " + results[i].ID, "Product: " + results[i].PRODUCT_NAME, "Price: " + "$" + results[i].PRICE);
                  }
                  console.log(choiceArray);
                }),
                userID();
            }
                
           