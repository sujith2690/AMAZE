const express = require('express');
const router = express.Router();

const usermodel = require('../model/user_model')
const user_controller = require('../controller/user_controller');
const { response, render } = require('../app');
const session = require('express-session')
const usermiddleware = require('../middleware/user_middleware')
const twilio_controller = require('../controller/twilio_controller');
const userModel = require('../model/user_model');
const admin_middleware = require('../middleware/admin_middleware');
const product_controller = require('../controller/product_controller');
const cart_controller = require('../controller/cart_controller');
const wishlist_controller = require('../controller/wishlist_controller');
const category_controller = require('../controller/category_controller');
const { getByCategory } = require('../controller/product_controller');
const address_controller = require('../controller/address_controller');
const order_controller = require('../controller/order_controller');
const { UserBindingList } = require('twilio/lib/rest/chat/v2/service/user/userBinding');
const payment_controller = require('../controller/payment_controller');
const banner_controller = require('../controller/banner_controller');
const coupon_controller = require('../controller/coupon_controller');

/* GET home page. */
// let loggedin =false

let count = {}
let userDetails
const VerifyLogin = (req, res, next) => {
  if (req.session.user) {
    let userid = req.session.user._id
    user_controller.getUserdetails(userid).then((response) => {
      userDetails = response.data;
      cart_controller.totalItems(req.session.user._id).then((cartcount) => {
        wishlist_controller.totalItems(req.session.user._id).then((wishcount) => {
          count.cartcount = cartcount
          count.wishcount = wishcount
          console.log(count, '---------------454545454');

          next()
        })
      })
    })
  } else {
    res.redirect('/login')
  }
}

router.get('/', usermiddleware.isblocked, function (req, res, next) {
  banner_controller.getbannerdata().then((bannerDetails) => {
    product_controller.getlatestProductDetails().then((latest) => {

      console.log(latest, '-----------------latest')

      if (req.session.loggedin) {
        userid = req.session.user._id
        user_controller.getUserdetails(userid).then((response) => {
          console.log(bannerDetails, '----------------bannerDetails')
          let userDetails = response.data;
          cart_controller.totalItems(req.session.user._id).then((cartcount) => {
            wishlist_controller.totalItems(req.session.user._id).then((wishcount) => {
              let count = {}
              count.cartcount = cartcount
              count.wishcount = wishcount
              console.log(count, '---------_count')
              res.render('user/user_home', { user: true, loggedin: true, userDetails, bannerDetails, count, latest })
            })
          })
        })
      }
      else {
        res.render('user/user_home', { user: true, loggedin: false, bannerDetails, latest })
      }
    })
  })
})

//.............. errorrrrrrrrrrrrrrrrrrrrrrrrrr page......//

router.get('/error', (req, res) => {
  res.render('user/404error');
})


// ..............................U S E R     L O G I N ..................//

router.get('/login', (req, res) => {
  if (req.session.loggedin) {
    if (req.session.isblocked) {
      res.render('user/login', { blocked: req.session.isblocked })
      req.session.destroy()
    } else {
      res.redirect('/')
    }
  } else {
    let logginerror = req.session.logginerror
    res.render('user/user_login', { logginerror });
  }
});
//.......................................................................... session distroy.... logout......//

router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})


//...........................................................................user login post method............//

router.post('/login', (req, res, next) => {
  user_controller.userlogin(req.body).then((response) => {
    req.session.email = response.email;
    if (response.status) {
      req.session.loggedin = true
      req.session.user = response.user
     
      console.log("login success");
      res.redirect('/')
    }
    else if (response.usernotfound) {
      req.session.logginerror = true
      console.log("user not found");
      res.redirect('/login')
    }
    else {
      console.log("user login failed");
      res.redirect('/login')
    }
  })
});

