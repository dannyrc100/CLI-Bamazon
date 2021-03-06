var inquirer = require('inquirer');
var coloring = require('coloring');

var fs = require('fs');
fs.readFile('config.txt', 'utf8', function (err, data) {
  if (err) throw err;
  var key = data;
  getDatabase(key);
})

var mysql = require('mysql');

function getDatabase(key) {
  var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: key,
    database: 'bamazon_db'
  });
  menu_options(connection);
}

function menu_options(connection) {
  cl('\n');
  inquirer.prompt({
    type: 'list',
    name: 'option',
    message: coloring.green('****** MENU OPTIONS *****'),
    choices: ['View Products In Stock', 'Buy Product', 'View Your Cart', 'Exit']
  }).then(function (answer) {
    switch (answer.option) {
      case 'View Products In Stock':
        viewProducts(connection);
        break;
      case 'Buy Product':
        buyProduct(connection);
        break;
      case 'View Your Cart':
        viewCart(connection);
        break;
      case 'Exit':
        disconnect(connection);
        break;
    }

  });
}

function viewProducts(connection) {
  cl(coloring.green('\n****** PRODUCTS IN STOCK ******\n'));
  var query = 'SELECT item_id, product_name, price, stock_quantity FROM bamazon_db.products';
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      cl(' Product ID#: ' + coloring.bold(res[i].item_id) + ' | Product Name: ' +
        coloring.bold(res[i].product_name) + ' | Price: $' + coloring.bold(res[i].price));
      cl(coloring.green('-------------------------------------------------------------------------------------------'));
    }
    //call function for user to buy product and passing connection as parameter
    menu_options(connection);
  });
}
//function for user to buy product
function buyProduct(connection) {
  cl('\n');
  //use inquirer to get user inputs
  inquirer.prompt([{
      type: 'input',
      name: 'idNumber',
      message: 'To Make A Purchase Enter Product ID#.',
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      // inquirer user to get user input
      type: 'input',
      name: 'quantity',
      message: 'How many would you like to add to your cart?',
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ]).then(function (answer) {
    if (answer.quantity === '') {
      answer.quantity = 0;
    }
    var query = 'SELECT product_name, price, stock_quantity FROM bamazon_db.products WHERE item_id = ' + answer.idNumber;
    connection.query(query, function (err, res) {
      if (err) {
        menu_options(connection);
        return;
      } else {
        if (answer.quantity > res[0].stock_quantity) {
          cl(coloring.red('\n ***** Quantity in stock not available *****'));
          //show user quantity available in stock
          cl('Quantity available in stock: ' + res[0].stock_quantity);
          menu_options(connection);
          return true;
        }
        //condition pass if quantity is stock is available
        else {
          if (res[0].product_name !== undefined && answer.quantity > 0) {
            var product = res[0].product_name;
            var total = res[0].price * answer.quantity;

            fs.appendFile("cart.txt", ", " + product + ', ' + answer.quantity + ', ' + total, function (err) {
              if (err) {
                return print(err);
              }
            });
            cl('\n');
            var newQuantity = res[0].stock_quantity - answer.quantity;
            connection.query('UPDATE bamazon_db.products SET ? WHERE ?', [{
                  stock_quantity: newQuantity,
                  product_sales: total
                },
                {
                  //query the item_id then insert new quantity to this id
                  item_id: answer.idNumber
                }
              ],
              function (err, res) {
                if (answer.quantity > 0) {
                  cl(coloring.green(" It Has Been Added to Your Cart!\n"));
                  menu_options(connection);
                }
              }
            );
          } else {
            inquirer.prompt({
              type: 'list',
              name: 'option',
              message: 'You have missed an input. What would you like to do?',
              choices: ['Continue Shopping.', 'Exit Program.']
            }).then(function (user) {
              if (user.option === 'Continue Shopping.') {
                menu_options(connection);
              } else if (user.option === 'Exit Program.') {
                //exit and end program
                menu_options(connection);
              }
            })
          }
        }
      }
    });
  });
}
//function Cart
function viewCart(connection) {
  cl(coloring.green('\n ****** YOUR CART ******'));
  fs.readFile("cart.txt", "utf8", function (err, data) {
    if (err) {
      return cl(err);
    }
    var cart = data.split(", ");
    var total = '';
    for (var i = 1; i < cart.length; i++) {
      total += parseFloat(cart[i + 2]).toFixed(2);
      var myCart = ' Product Name: ' + cart[i] + ' | Quantity: ' + cart[i + 1] + ' | Total: $' + parseFloat(cart[i + 2]).toFixed(2);

      cl(myCart);
      cl(coloring.green('-------------------------------------------------------------------------------------'));

      i += 2;
    }
    if (total === 0) {
      cl('Your Cart is Empty. Let`s Shopping!!');
      menu_options(connection);
      return;
    }
    cl(' You Pay: $' + total);
    menu_options(connection);
  });
}
//function to end database connection and exit program
function disconnect(connection) {
  fs.writeFile('cart.txt', '', function () {
    cl('\n***** THANKS FOR YOUR PURCHASE! *****\n');
    connection.end();
  });
}

function cl(object) {
  console.log(object);
}