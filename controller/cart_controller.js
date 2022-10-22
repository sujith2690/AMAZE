const { response } = require("../app");
const cartModal = require("../model/cart_model");
let objectid = require('mongodb').ObjectId

module.exports = {
  addToCart: (productid, userid) => {
    const response = {
      duplicate: false
    };
    return new Promise(async (resolve, reject) => {
      try {
        let user_cart = await cartModal.findOne({ userId: userid })
        //console.log(userid, 'userid...try....')
       // console.log(user_cart, 'usercart........')
        if (user_cart) {
          let cart_product = await cartModal.findOne({ userId: userid, 'cartdata.productId': productid })
          if (cart_product) {
            console.log(cart_product);
            cartModal.updateOne({ 
              userId: userid, 
              'cartdata.productId': productid
            },
              { $inc: { 'cartdata.$quantity': 1 } }
            )
              .then((response) => {
                console.log(response, 'responseeeeeeeeeeeee...')
                response.duplicate = true
                resolve(response)

              })
          } else {
            let cartArray = { productId: productid, quantity: 1 }
            cartModal.findOneAndUpdate({ userId: userid }, {
              $push: { cartdata: cartArray },
            })
              .then((data) => {
                resolve(response)

              });
          }
        } else {
          let body = {
            userId: userid,
            cartdata: [{
              productId: productid, quantity: 1
            }],
          };
          await cartModal.create(body);

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

        let cart = await cartModal.findOne({ userId: userid }).populate('cartdata.productId').lean()

       // console.log(cart, 'adddd product  detaaiiiil');
        if (cart) {
        //  console.log(cart);
          if (cart.cartdata.length > 0) {
            response.cartempty = false
            cart.cartdata.count = cart.cartdata.length
            response.cart = cart;
          //  console.log('response cart');
            resolve(response)

          } else {
            response.cartempty = true
            response.cart = cart
           console.log('cart exist')
            resolve(response)

          }
        } else {
          response.cartempty = true
          resolve(response)
          console.log(response, 'response else');

        }
      })

    } catch (error) {
      console.log('error')
      reject(error)
    }
  },

  removeproducts: (userId, productID) => {

    return new Promise(async (resolve, reject) => {
      await cartModal.findOneAndUpdate({ userId: userId },
        {
          $pull:
          {
            cartdata:
            {
              productId: productID
            }
          }
        }).then((response) => {
          resolve(response)
          
        //  console.log(response, 'deletedddddddddddddddddd');
        })
    })

  },
  incQty: (productID, userid) => {
    return new Promise(async (resolve, reject) => {
      cartModal.updateOne({ userId: userid, 'cartdata.productId': productID }, { $inc: { 'cartdata.$.quantity': 1 } }).then(async (response) => {
        let cart = await cartModal.findOne({ userId: userid })
        let quantity;
        for (let i = 0; i < cart.cartdata.length; i++) {

          if (cart.cartdata[i].productId == productID) {

            quantity = cart.cartdata[i].quantity;
          }
        }
        resolve(quantity)
      })
    })
  },
  decQty: (productID, userid) => {
    return new Promise(async (resolve, reject) => {
      cartModal.updateOne({ userId: userid, 'cartdata.productId': productID }, { $inc: { 'cartdata.$.quantity': -1 } }).then(async (response) => {
        let cart = await cartModal.findOne({ userId: userid })
        let quantity;
        for (let i = 0; i < cart.cartdata.length; i++) {
          if (cart.cartdata[i].productId == productID) {
            quantity = cart.cartdata[i].quantity;
          }
        }
        resolve(quantity)
      })
    })
  },
  totalItems(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        let cartlist = await cartModal.findOne({ userId: userId })
        if (cartlist) {
          let itemsCount = 0
          itemsCount = cartlist.cartdata.length;
          resolve(itemsCount)
        } else {
          itemsCount = 0;
          resolve(itemsCount)
        }
      }
      catch (error) {
        reject(error)
      }
    })
  },
  totalAmount: (userId, productID) => {
    let totalprice = 0
    let qty = 0
    let grandtotalprice = 0


    return new Promise(async (resolve, reject) => {
      await cartModal.findOne({ userId: userId }).populate('cartdata.productId').lean().then((products) => {
     
        if (products) {
          let total = []
          for (let i = 0; i < products.cartdata.length; i++) {
          
            price = products.cartdata[i].productId.offerprice

            qty = products.cartdata[i].quantity
          
            total[i] = price * qty
         
            totalprice = 0
            qty = 0
          }
          for (let i=0; i<total.length; i++){
            totalprice = total[i]
          }
     // console.log(totalprice,'pppppppppppppppppppppppppp')
         // products.total = total

          for (let i = 0; i < total.length; i++) {
            grandtotalprice = grandtotalprice + total[i]
            
          }
         
          products.grandtotalprice = grandtotalprice
          resolve(products)

        } else {
          resolve(products)
        }
      })
    })

  }

}