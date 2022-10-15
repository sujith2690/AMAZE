const mongoose = require('mongoose')
const Schema = mongoose.Schema
const addproductSchema = new mongoose.Schema({
    brand:{
        type:String
    },
    productname:{
        type:String
    },
    mrp:{
        type:Number
    },
    offerprice:{
        type:Number
    },
    categoryname:{
        type:Schema.Types.ObjectId,
        ref:'category'
    },
    stock:{
        type:Number
    },
    image:{
        type:Array
    },
    percentage:{
        type:Number
    },
    date: {
        type: String
      },
},{timestamps:true})

const productmodel =mongoose.model('product', addproductSchema)
module.exports=productmodel;