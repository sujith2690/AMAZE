const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bannerSchema = new mongoose.Schema({
  bannerheading:{
    type  : String,
    require: true
  },
  bannersubheading:{
    type  : String,
    require: true
  },
  image : {
    type :Array,
  },
 backgroundimage : {
    type :Array,
  },
  description : {
    type :String,
  },

},{timestamps:true})
const bannerModel = mongoose.model('banner',bannerSchema)
module.exports = bannerModel;