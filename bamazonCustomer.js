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

    }]).then(function (user) {
        if (user.confirm === true) {
            chooseDepartment();
        } else {
            console.log("Thank you! Your session has ended");
        }
    });
}

function endConnection() {
    console.log("Thank you for shopping with Bamazon!")
    connection.end();
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
        message: "Please enter the ID of the item you wish to purchase."
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
                    console.log("I'm sorry. An error occurred")
                };

                if (response[0].STOCK_QUANTITY < answer.stock && response[0].STOCK_QUANTITY > 0) {
                    console.log("\n");
                    console.log("Insufficient quantity. Please choose another amount.");
                    console.log("\n");
                    userID();
                } else if (response[0].STOCK_QUANTITY === 0) {
                    console.log("\n");
                    console.log("I'm sorry. Bamazon is out of that product");
                    console.log("\n");
                    chooseDepartment();
                } else if (response[0].STOCK_QUANTITY >= answer.stock) {
                    console.log("\n")
                    console.log("Thank you ordering the item: " + response[0].PRODUCT_NAME + ". It is in queue for shipping.\n");

                    // Update the mySQL Database

                    connection.query("UPDATE PRODUCTS SET ? WHERE ?", [
                        {
                            STOCK_QUANTITY: response[0].STOCK_QUANTITY - answer.stock
                        },
                        {
                            ID: answer.id
                        }
                    ], function (error, data) {
                        if (error) {
                            console.log("I'm sorry. Bamazon is currently down.  Try again later.")
                        };

                        console.log("Your order has been shipped! You have been charged $" + response[0].PRICE * answer.stock);
                        endConnection();

                    })

                }
            });
        });

}



function electronics() {

    console.log("Thank you for purchasing from electronics")
    console.log("Items Available: \n")

    var query = "SELECT ID, PRODUCT_NAME, PRICE FROM PRODUCTS WHERE DEPARTMENT_NAME = 'ELECTRONICS'";

    connection.query(query, function (err, results) {
        if (err) throw err;
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
            choiceArray.push("Item ID: " + results[i].ID, "Product: " + results[i].PRODUCT_NAME, "Price: " + "$" + results[i].PRICE);
        }
        console.log(choiceArray);
        userID();
    });
}

function art() {

    console.log("Thank you for purchasing from from our Art Department!\n")
    console.log("Items Available: \n")

    var query = "SELECT ID, PRODUCT_NAME, PRICE FROM PRODUCTS WHERE DEPARTMENT_NAME = 'ART'";

    connection.query(query, function (err, results) {
        if (err) throw err;
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
            choiceArray.push("Item ID: " + results[i].ID, "Product: " + results[i].PRODUCT_NAME, "Price: " + "$" + results[i].PRICE);
        }
        console.log(choiceArray);
        userID();
    });
}

function clothing() {

    console.log("Thank you for purchasing from our Clothing & Accessories Department!\n")
    console.log("Items Available: \n")

    var query = "SELECT ID, PRODUCT_NAME, PRICE FROM PRODUCTS WHERE DEPARTMENT_NAME = 'CLOTHING/ACCESSORIES'";

    connection.query(query, function (err, results) {
        if (err) throw err;
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
            choiceArray.push("Item ID: " + results[i].ID, "Product: " + results[i].PRODUCT_NAME, "Price: " + "$" + results[i].PRICE);
        }
        console.log(choiceArray);
        userID();
    });
}


function collectibles() {

    console.log("Thank you for purchasing from our Collectibles Department!\n")
    console.log("Items Available: \n")

    var query = "SELECT ID, PRODUCT_NAME, PRICE FROM PRODUCTS WHERE DEPARTMENT_NAME = 'COLLECTIBLES'";

    connection.query(query, function (err, results) {
        if (err) throw err;
        var choiceArray = [];
        for (var i = 0; i < results.length; i++) {
            choiceArray.push("Item ID: " + results[i].ID, "Product: " + results[i].PRODUCT_NAME, "Price: " + "$" + results[i].PRICE);
        }
        console.log(choiceArray);
        userID();
    });
}


function jewelry() {

    console.log("Thank you for purchasing from our Jewelry Department!\n")
    console.log("Items Available: \n")

       var query = "SELECT ID, PRODUCT_NAME, PRICE FROM PRODUCTS WHERE DEPARTMENT_NAME = 'JEWELRY'";
    
    connection.query(query, function(err, results) {
      if (err) throw err;
              var choiceArray = [];
              for (var i = 0; i < results.length; i++) {
                choiceArray.push("Item ID: " + results[i].ID, "Product: " + results[i].PRODUCT_NAME, "Price: " + "$" + results[i].PRICE);
              }
              console.log(choiceArray);
              userID();
            });
        }




