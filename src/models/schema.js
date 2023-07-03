const mongoose = require('mongoose');
const validator=require('validator');
const { Schema } = mongoose;

const mySchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true
    },
    name: {
        type: String,
    },

    actualprice: {
        type: Number,
    },
    sellprice:{
type:Number,
    },
    stock:{
        type:Number,
     
    },
    formula:{
        type:String,
    },
})












const Stock = new mongoose.model('Stock', mySchema);



module.exports = Stock;
