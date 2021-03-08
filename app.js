const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const Item = mongoose.model("Item", {name: String});

const item1 = new Item ({
    name: "Welcome to your To Do List!"
});

const item2 = new Item ({
    name: "Hit the + button to add a new item."
});

const item3 = new Item ({
    name: "<-- Hit this to delete and item."
});

const defaultItems = [item1, item2, item3];

//Home route
app.get("/", function(req, res){

    //[To-do]: add date to non work listTitle
    Item.find({}, function(err, foundItems) {
        if (err) {
            console.log(err)
        } else {
            //if default items array length is 0 -> create items to display
            if (foundItems.length === 0) {
                Item.insertMany(defaultItems, function(err){
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Documents were added successfully!");
                    }
                });
                res.redirect("/");
            } else {
                //render array items
                res.render("list", {
                    listTitle: "Today",
                    newListItems: foundItems
                }); 
            }
        }
    })

    //const day = date.getDate();

    //should render all variables simultaneously
    // res.render("list", {
    //     listTitle: "Today",
    //     newListItems: items
    // });  

    // res.render("list", {
    //     listTitle: day,
    //     newListItems: items
    // });  

});

app.post("/", function(req, res){
    const itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    item.save();
    res.redirect("/");

    // //check for the correct list to add new item
    // if (req.body.list === "Work") {
    //     workItems.push(item);
    //     res.redirect("/work");
    // } else {
    //     items.push(item);
    //     res.redirect("/");
    // }

});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;

    //[ToDo] find new delete method to remove deprecation warning
    Item.findByIdAndRemove(checkedItemId, function(err) {
        if (!err) {
            console.log("Item deleted successfully!");
            res.redirect("/");
        }
    });
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

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000.");
});
