// requiring packages
var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

// info for mysql connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    user: "root",
  
    password: "lakers",
    database: "bamazon"
  });

// connecting to mysql
  connection.connect(function(err) {
    if (err) throw err;
    getItems();
  });


// function to grab items from database table
  function getItems() {

// instantiating a table to display the storefront
    var table = new Table({
      head: ['item id', 'Product Name', 'Department', 'Price', 'Quantity']
    });

    // selecting the table products
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log('=================================================');   
        console.log('***********Welcome to Bamazon!***********');

        // looping over the items and pushing data into table
        for(i=0;i<results.length;i++){
          table.push(
            [results[i].item_id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]
          );
        }

        // converting the table into a string format
        console.log(table.toString());

        console.log('=================================================');   


// showing the user which items they can buy 
        inquirer
          .prompt([
            {
              name: "choice",
              type: "input",
              choices: function() {
                var options = [];
                for(i=0;i<results.length;i++){
                    options.push('Item ID: ' + results[i].item_id + ' Product Name: ' + results[i].product_name + ' Price: ' + '$' + results[i].price);
                  }
                  return options;
            },
            message: "Please list the name of the item you'd like to purchase"
        },
        {
        name: "quantity",
        type: "input",
        message: "How much would you like to buy?"
        },
    ])

    // capturing user input
    .then(function(answer) {
      // console.log(answer.choice);
      // console.log(answer.quantity);
      var item = answer.choice;
      var quantity = answer.quantity;

      // grabbing a product name with item as an argument
      connection.query('SELECT * FROM Products WHERE product_name = ?', item, function(error, response) {
        if (error) { console.log(error) };
        // console.log(response[0].stock_quantity);


        // checking available stock
        if (quantity <= response[0].stock_quantity){

          var price = response[0].price * quantity;
          console.log("You've successfully placed your order!");
          console.log("Your total cost for today is " + price + " dollars");
          console.log("------------------------------------");

          // the item is checked and updates quantity to mysql
          connection.query('UPDATE products SET ? WHERE ?', [{
            stock_quantity: response[0].stock_quantity - quantity
          },{
            product_name: item
          }], 
          console.log("Quantity successfully updated"),
          function(err, res){
            if (err){
              console.log(err);
            }

            else {
              console.log("Sorry, insufficient quantity!");
              console.log("Please select another item");
            }
          });
        };
      });
    });
  });
};
