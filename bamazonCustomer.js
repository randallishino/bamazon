// requiring packages
var mysql = require('mysql');
var inquirer = require('inquirer');


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
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        console.log('***********Welcome to Bamazon!***********');

        for(i=0;i<results.length;i++){
          console.log('Item ID:' + results[i].item_id + ' Product Name: ' + results[i].product_name + ' Price: ' + '$' + results[i].price + '(Quantity left: ' + results[i].stock_quantity + ')')
        }
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
          console.log("You've successfully placed your order!");

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
          });
        };
      });
    });
  })
};
