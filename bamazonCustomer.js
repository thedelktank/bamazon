let mysql = require('mysql');
let inquirer = require('inquirer');
let Table = require('cli-table2');
let connection = mysql.createConnection({
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

let displayProducts = function(){
	let query = "Select * FROM products";
	connection.query(query, function(err, res){
	if(err) throw err;
	var tblDisply = new Table ({
	head: ["Item ID", "Product Name", "Category", "Price", "Quantity"],
	colWidths: [10,25,25,10,14]
		});
		for(var i = 0; i < res.length; i++){
			tblDisply.push(
				[res[i].item_id,res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
				);
		}
		console.log(tblDisply.toString());
		purchasePrompt();
	});
}

function purchasePrompt(){
	inquirer.prompt([
	{
		name: "ID",
		type: "input",
		message:"Enter the ID/Mnemonic of the item you would like to purchase.",
		filter: String
	},
	{
		name:"Quantity",
		type:"input",
		message:"How many do you want to buy?",
		filter: String
	},

 ]).then(function(answers){
 	let neededQuantity = answers.Quantity;
 	let requestID = answers.ID;
 	purchaseOrder(requestID, neededQuantity);
 });
};

function purchaseOrder(ID, amtNeeded){
	connection.query('Select * FROM products WHERE ?',{item_id: ID}, function(err,res){
		if(err){console.log(err)};
		if(amtNeeded <= res[0].stock_quantity){
			let productCost = res[0].price * amtNeeded;
			console.log("Order in stock.");
			console.log("Your total cost for " + amtNeeded + " " +res[0].product_name + " is " + productCost + " Please come again!");
			let updatedQuantity = res[0].stock_quantity - amtNeeded
			connection.query("UPDATE products SET ? WHERE ?",[{
				stock_quantity: updatedQuantity
			},
			{
				item_id: ID
		}]);
		} else{
			console.log("All items have been bought. Stock depleted. " + res[0].product_name + "to complete your order.");
		};
		displayProducts();
	});
};

displayProducts(); 
