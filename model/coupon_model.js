const mongoose = require('mongoose')

const CoupenSchema = new mongoose.Schema({
  userId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  Couponname: {
    type: String
  },
  Couponcode: {
    type: String
  },
  Discountprice: {
    type: 'number'
  },
  Discountpricelimit:{
    type: 'number'
  },
  Couponlimit: {
    type: 'number'
  },
  Date: {
    type: 'String'
  }

},{ timestamps: true }
)
const coupenmodel = mongoose.model('coupon', CoupenSchema)

module.exports = coupenmodel