//.........user signup............//
router.get('/signup', function (req, res, next) {
  res.render('user/user_signup', { exist: req.session.exist })
  req.session.exist = false
})
router.post('/otp', async (req, res) => {
  try {
    const user = await usermodel.findOne({ email: req.body.email })
    console.log(user, '----------------user');

    if (user) {
      req.session.exist = true
      res.redirect('/signup')
    } else {
      const newUser = new usermodel(req.body)
      console.log(newUser, '--------hai');
      twilio_controller.getOtp(newUser.mobile)
      req.session.data = newUser
      res.render('user/user_otp')
    }
  }
  catch (error) {
    console.log(error);
  }
})
router.get('/user_otp',(req,res)=>{
  let otperror = req.session.otperror
  console.log(otperror,'------------otp error')
  res.render('user/user_otp',{otperror})
})
//..........................O T P      V E R I F Y.............//
router.post('/otpverify', async (req, res, next) => {
  console.log(req.session.data, '-----------user details');
  twilio_controller.checkOut(req.body, req.session.data).then(async (response) => {
    console.log(response, '-----------response');
    if (response == 'approved') {
      console.log(response, '-----------45454');
      req.session.user = true;
      req.session.loggedin = true;
      console.log(req.session.data, '-----------12  response data');
      console.log(req.body, '-----------response data');
      try {
        await usermodel.create(req.session.data).then((user) => {
          req.session.user = user
          console.log(user, '---    otp user')
        })
        console.log('---55--')
        req.session.email = req.session.data.email
        res.redirect('/')
        console.log('---55--')
      } catch (error) {
        next(error)
      }
    } else {
      req.session.otperror = true
      res.redirect('/user_otp')
    }
  })
})

//...........................................P R O F I L E ...............................//

router.get('/profile', VerifyLogin, (req, res) => {

  user = req.session.user._id
  coupon_controller.getcoupon().then((coupons) => {
    address_controller.getAddress(user).then((address) => {
      console.log(userDetails, 'hhhhhhhhhhhhhhhhhhhhhh');
      res.render('user/profile', { user: true, loggedin: true, userDetails, coupons, count, address })
    })
  })
})
router.post('/updateuser', (req, res) => {
  if (req.session.loggedin) {
    let userDetails = req.body
    let userid = req.session.user._id
    console.log(userid, 'siiiiiiiiiiiiii');
    console.log(userDetails, 'sssssssssssssssssssssssss');
    user_controller.updateUser(userid, userDetails).then((response) => {
      console.log(response, 'mmmmmmmmmmmmmmmmmm');
      res.redirect('/profile')
    })
  } else {
    res.redirect('/login')
  }

})
router.post('/add_address', (req, res) => {
  let userId = req.session.user._id
  console.log(req.body, '----------address body');
  console.log(req.session.user._id, 'uuuuuuuuuuuuuddddddddd');
  address_controller.addAddress(req.body, userId).then((response) => {
    console.log(response, 'kkkkkkkkkkkkkkkk');
    res.redirect('/addresses')
  })
})

router.get('/addresses', VerifyLogin, (req, res) => {

  let userId = req.session.user._id
  address_controller.getAddress(userId).then((address) => {
    // console.log(address, 'asasasasasasas')
    res.render('user/addresses', { user: true, loggedin: true, address, userDetails, count })
  })
})

