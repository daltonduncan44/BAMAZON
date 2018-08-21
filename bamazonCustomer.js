var inquirer = require('inquirer');
var mysql = require('mysql');
////==========g vars to take in inputs and manipulate the database
var amountOwed;

//========data base connection section 
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'root',
	database: 'Bamazon'
});

//Establish Connection
connection.connect(function (err) {
	if (err) throw err;
	console.log('connected as id: ' + connection.threadId)
});
//=============================================================================
//FUNCTIONS
//=============================================================================
//call to start function call back chain
showProducts();
//functions that builds table in console log. 
function showProducts() {
	connection.query('SELECT * FROM products', function (err, res) {
		if (err) throw err;
		console.log('=================================================');
		console.log('=================Items in Store==================');
		console.log('=================================================');

		for (i = 0; i < res.length; i++) {
			console.log('Item ID:' + res[i].ItemID + ' Product Name: ' + res[i].ProductName + ' Price: ' + '$' + res[i].Price + '(Quantity left: ' + res[i].StockQuantity + ')')
		}
		console.log('=================================================');
		placeOrder();
	})
}

//asks user to enter items id and gather their selection 
function placeOrder() {
	inquirer.prompt([{
		name: 'selectId',
		message: 'Please enter the ID of the product you wish to purchase',
		validate: function (value) {
			var valid = value.match(/^[0-9]+$/)
			if (valid) {
				return true
			}
			return 'Please enter a valid Product ID'
		}
	}, {
		///=======ask user how many they want
		name: 'selectQuantity',
		message: 'How many of this product would you like to order?',
		validate: function (value) {
			var valid = value.match(/^[0-9]+$/)
			if (valid) {
				return true
			}
			return 'Please enter a numerical value'
		}
	}]).then(function (answer) {
		connection.query('SELECT * FROM Products WHERE ItemID = ?', [answer.selectId], function (err, res) {
			if (answer.selectQuantity > res[0].StockQuantity) {
				console.log('Insufficient Quantity');
				console.log('This order has been cancelled');
				console.log('');
				newOrder();
			}
			else {
				amountOwed = res[0].Price * answer.selectQuantity;
				currentDepartment = res[0].DepartmentName;
				console.log('Thanks for your order');
				console.log('You owe $' + amountOwed);
				console.log('');
				//update products table
				connection.query('UPDATE Products SET ? Where ?', [{
					StockQuantity: res[0].StockQuantity-- - answer.selectQuantity
				}, {
					id: answer.selectId
				}], function (err, res) { });
				//update departments table

				newOrder();
			}
		})

	}, function (err, res) { })
};

//user can make another order 
function newOrder() {
	inquirer.prompt([{
		type: 'confirm',
		name: 'choice',
		message: 'Would you like to place another order?',
		default: true,

	}]).then(function (answer) {
		if (answer.choice) {
			placeOrder();
		}
		else {
			console.log('Thank you for shopping at Bamazon!');
			//leave the database in log 
			connection.end();
		}
	})
};




