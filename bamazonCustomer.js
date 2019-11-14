var totalPurchase = 0;
var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});
function start() {
    connection.query("select * from products", function (err, data) {
        if (err) throw err;
        console.table(data);
        question1(data);
    })
}
function question1(data) {
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "Select the id of the item you would like to purchase."
        },
        {
            name: "stock",
            type: "input",
            message: "How many would you like?"
        },


    ]).then(function (ans) {
       var product = data.filter(row=>row.id==ans.item)[0];
       if (product.stock_quantity < ans.stock){
           console.log("Exceeded stock quantity, try again.")
           start()
       } else {
           var newStock = parseInt(product.stock_quantity)-parseInt(ans.stock);
           connection.query(`update products set stock_quantity = ${newStock} where id=${ans.item}`,function(err,data){
            if (err) throw err;
            //console.log(product.price)
            totalPurchase += parseFloat(product.price)
            yesNo()
           })
       }
    })
    function yesNo(){
        inquirer.prompt([
            {
                name: "choice",
                type: "list",
                message: "Would you like to continue shopping?",
                choices: ["yes","no"]
            }
        ]).then(function(ans){
          if(ans.choice == "yes"){
              start()
          } else{
              console.log(`Thank you for shopping! Your total is $${totalPurchase}`)
              connection.end()
              return false
          }
        })
    }
}