
const mongoose=require('mongoose');
const categorySchema=new mongoose.Schema({
  categoryname:{

    type:String,
  }
    
},{timestamps:true}


);


const categoryModel=mongoose.model('category',categorySchema);

module.exports=categoryModel;


