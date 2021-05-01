const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

mongoose.connect("mongodb+srv://admin-nazar:Pass970584@cluster0.jtfkj.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});
//mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

//List with default items
const itemsSchema = { name: String};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({ name: "Welcome to your To Do List!" });
const item2 = new Item ({ name: "Hit the + button to add a new item." });
const item3 = new Item ({ name: "<-- Hit this to delete and item." });

const defaultItems = [item1, item2, item3];

//User created list
const listSchema = { name: String, items: [itemsSchema]};
const List = mongoose.model("List", listSchema);

//Home route
app.get("/", function(req, res){

    //[To-do]: add date to non work listTitle
    //find() - gives an array as a result
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

});

app.post("/", function(req, res){
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({name: listName}, function(err, foundList){
            if(!err) {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            }
        });
    }
});

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
        //[ToDo] find new delete method to remove deprecation warning
        Item.findByIdAndRemove(checkedItemId, function(err) {
            if (!err) {
                console.log("Item deleted successfully!");
                res.redirect("/");
            }
        });
    } else {
        //{$pull: {field: {id: value}}} - pull from the items array by item id
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
            if (!err) {
                res.redirect("/" + listName);
            }
        });
    }
});

//Create dynamic route
app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);

    //findOne - gives an object back
    List.findOne({name: customListName}, function(err, foundList) {
        if(!err) {
            if(!foundList) {
                //Create new list
                const list = new List ({
                    name: customListName,
                    items: defaultItems
                });
                
                list.save();
                res.redirect("/" + customListName);

            } else {
                //Render existing list
                res.render("list", {
                    listTitle: foundList.name,
                    newListItems: foundList.items
                });
            }
        }
    });

});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port 3000.");
});