var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://nilay:nilay123@project.cbst0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
var client = new MongoClient(uri);
const path = require("path");
var app = express();
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'view'))
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb+srv://nilay:nilay123@project.cbst0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");

const itemSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemSchema);
 const item1 = new Item({ name: "Welcome to ItBuddies" });
// const item2 = new Item({ name: "Like, Share and Subscribe"});
// const item3 = new Item({ name: "Enjoy learning" });

const d = [item1];

app.get("/",function(req,res){
  res.render("home");
})

app.get("/sign",function(req,res){
  res.render("sign");
})
app.post("/sign",function(req,res){
  var email = req.body.email;
  var password = req.body.password;
  // db.items.find({Study:"B.tech"})
  async function run() {
    try {
      await client.connect();
      const database = client.db("noteapp");
      const users = database.collection("users");
      // create a document to insert
      
      const result = await users.find({email:email})
      console.log(result);
      
      
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
     
    } finally {
      await client.close();
    }
  }
  console.log(typeof(run().catch(console.dir)));
});

app.get("/signup",function(req,res){
  res.render("signup");
})
app.post("/signup",function(req,res){
  var firsname = req.body.fname;
  var lastname = req.body.lname;
  var email = req.body.email;
  var pass = req.body.password;
  async function run() {
    try {
      await client.connect();
      const database = client.db("noteapp");
      const users = database.collection("users");
      // create a document to insert
      const user = {
        name: firsname,
        lastname:lastname,
        email:email,
        password:pass
      }
      const result = await users.insertOne(user);
      
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
      if(result.acknowledged === true){
        res.redirect('/noteapp');
      }else{
        res.redirect("/signup")
      }
    } finally {
      await client.close();
    }
  }
  console.log(typeof(run().catch(console.dir)));

});

app.get("/about",function(req,res){
  res.render("about");
})

app.get("/feedback",function(req,res){
  res.render("feedback");
})

app.get("/noteapp", function (req, res) {
  Item.find({}, function (err, f) {
    if (f.length === 0) {
       Item.insertMany(d, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved items to database");
        }
      });
      res.redirect("/noteapp");
    } else {
      res.render('list.ejs', { newListItem: f });
    }
  });
});

app.post("/noteapp", function (req, res) {
  i = req.body.n;
  const item = new Item({
    name: i,
  });
  item.save();
  res.redirect("/noteapp");
});

app.post("/delete", function (req, res) {
  Item.findByIdAndRemove(req.body.checkbox, function (err) {
    if (!err) {
      console.log("Successfully deleted");
      res.redirect("/noteapp");
    }
  });
});

app.listen(3000, function () {
  console.log("listening on port 3000.");
});