router.get('/remove_address/:id', (req, res) => {
  let addressid = req.params.id
  const userid = req.session.user._id
  // console.log(addressid, 'userrrrrrrrrrrrrrrrrrr');
  address_controller.removeAddresss(userid, addressid).then((response) => {
    res.redirect('/addresses')
  })
})
router.post('/update_address/:id', (req, res) => {
  if (req.session.loggedin) {
    let addressDetails = req.body
    console.log(addressDetails, 'lllllllllllllllllllllllllllll');
    let addressid = req.params.id

    address_controller.updateAddress(addressid, addressDetails).then((response) => {
      res.redirect('/addresses')

    })
  }
})
router.get('/coupons',VerifyLogin,(req,res)=>{
  coupon_controller.getcoupon().then((coupons)=>{
console.log(coupons,'-------------coupons');
    res.render('user/coupons',{ user: true, loggedin: true,count,coupons, userDetails })
  })
})
//////////////////////////////.......orders........//////////////////////////////////////////////
router.get('/orders', VerifyLogin, (req, res) => {
  console.log('....orderrrrrrrrrrrr');
  let userId = req.session.user._id
  order_controller.myOrders(userId).then((orders) => {
    console.log(orders, '----------oooooooooooooorrrr')
    // console.log(address, 'asasasasasasas')
    res.render('user/orders', { user: true, loggedin: true, orders, count, userDetails })
  })
})
router.post('/cancelorder/:_id', (req, res) => {
  console.log(req.params._id, '---------22222222222')
  order_controller.cancelOrder(req.params._id).then((response) => {
    res.json(response)
  })
})

router.get('/view_Order/:_id', VerifyLogin, (req, res) => {
  order_controller.getTrack(req.params._id).then((orderItemsDetails) => {
    console.log(orderItemsDetails._id, '------------44444444444')
    res.render('user/order_products', { user: true, loggedin: true, orderItemsDetails, userDetails, count })
  })
})
router.get('/invoice/:_id', VerifyLogin, (req, res) => {
  order_controller.getTrack(req.params._id).then((orderItemsDetails) => {
    let userId = req.session.user._id
    let addressid = orderItemsDetails.addressId
    address_controller.getAddressData(userId, addressid).then((address) => {
      console.log(address, '----------address');
      console.log(orderItemsDetails, '----------orderItemsDetails');
      res.render('user/invoice', { user: true, loggedin: true, orderItemsDetails, address, count, userDetails })
    })
  })
})




//...............................................S H O P..................................//

router.get('/shop', (req, res) => {
  if (req.session.loggedin) {
    user = req.session.user
    product_controller.getPoductdetails().then((product) => {
      console.log(product, '---------------cat')
      category_controller.getcategory().then((category) => {
        cart_controller.totalItems(req.session.user._id).then((cartcount) => {
          wishlist_controller.totalItems(req.session.user._id).then((wishcount) => {
            let count = {}
            count.cartcount = cartcount
            count.wishcount = wishcount
            res.render('user/shop', { user: true, loggedin: true, user, product, category, userDetails, count })
          })
        })
      })
    })
  } else {
    product_controller.getPoductdetails().then((product) => {
      console.log(product, '---------------cat')
      category_controller.getcategory().then((category) => {
        res.render('user/shop', { user: true, product, category })
      })
    })
  }

})
// ...................
router.get('/shop/:_id', (req, res) => {
  if (req.session.loggedin) {
    user = req.session.user
    category_controller.getcategory().then((category) => {
      product_controller.getByCategory(req.params._id).then((getByCategory) => {
        console.log(getByCategory, 'shop by categoryyyyyyyyyyyyyyyy');
        res.render('user/shop_by_category', { category, getByCategory, user: true, loggedin: true, userDetails })
      })
    })
  }
})

//..............................................................product view...........................//
router.get('/singleproduct/:id', (req, res,next) => {
  let productID = req.params.id
  console.log(productID,'---------------------55');
  product_controller.getPoductvalue(productID).then((productdata) => {
    const eachProduct = productdata.data;
    if (req.session.user) {
      user = req.session.user
      console.log(productdata, 'jjjjjjjjjjjjjjjjjj');
      res.render('user/single_product', { user: true, loggedin: true, userDetails, count, eachProduct })
    } else {
      res.render('user/single_product', { user: true, userDetails, count, eachProduct })
    }
  }).catch((err)=>{
    next(err)
  })
})


//. /////////////////////////////////////////.....cart..////////////////////////////////////....//

