const mongoose = require('mongoose')
const doc = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user',
    require:true
  },
  wishlistData:[{
    productId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'product',
      require:true
    }
  }]
},{timestamps:true})

const wishlistModel = mongoose.model('wishlist',doc)
module.exports = wishlistModel;