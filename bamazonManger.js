var inquirer = require('inquirer');
var mysql = require('mysql');
////==========g vars to take in inputs and manipulate the database
var amountOwed;
var currentDepartment;
var updateSales;
//========data base connection section 
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'root',
	database: 'Bamazon'
});

//Establish Connection
connection.connect(function(err){
	if (err) throw err;
	console.log('connected as id: ' + connection.threadId)
});
//=============================================================
//FUNCTIONS
//=============================================================
