// requiring packages
require('dotenv').config();
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');


// mysql database 
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    user: "root",
  
    password: process.env.PASSWORD,
    database: "bamazon"
  });


  connection.connect(function(err) {
    if (err) throw err;
    displayManager();
  });


  //  manager functionality depending on what is picked
  function displayManager() {
      if (process.argv[2] === "manager") {
        inquirer
        .prompt([
          { name: "choices",
            type: "list",
            choices: ["view products for sale","view low inventory","add to inventory","add new product"],
            message: "Hi manager, what would you like to do today?"
        },
    ])
    .then(function(answer) {
        if (answer.choices === "view products for sale") {
            displayTable();
        }
        else if(answer.choices === "view low inventory") {
            lowInventory();
        }
        else if(answer.choices === "add to inventory") {
            addInventory();
            displayTable();
        }
        else if(answer.choices === "add new product") {
            addItem();
        }
    });
}
  };


// displaying the storefront 
function displayTable() {
    var table = new Table({
        head: ['item id', 'Product Name', 'Department', 'Price', 'Quantity']
      });


      connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log('=================================================');   
        console.log('Here are the available products');

        // looping over the items and pushing data into table
        for(i=0;i<results.length;i++){
          table.push(
            [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
          );
        }

        // converting the table into a string format
        console.log(table.toString());

        console.log('=================================================');   
})
};

// if chosen, will display low inventory
function lowInventory() {

    // creating a query to check for < 5 quantity
    connection.query('SELECT * FROM Products WHERE stock_quantity < 5', function(err,results) {

        console.log("Here are the low inventory products");
        console.log("-----------------------------------");
        var table = new Table({
            head: ['item id', 'Product Name', 'Department', 'Price', 'Quantity']
          });
        for(i=0;i<results.length;i++){
            table.push(
              [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
            );
          }
  
          // converting the table into a string format
          console.log(table.toString());
    });
};

// adding more stock to an item
function addInventory() {
    inquirer
    .prompt([
      { name: "item",
        type: "input",
        message: "Please select an item to add inventory"
    },
    {
    name: "quantity",
    type: "input",
    message: "How much would you like to add?"
    }
])
.then(function(answer) {
    var item = answer.item;
    var quantity = parseInt(answer.quantity);
    console.log(quantity);

    connection.query('SELECT * FROM Products WHERE product_name = ?', item, function(error, response) {
        if (error) { console.log(error) };

        if (item) {
        connection.query('UPDATE products SET ? WHERE ?', [{
            stock_quantity: quantity + response[0].stock_quantity
        },{
          product_name: item
        }], 
    )
}
    console.log("You have successfully added inventory");
});
})
};

function addItem() {
    inquirer
    .prompt([
      { name: "item",
        type: "input",
        message: "Please type desired item to be added"
    },
    {
    name: "quantity",
    type: "input",
    message: "How much would you like to add?"
    },
    {
    name: "department",
    type:"input",
    message:"Which department will it be located?"
    },
    {
        name:"price",
        type:"input",
        message:"How much will it cost?"
    }
]).then(function(answer) {
    var queryStr = 'INSERT INTO products SET ?';

    // Add new product to the db
    connection.query(queryStr, {
        stock_quantity:answer.quantity,
        product_name: answer.item,
        department_name: answer.department,
        price: answer.price 
    }
        , function (error, results) {
        if (error) throw error;

        console.log('New product has been added to the inventory under Item ID ' + results.insertId + '.');
        console.log("\n---------------------------------------------------------------------\n");

        // End the database connection
        connection.end();
    });
})
};
