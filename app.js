const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

let items = ["Walk the dog", "Read a book"];
let workItems = ["Open Hyper terminal", "$ mkdir Project-name", "$ touch app.js index.html", "$ npm init"];

//Home route
app.get("/", function(req, res){

    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", options);

    //should render all variables simultaneously
    res.render("list", {
        listTitle: day,
        newListItems: items
    });  

});

app.post("/", function(req, res){

    let item = req.body.newItem;

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
