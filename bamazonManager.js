var mysql = require("mysql");
var inquirer = require("inquirer");

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
var saleColor = clc.green;

//color for viewing low inventory
var lowInventoryColor = clc.blue;

//color for adding inventory
var newInventoryColor = clc.purple;

//color for adding a new product
var newProductColor = clc.yellow;

function start() {

    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Welcome, Manager! Would you like to access the database?",
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
        .prompt( [ {
            name: "doToday",
            type: "rawlist",
            message: "What action would you like to take? (Please enter the item number)",
            choices: ["VIEW PRODUCTS FOR SALE", "VIEW LOW INVENTORY", "ADD INVENTORY", "ADD NEW PRODUCTS"]
        }])
        .then(function (answer) {
                       
            //the function that runs depends on the department
            if (answer.doToday.toUpperCase() === "VIEW PRODUCTS FOR SALE") {
                //function if the user chooses electronics    
                viewProducts();
            } else if (answer.doToday.toUpperCase() === "VIEW LOW INVENTORY") {
                //function if the user chooses jewelry  
                viewLowInventory();
            } else if (answer.doToday.toUpperCase() === "ADD INVENTORY") {
                //function if the user chooses collectibles
                addInventory();
            } else if (answer.doToday.toUpperCase() === "ADD NEW PRODUCTS") {
                //function if the user chooses clothing/accessories
                addProducts();
            } 
        });
}

function viewProducts() {
     //testing function
     // prompt for info about the item being put up for auction
  inquirer
  .prompt([
    {
      name: "confirm",
      type: "confirm",
      message: saleColor("Would you like to view all products currently for sale in Bamazon?"),
      default: true
    }])
    .then(function (user) {
        if (user.confirm === true) {
            console.log(saleColor("Items Available: \n"));

            var query = "SELECT * FROM PRODUCTS";
        
            connection.query(query, function (err, results) {
                if (err) throw err;
                var itemsInString = '';
                for (var i = 0; i < results.length; i++) {
                    itemsInString = '';
                    itemsInString += 'Item ID: ' + results[i].ID + ' || ';
                    itemsInString += 'Product Name: ' + results[i].PRODUCT_NAME + ' || ';
                    itemsInString += 'Price: $' + results[i].PRICE + ' || ';
                    itemsInString += 'Stock Quantity: ' + results[i].STOCK_QUANTITY;
        
                    console.log("\n" + itemsInString);
                            
                };
                console.log("\n------------------------------");
                console.log(saleColor("The items for sale are listed above. You are now being returned to the main menu."));
                chooseAction();
        
        });
        } else {
            console.log("Returning to main menu...");
            start();
        }
    });
};

function viewLowInventory() {
    //testing function
    console.log(lowInventoryColor("There are less than five available for these"))
};

function addInventory() {
    //testing function
    console.log(newInventoryColor("You have added new inventory"))
};

function addProducts() {
    //testing function
     // prompt for info about the item being put up for auction
  inquirer
  .prompt([
    {
      name: "product",
      type: "input",
      message: newProductColor("What is the product you would like to add?")
    },
    {
      name: "department",
      type: "input",
      message: newProductColor("Please add which department your product belongs in.")
    },
    {
      name: "price",
      type: "input",
      message: newProductColor("Enter the price of the product in decimal form with no dollar sign."),
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }, 
    {
        name: "stock",
        type: "input",
        message: newProductColor("Enter the amount of items available for purchase."),
        validate: function(value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }
  ])
  .then(function(answer) {
    // when finished prompting, insert a new item into the db with that info
    connection.query(
      "INSERT INTO PRODUCTS SET ?",
      {
        PRODUCT_NAME: answer.product,
        DEPARTMENT_NAME: answer.department,
        PRICE: answer.price,
        STOCK_QUANTITY: answer.stock
      },
      function(err) {
        if (err) throw err;
        console.log(newProductColor("You have successfully added " + answer.stock + " " + answer.product + "(s) for a cost of " + answer.price + " each.\n"));
        // re-prompt the user for if they want to bid or post
        start();
      }
    );
  });
};

