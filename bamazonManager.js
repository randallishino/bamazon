// requiring packages
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');


// mysql database 
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    user: "root",
  
    password: "lakers",
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
            message: "Hi manager, please select an option"
        },
    ])
    .then(function(answer) {
        if (answer.choices === "view products for sale") {
            displayTable();
        }
        else if(answer.choices === "view low inventory") {
            lowInventory();
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

