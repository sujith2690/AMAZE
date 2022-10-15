const mongoose = require('mongoose')

const subcategorySchema = new mongoose.Schema({

  subcategoryname: {
    type: String
  },
  categoryname: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'category'
  }
},
  { timestamps: true }
)
const subcategoryModal = mongoose.model('subcategory', subcategorySchema)
module.exports = subcategoryModal;