router.get('/cart', VerifyLogin, (req, res) => {
  user = req.session.user
  cart_controller.getProductDetails(user._id).then((productdetails) => {
    let emptyCart = productdetails.cartempty
    cart_controller.totalAmount(user._id, productdetails).then((products) => {
      if (!emptyCart) {
        var DatasCart = productdetails.cart.cartdata
        console.log(DatasCart,'-------------------5')
      res.render('user/cart', { user: true, loggedin: true, userDetails, DatasCart, products, count })

      }
      //console.log(products, 'llllllllllllllllllllllll');
      res.render('user/cart', { user: true, loggedin: true, userDetails, emptyCart, DatasCart, products, count })
      // console.log(DatasCart, 'cart view.................');
    })
  })



})

//....................add to cart................................//


router.get('/add_to_cart/:_id', VerifyLogin, (req, res, next) => {
  // console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk')
  cart_controller.getProductDetails(req.session.user._id).then((productdetails) => {
    cart_controller.addToCart(req.params._id, req.session.user._id).then((response) => {
      // console.log(response,'jjjjjjjjjjjjjjjjjjjjjjjjjjj');
      res.json({ response })
    })
  })
    .catch((err) => {
      next(err)
    })

})
//...............remove product from cart................//
router.get('/remove-product/:id', (req, res) => {
  let productID = req.params.id
  const userId = req.session.user._id
  // console.log(userId, 'userrrrrrrrrrrrrrrrrrr');
  cart_controller.removeproducts(userId, productID).then((response) => {
    res.redirect('/cart')
    // console.log('delete..................');

  })
})

//......................inc and dec.........pro..........//

router.post('/incQty/:_id', (req, res) => {
  let productID = req.params._id
  const userId = req.session.user._id
  cart_controller.incQty(productID, userId).then((quantity) => {
    //  console.log(quantity);
    res.json({ status: true, qty: quantity })
  })
})
router.post('/decQty/:_id', (req, res) => {
  let productID = req.params._id
  const userId = req.session.user._id
  cart_controller.decQty(productID, userId).then((quantity) => {
    //console.log(quantity);
    res.json({ status: true, qty: quantity })
  })
})



//.///////////////////////////////////////..chekout.///////////////////////////////////.//
router.post('/add_address_checkout', (req, res) => {
  let userId = req.session.user._id
  // console.log(req.session.user._id, 'uuuuuuuuuuuuuddddddddd');
  address_controller.addAddress(req.body, userId).then((response) => {
    res.redirect('/checkout')
  })
})

router.get('/checkout', VerifyLogin, (req, res) => {

  user = req.session.user

  address_controller.getAddress(user._id).then((address) => {
    console.log(address, '-addadaddaddad')
    cart_controller.getProductDetails(user._id).then((productdetails) => {
      let emptyCart = productdetails.cartempty
      if (emptyCart) {
        res.render('user/checkout', { loggedin: true,emptyCart, user,userDetails})
      }
      let DatasCart = productdetails.cart.cartdata
      cart_controller.totalAmount(user._id, productdetails).then((products) => {
        console.log(products, '-----------checkout............');
        res.render('user/checkout', {user:true,loggedin: true, DatasCart, userDetails, address, products,count})
      })
    })
  })
})



//////////.....................Apply Coupon...../////////////////////////////

router.post('/applyCoupon', VerifyLogin, (req, res) => {
  console.log(req.body, '----------post')
  let userid = req.session.user._id
  console.log(req.body, '-------------applycoupon')
  coupon_controller.applyCoupon(userid, req.body).then((e) => {
    console.log(e, '-------------cou[pn')

    if (e.Status == true) {
      req.session.coupon = e
      console.log(req.session.coupon, '-------------77777777')
      coupon_controller.couponUser(userid, req.body).then((useradded) => {
        console.log(useradded, '-------------77777777')
        res.json(e)
      })
    } else {
      console.log(e, '--------------11111111110000000000')
      res.json(e)
    }


  })
})

