const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

const items = ["Walk the dog", "Read a book"];
const workItems = ["Open Hyper terminal", "$ mkdir Project-name", "$ touch app.js index.html", "$ npm init"];

//Home route
app.get("/", function(req, res){

    const day = date.getDate();

    //should render all variables simultaneously
    res.render("list", {
        listTitle: day,
        newListItems: items
    });  

});

app.post("/", function(req, res){

    const item = req.body.newItem;

    //check for the correct list to add new item
    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        res.redirect("/");
    }

});

//Work route
app.get("/work", function(req, res){

    res.render("list", {
        listTitle: "Work List",
        newListItems: workItems
    });

});

app.post("/work", function(req, res){

    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");

})

app.listen(3000, function(){
    console.log("Server started on port 3000.");
});
