const razorpay = require('razorpay');
const { response } = require('../app');
const orderModel = require('../model/order_model')
let instance = new razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

module.exports = {
  generateRazorpay: (orderid, totalAmount) => {
    return new Promise((resolve, reject) => {
      let options = {
        amount: totalAmount*100, //amount in the samllwst currency unit
        currency: "INR",
        receipt: orderid, 

      }
      instance.orders.create(options, function (err, orders) {
        console.log(options,'--------this is instance pay ment method')
        resolve(options)
      })
    })
  },
  verifyPayment:(details)=>{

    return new Promise(async(resolve,reject)=>{
      try {
        const crypto = require('crypto')
        let hmac = crypto.createHmac('sha256',instance.key_secret);
        let body = details.payment.razorpay_order_id + "|" + details.payment.razorpay_payment_id;

        hmac.update(body.toString());
        hmac = hmac.digest('hex') 
        if(hmac==details.payment.razorpay_signature){
          console.log('this is resolved')
          resolve();
        }else{
          console.log('this is reject')
          reject(err)
        }
      } catch (error) {
        console.log('this is error in razor verifing')
        console.error(error)
        reject(error)
      }
    })
  },
  changePaymentStatus:(orderid)=>{
    console.log(orderid,'this id form changepyment status')
    return new Promise(async(resove,reject)=>{
      try {
        await orderModel.findOneAndUpdate({_id:orderid},{OrderStaus:true,deliveryStatus:'success'}).then((response)=>{
         resolve(response)
        })
      } catch (error) {
        reject(error)
      }
    })
  }
}