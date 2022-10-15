const couponModal = require("../model/coupon_model");
let objectid = require('mongodb').ObjectId
const cart_controller = require('../controller/cart_controller')

module.exports = {

  addcoupen: (coupondata) => {
    return new Promise(async (resolve, reject) => {
      console.log(coupondata, "data of coupen");
      let coupon = new couponModal({
        Couponname: coupondata.Couponname,
        Couponcode: coupondata.Couponcode,
        Discountprice: coupondata.Discountprice,
        Discountpricelimit: coupondata.Discountpricelimit,
        Couponlimit: coupondata.Couponlimit,
        Date: new Date(),
      });
      coupon.save().then((coupon) => {
        resolve(coupon);
      });
    });
  },

  getcoupen: () => {
    return new Promise(async (resolve, reject) => {
      let response = {};


      let coupon = await couponModal.find().lean();
      console.log(coupon, '---+++++++++++ cccccccccccppppppp')
      if (coupon) {
        //  console.log(cart);
        if (coupon.length > 0) {
          response.couponempty = false
          coupon.count = coupon.length
          response = coupon;
          //  console.log('response cart');
          resolve(response)

        } else {
          response.couponempty = true
          response = coupon;
          console.log(response, '----------no  coupen ')
          resolve(response)

        }
      } else {
        response.couponempty = true
        resolve(response)
        console.log(response, '---------response couponempty');

      }
      response = coupon;
      resolve(response);
    });
  },
  updatecoupen: (couponid, coupondata) => {
    console.log(couponid, coupondata, "twoos");
    return new Promise(async (resolve, reject) => {

      couponModal
        .findByIdAndUpdate(couponid, {
          Couponname: coupondata.Couponname,
          Couponcode: coupondata.Couponcode,
          Discountprice: coupondata.Discountprice,
          Discountpricelimit: coupondata.Discountpricelimit,
          Couponlimit: coupondata.Couponlimit,
          Date: new Date(),
        })
        .then((response) => {
          console.log(response, "here true or false");
          resolve(response);
        });
    });
  },

  deletecoupen: (coupenid) => {
    return new Promise(async (resolve, reject) => {
      couponModal.findByIdAndDelete({ _id: coupenid }).then((response) => {
        resolve(response);
      });
    });
  },


  applyCoupon: (userID, coupendata) => {
    //console.log(userID, "------------------useriddddddd");
    //console.log(coupendata.code, "------------coupendataaaaaaa");
    return new Promise(async (resolve, reject) => {
      try {
        let response = {};
        // let number = coupendata.code
        //console.log(number,'-----number');

        let coupen = await couponModal.findOne({
          Couponcode: coupendata.code,
        })
       // console.log(coupen, "----------coupenood");
        cart_controller.totalAmount(userID).then(async (totalamount) => {
         // console.log(totalamount.grandtotalprice, "---------totalamount");
          let total = totalamount.grandtotalprice
          if (coupen) {
           // console.log(total, '--------kkkkkkkkkk')
            response.coupen = coupen;
            let coupenuser = await couponModal.findOne({
              Couponcode: coupendata.code,
              userId: { $in: [userID] },
            });
            if (coupen.Discountpricelimit <= total) {
              // console.log(coupen, '--------ttttttttttttt')
             // console.log(coupen.Discountpricelimit, "coupenlimit");
             // let coupon_limit = coupen.Discountpricelimit
              let coupon_discountprice = coupen.Discountprice
              response.Status = true;
             // console.log(coupenuser, '----------coupenuser')
              if (coupenuser) {
               // console.log(coupenuser, '----------coupenuser')
                response.Status = false;
                resolve(response);
              } else {
                let Coupon_grandtotal = total - coupon_discountprice
                //console.log(Coupon_grandtotal, '----------Coupon_grandtotal')
                
                response.Coupon_Discount = coupon_discountprice;
                response.total = total
                response.Coupon_grandtotal = Coupon_grandtotal

               // console.log(response, '-----------final response')
                resolve(response);
              }
              // else {
              // response.Status = true;
              // response.coupen = response;
              // Helpers.addproductdetails(userID).then((cartprod) => {
              //   Helpers.getTotaldiscount(userID).then((totaldiscount) => {
              //     console.log(cartprod.cart, "productiddddd");
              //     cart = cartprod.cart;
              //  });
              // });
              // }

            } else {
              response.Status = false;
              resolve(response);
             // console.log(response, "hearelast response");
            }
          } else {
            response.Status = false;
            resolve(response);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  // getcoupenvalue: (coupenid) => {
  //   return new Promise(async (resolve, reject) => {
  //     let response = {};
  //     let coupen = await couponModal.findOne({ _id: coupenid }).lean();

  //     response = coupen;
  //     resolve(response);
  //   });
  // },

  coupenUser: (userid, coupen) => {
    console.log(userid, coupen, "coupeniddddd");
    return new Promise(async (resolve, reject) => {
      try {
        let coupens = await couponModal.findOne({
          Couponcode: coupen.code,
        });

        console.log(coupens, '----------5555555555555');

        console.log(coupens._id,'---------coupon id');
        //if (coupens) {
        await couponModal
          .findByIdAndUpdate(coupens._id, { $push: { userId: userid } })
          .then((response) => {
            console.log(response, "-----------ttttttttttt  ")
            resolve(response);
          });
       
      } catch (error) {
        reject(error);
      }
    });
  },



}