// .all............................................


router.post('/payment', VerifyLogin, (req, res) => {
  console.log(req.body, "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz")
  let userid = req.session.user._id
  console.log(userid, '-----user id')
  let addressid = req.body.address

  address_controller.getAddressData(userid, addressid).then((address) => {
    console.log(address, 'dataassa')
    cart_controller.getProductDetails(user._id).then((productdetails) => {

      const coupon = req.session.coupon
      req.body.coupon = coupon
      order_controller.placeOrder(req.body, userid).then((orderDetails) => {
        const orderId = orderDetails._id
        console.log(orderDetails, '.........orderdddddddd  tttttttttt')
        const totalAmount = orderDetails.totalamount

        if (coupon) {

          req.body.coupon = coupon
          console.log(coupon, '------------coupon exist')
          // coupon_controller.couponUser(userid, coupon).then((response) => {
          //console.log(response, '------------5555555555')
          req.session.coupon = null;

          if (req.body.paymentMethod === "COD") {
            //    console.log(req.body.paymentMethod,'......cccccccccccccccccccccccccc')
            res.json({ orderDetails })
          }
          else {
            const totalAmount = orderDetails.grandtotalamount
            payment_controller.generateRazorpay(orderId, totalAmount).then((data) => {
              res.json({ data })
            })
          }
          // })
        } else {
          if (req.body.paymentMethod === "COD") {
            //    console.log(req.body.paymentMethod,'......cccccccccccccccccccccccccc')
            res.json({ orderDetails })
          }
          else {
            payment_controller.generateRazorpay(orderId, totalAmount).then((data) => {
              res.json({ data })
            })
          }
        }


      })
    })
  })

})
router.post('/verifyPayment', VerifyLogin, (req, res, next) => {
  console.log(req.body, '1111111111111111......')
  payment_controller.verifyPayment(req.body).then((response) => {
    res.json({ status: true })
  }).catch((err) => {
    next()
  })
})

router.get('/order_confirm/:_id', VerifyLogin, (req, res) => {
  let orderid = req.params._id
  let user = req.session.user
  //console.log(req.params._id,'44444444444444444')
  order_controller.getTrack(orderid).then((orderItemsDetails) => {
    //  console.log(response.paymentMethod, '-----final response.......')
    let userid = req.session.user._id
    let addressId = orderItemsDetails.addressId
    const orderitems = orderItemsDetails.orderitems
    address_controller.getAddressData(userid, addressId).then((address) => {
      //console.log(address, 'asdasdasdasdad.......')
      res.render('user/order_confirm', { user: true, loggedin: true, orderItemsDetails, address, orderitems, userDetails, count })
    })
  })
})




//............................Wishlist...................................//

router.get('/wishlist', VerifyLogin, (req, res) => {

  console.log('-------------asdfacs')

  userid = req.session.user._id
  wishlist_controller.getProductDetails(userid).then((productdetails) => {
    let emptyWishlist = productdetails.wishlistempty
    if (!emptyWishlist) {
      let wish = productdetails.wish.wishlistData
    }
    res.render('user/wishlist', { user: true, loggedin: true, userDetails, wish, emptyWishlist, count })
    console.log(wish, 'wishlistooooooooooooooout');
  })
})



router.get('/add_to_wishlist/:_id', VerifyLogin, (req, res) => {

  wishlist_controller.addToWishlist(req.params._id, req.session.user._id).then((response) => {
    res.json({ response })
  })



})


router.get('/wishlist_remove-product/:id', (req, res) => {
  let productID = req.params.id
  const userId = req.session.user._id
  // console.log(userId,'userrrrrrrrrrrrrrrrrrr');
  wishlist_controller.removeproducts(userId, productID).then((response) => {
    res.redirect('/wishlist')
    // console.log('delete..................');

  })
})


module.exports = router;
