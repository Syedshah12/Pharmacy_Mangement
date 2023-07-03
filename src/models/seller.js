const mongoose = require('mongoose');


const mySchema2 = new mongoose.Schema({
    id: {
        type: Number,
       
    },
    stock_id:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock"
    }],
 amount:{
    type:Number
 },
 date:{
    type:String
 },
 totalProfit:{
    type:Number
 }
})




const Seller = new mongoose.model('Seller', mySchema2);

module.exports = Seller;