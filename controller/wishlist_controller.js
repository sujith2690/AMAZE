const wishlistModel = require("../model/wishlist_model");


module.exports = {
  addToWishlist: (productid, userid) => {
  
    const response = {
      duplicate: false
    };
    
    return new Promise(async (resolve, reject) => {
      try {
        let user_wishlist = await wishlistModel.findOne({ userId: userid })
      
        if (user_wishlist) {
          let wishlist_product = await wishlistModel.findOne({ userId: userid, 'wishlistData.productId': productid })
          if (wishlist_product) {
        
            wishlistModel.updateOne({
              userId: userid, 'wishlistData.productId': productid
            },
              { $inc: { 'cartdata.$quantity': 1 } }
            )
            
              .then((response) => {
             
                response.duplicate = true
                resolve(response)

              })
          } else {
            let wishlistArray = { productId: productid, quantity: 1 }
            wishlistModel.findOneAndUpdate({ userId: userid }, {
              $push: { wishlistData: wishlistArray },
            })
              .then((data) => {
                resolve(response)

              });
          }
        } else {
          let body = {
            userId: userid,
            wishlistData: [{
              productId: productid, quantit: 1
            }],
          };
          await wishlistModel.create(body);

        }
      } catch (error) {
        console.log('error');
        reject(error);
      }
    });


  },
  getProductDetails: (userid) => {
    try {
      return new Promise(async (resolve, reject) => {
        const response = {};

        let wish = await wishlistModel.findOne({ userId: userid }).populate('wishlistData.productId').lean()
        // ..................
        // let response = {}
        //     let product = await productmodel.find().populate("categoryname").lean()
        //     //   console.log(product,'kjjjjj');
        //     response.status;
        //     response.data = product;
        //     resolve(response)
        // //...........

        console.log(wish, 'adddd product  detaaiiiil');
        if (wish) {
          console.log(wish);
          if (wish.wishlistData.length > 0) {
            response.wishlistempty = false
            response.wish = wish;
            console.log('response wishlist');
            resolve(response)

          } else {
            response.wishlistempty = true
            response.wish = wish
            console.log('wishlist exist')
            resolve(response)

          }
        } else {
          response.wishlistempty = true
          resolve(response)
          console.log(response, 'response else');
          

        }
      })

    } catch (error) {
      console.log('error')
      reject(error)
    }
  },

  removeproducts(userId,productID) {
    console.log(productID,"iiiiiiiiiddddddddddddddd")
    console.log(userId);
    // console.log(productID);
    return new Promise(async (resolve, reject) => {
      await wishlistModel.findOneAndUpdate({ 'wishliatData.productId': productID,userId:userId},{$pull:{wishlistData:{productId:productID}}}).then((response) => {
        resolve(response)
        resolve(response)
        console.log(response, 'deletedddddddddddddddddd');
      })
    })

  },
  totalItems(userId){
    return new Promise(async(resolve,reject)=>{
      try{
        let wishlist = await wishlistModel.findOne({userId:userId})
        if(wishlist){
          let itemsCount = 0
          itemsCount = wishlist.wishlistData.length;
          resolve(itemsCount)
        }else{
          itemsCount = 0;
          resolve(itemsCount)
        }
      }
      catch(error){
        reject(error)
      }
    })

  }
}