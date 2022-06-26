const express = require("express");
const cors = require("cors");
require('dotenv').config()
require("./db/config");
const User = require("./db/User");
const Product = require("./db/Product");
const Category = require("./db/Category");
const Cart = require("./db/Cart")


const app = express();

app.use(express.json());
app.use(cors());

// products

app.post("/api/new-product",async (req,resp)=>{
      let product = new Product(req.body);
      let result = await product.save();
      resp.status(201).send(result);
});

app.get("/api/products", async (req,resp)=>{
     let products = await Product.find();
     resp.status(200).send(products);
});

//product-category

app.post("/api/new-category",async (req,resp)=>{
    let category = new Category(req.body);
    let result = await category.save();
    resp.status(201).send(result);
});

app.get("/api/categories", async (req,resp)=>{
    let categories = await Category.find();
    categories= await categories.map(element=>element.category);
    resp.status(200).send(categories);
});

//user
app.post("/api/signup", async (req,resp) =>{
    let usercheck = await User.findOne({email:req.body.email}).select("-password");
    if(usercheck)
    {
        resp.status(409).send("User already exists");
    }
    else
    {
    let user= new User(req.body);
    let result = await user.save();
    result = await User.findOne({email:req.body.email}).select("-password");
    resp.status(201).send(result);
    }
});


app.post("/api/signin", async (req,resp) =>{
    let usercheck = await User.findOne({email:req.body.email});
    if(usercheck)
    {
       if(usercheck.password===req.body.password)
       {
       let result = await User.findOne({email:req.body.email}).select("-password");
        resp.status(200).send(result);
       }
       else
       {
        resp.status(401).send("Invalid credentials"); 
       }
    }
    else
    {
        resp.status(404).send("User does not exist");
    }
});



//cart

app.get("/api/cart/:userid",async (req,resp)=>{
     let cart = await Cart.find({userid:req.params.userid});
     resp.status(200).send(cart);
});

app.post("/api/add-cart", async(req,resp)=>{
    let cart= new Cart(req.body);
    let result = await cart.save();
    resp.status(201).send(result);
})

app.put("/api/update-cart",async (req,resp)=>{
    let data= await Cart.updateOne(
        {userid:req.body.userid ,id:req.body.id},
        {
          $set : { qty:req.body.qty }
        }
    );
    resp.status(200).send(data);
});


app.delete("/api/delete-cart", async (req,resp)=>{
    let data = await Cart.deleteOne(
        { userid: req.body.userid, id:req.body.id }
   );
    resp.status(200).send(data);
});











app.listen(process.env.PORT || 5000);
