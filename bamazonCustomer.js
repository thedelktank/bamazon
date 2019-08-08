var mysql = require('mysql');
var inquirer = require('inquirer');
let Table = require('cli-table2');
var connection = mysql.createConnection({
  host:"localhost",
  port: 3306,
  user:'root',
  password:"10763060Ted",
  database: 'poop'
})


connection.connect(function(err){
	if(err)throw err;
	console.log("connected as id" + connection.threadId);
});

var displayProducts = function(){
	var query = "Select * FROM products";
	connection.query(query, function(err, res){
		if(err) throw err;
		var displayTable = new Table ({
			head: ["Item ID", "Product Name", "Category", "Price", "Quantity"],
			colWidths: [10,25,25,10,14]
		});
		for(var i = 0; i < res.length; i++){
			displayTable.push(
				[res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
				);
		}
		console.log(displayTable.toString());
		purchasePrompt();
	});
}

function purchasePrompt(){
	inquirer.prompt([
	{
		name: "ID",
		type: "input",
		message:"Please enter Item ID you like to purhcase.",
		filter: String
	},
	{
		name:"Quantity",
		type:"input",
		message:"How many items do you wish to purchase?",
		filter: String
	},

 ]).then(function(answers){
 	var neededQuantity = answers.Quantity;
 	var requestID = answers.ID;
 	purchaseOrder(requestID, neededQuantity);
 });
};

function purchaseOrder(ID, amtNeeded){
	connection.query('Select * FROM products WHERE ?',{item_id: ID}, function(err,res){
		if(err){console.log(err)};
		if(amtNeeded <= res[0].stock_quantity){
			var totalCost = res[0].price * amtNeeded;
			console.log("Good news your order is in stock!");
			console.log("Your total cost for " + amtNeeded + " " +res[0].product_name + " is " + totalCost + " Thank you!");
			let updatedQuantity = res[0].stock_quantity - amtNeeded
			connection.query("UPDATE products SET ? WHERE ?",[{
				stock_quantity: updatedQuantity
			},
			{
				item_id: ID
		}]);
		} else{
			console.log("Insufficient quantity, sorry we do not have enough " + res[0].product_name + "to complete your order.");
		};
		displayProducts();
	});
};

displayProducts(); 
