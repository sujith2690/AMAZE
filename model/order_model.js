const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true
  },  
  orderitems: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
    quantity:'number'

  }],


  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'address',
    require: true
  },

  OrderStatus: {
    type: String
  },
  paymentMethod: {
    type: String
  },
  
  deliveryStatus: {
    type: String
  },
  
  productStatus:{
    type: String
  },
  coupon: {
    type: String
  },
  discount: {
    type: Number
  },
  totalamount: {
    type: Number
  },
  grandtotalamount: {
    type: Number
  },
   date: {
    type: String
  },

},
  { timestamps: true }
);
const addressModel = mongoose.model('order', userSchema);
module.exports = addressModel;

