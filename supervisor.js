var inq = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: 'Burbank!123',

    database: "bamazon_db"
})