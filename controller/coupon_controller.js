const couponModal = require("../model/coupon_model");
let objectid = require('mongodb').ObjectId
const cart_controller = require('../controller/cart_controller')

module.exports = {

  addcoupon: (coupondata) => {
    return new Promise(async (resolve, reject) => {
      console.log(coupondata, "data of coupon");
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

  getcoupon: () => {
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
          console.log(response, '----------no  coupon ')
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
  updatecoupon: (couponid, coupondata) => {
    
    console.log(couponid, coupondata, "twoos");
    console.log( coupondata.Couponname, "--------------Couponname");
    return new Promise(async (resolve, reject) => {

      couponModal
        .findByIdAndUpdate(couponid, {
          Couponname: coupondata.couponname,
          Couponcode: coupondata.couponCode,
          Discountprice: coupondata.Discountprice,
          Discountpricelimit: coupondata.Discountpricelimit,
          Couponlimit: coupondata.couponlimit,
          Date: new Date(),
        })
        .then((response) => {
          console.log(response, "here true or false");
          resolve(response);
        });
    });
  },

  deletecoupon: (couponid) => {
    return new Promise(async (resolve, reject) => {
      couponModal.findByIdAndDelete({ _id: couponid }).then((response) => {
        resolve(response);
      });
    });
  },


  applyCoupon: (userID, coupondata) => {

    return new Promise(async (resolve, reject) => {
      try {
        let response = {};
        let coupon = await couponModal.findOne({
          Couponcode: coupondata.code,
        })
        console.log(coupon, "----------couponood");
        cart_controller.totalAmount(userID).then(async (totalamount) => {
          // console.log(totalamount.grandtotalprice, "---------totalamount");
          let total = totalamount.grandtotalprice
          if (coupon) {
            // console.log(total, '--------kkkkkkkkkk')
            response.coupon = coupon;
            let couponuser = await couponModal.findOne({
              Couponcode: coupondata.code,
              userId: { $in: [userID] },
            });
            if (coupon.Discountpricelimit <= total) {
              // console.log(coupon, '--------ttttttttttttt')
              // console.log(coupon.Discountpricelimit, "couponlimit");
              // let coupon_limit = coupon.Discountpricelimit
              let coupon_discountprice = coupon.Discountprice
              response.Status = true;
              // console.log(couponuser, '----------couponuser')
              if (couponuser) {
                // console.log(couponuser, '----------couponuser')
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
              // response.coupon = response;
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

  // getcouponvalue: (couponid) => {
  //   return new Promise(async (resolve, reject) => {
  //     let response = {};
  //     let coupon = await couponModal.findOne({ _id: couponid }).lean();

  //     response = coupon;
  //     resolve(response);
  //   });
  // },

  couponUser: (userid, coupon) => {
    console.log(userid, coupon, "couponiddddd");
    return new Promise(async (resolve, reject) => {
      try {
        let coupons = await couponModal.findOne({
          Couponcode: coupon.code,
        });

        console.log(coupons, '----------5555555555555');

        console.log(coupons._id, '---------coupon id');
        //if (coupons) {
        await couponModal
          .findByIdAndUpdate(coupons._id, { $push: { userId: userid } })
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