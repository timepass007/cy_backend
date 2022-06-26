const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
       userid: {type:"String", sparse:"true"},
       id: {type:"Number", sparse:"true"},
       title: String,
       price: Number,
       description: String,
       category: String,
       image: String,
       rating: {
           rate: Number,
           count: Number
       },
        qty:Number
});

module.exports = mongoose.model("carts", cartSchema);