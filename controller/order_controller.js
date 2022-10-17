const orderModel = require('../model/order_model');
const cartController = require('../controller/cart_controller');
const addressController = require('../controller/address_controller');
const cartmodel = require('../model/cart_model');





module.exports = {

  placeOrder: (orderdata, userid) => {
    console.log(orderdata, 'this is orderdata')
    return new Promise(async (resolve, reject) => {
      try {
        console.log(orderdata.billtype, '......paymentMethod')

        if (orderdata.billtype === 'COD') {
          OrderStatus = true;
        }
        cartController.totalAmount(userid).then((totalAmount) => {
          console.log(totalAmount, 'this is response of total');
          cartController.getProductDetails(userid).then((productdetails) => {
            console.log(productdetails, 'this is cart details');
            console.log(orderdata.coupon, '----------applied coupon')
            
            let today = new Date()
            let newdate = today.toISOString()
            newdate = newdate.slice(0, 10);
            console.log(newdate,'-------------0000000000000000000')

            if (orderdata.coupon) {
              const newOrder = new orderModel({
                userId: userid,
                orderitems: productdetails.cart.cartdata,
                addressId: orderdata.address,
                OrderStatus: true,
                paymentMethod: orderdata.billtype,
                coupon: 'Coupon Applied',
                discount: orderdata.coupon.Coupon_Discount,
                totalamount: totalAmount.grandtotalprice,
                grandtotalamount: orderdata.coupon.Coupon_grandtotal,
                deliveryStatus: 'Pending',
                productStatus: 'Pending',
                date: newdate,
              })
              newOrder.save().then(async (newOrder) => {
                await cartmodel.findOneAndDelete({ userId: userid }).then((response) => {

                resolve(newOrder);
                console.log(newOrder, '..................new order')
                 })
              })
            } else {
              const newOrder = new orderModel({
                userId: userid,
                orderitems: productdetails.cart.cartdata,
                addressId: orderdata.address,
                OrderStatus: true,
                paymentMethod: orderdata.billtype,
                totalamount: totalAmount.grandtotalprice,
                grandtotalamount: totalAmount.grandtotalprice,
                deliveryStatus: 'Pending',
                productStatus: 'Pending',
                date: newdate,
              })
              newOrder.save().then(async (newOrder) => {
                await cartmodel.findOneAndDelete({ userId: userid }).then((response) => {

                  resolve(newOrder);
                  //console.log(newOrder,'..................new order')
                })
              })
            }
          })

        })

      } catch (error) {
        reject(error);
      }
    })
  },

  myOrders: (userid) => {
    console.log(userid, 'is the userid')
    return new Promise(async (resolve, reject) => {
      try {
        await orderModel.find({ userId: userid }).populate('orderitems.productId').sort({ date: -1 }).lean().then((response) => {
          console.log(response, 'this is response form the orders by the user');
          resolve(response);
        })
      } catch (error) {
        reject(error);
      }
    })
  },

  getOrder: (orderid) => {
    return new Promise((resolve, reject) => {
      try {
        orderModel.find({ _id: orderid }).lean().then((response) => {
          console.log(response, '.....this is the orders');
          resolve(response)
        })
      } catch (error) {
        reject(error)
      }
    })
  },


  getTrack: (orderid) => {
    return new Promise(async (resolve, reject) => {
      try {
        await orderModel.findOne({ _id: orderid }).populate('orderitems.productId').populate('userId').lean().then((response) => {
          console.log(response, '.........tracking .........')
          resolve(response);
        })
      } catch (error) {
        console.log('error founded:', error);
        reject(error);
      }
    })
  },


  allOrders: () => {
    return new Promise(async (resolve, reject) => {
      try {
        await orderModel.find().lean().populate('orderitems.productId').populate('userId').sort({ date: -1 }).then((response) => {
          resolve(response);
        })
      } catch (error) {
        reject(error)
      }
    })
  },

  shipOrder: (orderid) => {
    return new Promise(async (resolve, reject) => {
      try {
        await orderModel.findByIdAndUpdate({ _id: orderid }, { productStatus: 'Shipped' }).then((response) => {
          resolve(response);
        })
      } catch (error) {
        reject(error);
      }
    })
  },

  deliveryOrder: (orderid) => {
    return new Promise(async (resolve, reject) => {
      try {
        await orderModel.findByIdAndUpdate({ _id: orderid }, { productStatus: 'Delivered', deliveryStatus: 'success' }).then((response) => {
          resolve(response);
        })
      } catch (error) {
        reject(error);
      }
    })
  },

  cancelOrder: (orderid) => {
    return new Promise(async (resolve, reject) => {
      try {
        await orderModel.findByIdAndUpdate({ _id: orderid }, { productStatus: 'Cancelled', deliveryStatus:'Cancelled'}).then((response) => {
          resolve(response);
        })
      } catch (error) {
        reject(error);
      }
    })
  },



}