const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true
  },

    addresses: [{
      name:String,
      housename: String,
      villageorcity: String,
      apartment:String,
      postoffice: String,
      district: String,
      state:String,
      pin: Number,
      mobile: Number,
      landmark: String
    }]

},
  { timestamps: true }
);
const addressModel = mongoose.model('address', userSchema);
module.exports = addressModel;

