// requiring packages
var mysql = require('mysql');
var inquirer = require('inquirer');


// connection for mysql
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
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log('=================Items in Store==================');

        for(i=0;i<results.length;i++){
          console.log('Item ID:' + results[i].item_id + ' Product Name: ' + results[i].product_name + ' Price: ' + '$' + results[i].price + '(Quantity left: ' + results[i].stock_quantity + ')')
        }
        console.log('=================================================');   

        
// showing the user which items they can buy 
        inquirer
          .prompt([
            {
              name: "choice",
              type: "list",
              choices: function() {
                var options = [];
                for(i=0;i<results.length;i++){
                    options.push('Item ID: ' + results[i].item_id + ' Product Name: ' + results[i].product_name + ' Price: ' + '$' + results[i].price);
                  }
                  return options;
            },
            message: "Please list the ID number of the item you'd like to purchase"
        },
        {
        name: "quantity",
        type: "input",
        message: "How much would you like to buy?"
        },
    ])
    .then(function(answer) {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choices) {
            chosenItem = results[i];
          }
        }
    })
})
  };