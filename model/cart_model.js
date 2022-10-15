const mongoose = require ('mongoose')

const doc = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user',
    require:true
  },
  cartdata : [{
    productId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'product',
      require:true
    },
    quantity:'number'

  }]
},
{timestamps:true}
)
const   cartModal = mongoose.model('cart',doc)
module.exports = cartModal;