// Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Burbank!123",

    database: "bamazon_db"
});

displayData()

// Functions

function NewOrder(desired_product_id, desired_quantity) {
    this.id = desired_product_id;
    this.amount = desired_quantity
}



function displayData(){
    connection.connect(function(err){
        if (err) throw err;
        var query = "SELECT * from products";
        connection.query(query, function(err, res){
            if (err) throw err;
            console.log("Here's what's for sale! : " + "\n")
            for (var i = 0; i < res.length; i++) {
                switch (i) {
                    default:
                        console.log("id " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price + " || Amount Available: " + res[i].stock_quantity + "\n<>-------------------------------------------------------------------------<>");
                        break;
                    case 0:
                        console.log("| Table Start |" + "\n" + "id " + res[0].item_id + " || Product Name: " + res[0].product_name + " || Price: " + res[0].price + " || Amount Available: " + res[0].stock_quantity + "\n<>-------------------------------------------------------------------------<>")
                        break;
                    case res.length-1: 
                        console.log("id " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Price: " + res[i].price + " || Amount Available: " + res[i].stock_quantity + "\n<>-------------------------------------------------------------------------<>" + "\n| Table End |")
                        return purchasePrompt();
                }

                
              }
      
        })
    })
}

function purchasePrompt() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to make a purchase?",
            name: "purchase_bool"
        }
    ]).then(function(answer){
        if (answer.purchase_bool === false) {
            console.log("Okay, bye!");
            return connection.end()
        } else {
            inquirer.prompt([
                {
                    type: "list",
                    message: "What is the id of the item you wish to purchase",
                    choices: [1,2,3,4,5,6,7,8,9,10],
                    name: "itemID"
                },
                {
                    type: "input",
                    message: "What's the desired quantity?",
                    name: "quantity"
                }
            ]).then(function(answers){
                var order = new NewOrder(answers.itemID, answers.quantity);
                pushOrder(order)
            })
        }
    })
}



function pushOrder(order){
    var query = "INSERT INTO purchases SET ?"
    connection.query(query,
        {
            desired_product_id: order.id,
            desired_quantity: order.amount
        })
    processOrder(order)
}

function processOrder(order){
    var id = order.id;
    var amount = order.amount;
    console.log(id + " " + amount)
    var query = "SELECT * FROM products WHERE ?"
    connection.query(query, {item_id: id}, function(err, res){
        if (err) throw err;
        var stockAmount = res[0].stock_quantity
        var price = res[0].price
        console.log(stockAmount)
        if (stockAmount - amount > (-1)) {
            console.log("Validating...");
            var query = "UPDATE products SET ? WHERE ?"
            connection.query(query,
                [
                    {
                        stock_quantity: stockAmount - amount,
                    },
                    {
                        item_id: id
                    }
                ],
                function(err, res){
                    if (err) throw err;
                    console.log(res.affectedRows + " rows updated!");
                    console.log("Your total is $" + price * amount)
                    return connection.end()
                }
                )

        } else {
            console.log("Sorry, we don't have enough " + res[0].product_name + "\nReturning to mainscreen");
            connection.end()
            
        }
    })
}







