const express = require('express');
const router = express.Router();

const User = require("../model/user_model")
const Admin = require('../model/admin_model')
const admin_controller = require('../controller/admin_controller');
const admin_middleware = require('../middleware/admin_middleware')
const categoryModel = require('../model/category_model')
const category_Controller = require('../controller/category_controller');
const { response } = require('../app');
const session = require('express-session');
const banner_controller = require('../controller/banner_controller')
const dashboard_controller = require('../controller/dashboard_controller')


//...........MulteR.............//
const multer = require('multer');
const product_controller = require('../controller/product_controller');
const coupon_controller = require('../controller/coupon_controller');
const order_controller = require('../controller/order_controller');

const filestorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/productimages')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname)
  }
})
const upload = multer({ storage: filestorageEngine })

// .any...............................................

const bannerImagestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/banner-images')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname)
  }
})
const upload1 = multer({ storage: bannerImagestorage })



const VerifyAdmin = (req, res, next) => {
  if (req.session.admin_login) {
    next()
  } else {
    res.redirect('/admin')
  }
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  if (req.session.admin_login) {
    res.redirect('/admin/admin_home')
  }
  res.render('admin/admin_login', { admin: true, loginErr: req.session.loginErr });
  req.session.loginErr = false
})

//..............Aadmin login post method............//

router.post('/adminlogin', (req, res) => {

  admin_controller.adminlogin(req.body).then((response) => {

    if (response.status) {
      req.session.admin_login = true
      console.log("login success");
      res.redirect('/admin/admin_home')
    }
    else {
      req.session.loginErr = true
      console.log("admin login failed");
      res.redirect('/admin')
    }
  })
})
router.get('/admin_login', (req, res) => {
  req.session.admin_login = false
  res.redirect('/admin')

})

router.get('/admin_home', VerifyAdmin, (req, res) => {
  dashboard_controller.alldatas().then((response) => {
    res.render('admin/admin_home', { layout: "admin_layout", admin: true, response })
  })
})
router.get('/getdash', (req, res) => {
  dashboard_controller.stati().then((status) => {
    res.json({ status })

  }).catch((err) => {
    next(err)
  })

})

//........................Edit   user..............................//


router.get('/edit_users', VerifyAdmin, (req, res) => {

  User.find().lean().exec((error, data) => {
    res.render('admin/edit_users', { layout: "admin_layout", admin: true, user: data })
  })


  //...............user block..........//
  router.get('/block-user/:id',VerifyAdmin, (req, res) => {
    let id = req.params.id
    console.log("working");
    admin_controller.block_user(id).then((response) => {
      console.log(response);
      res.redirect('/admin/edit_users')
    })
  })
  //.............active user.............//

  router.get('/active-user/:id',VerifyAdmin, (req, res) => {
    let id = req.params.id
    console.log("active-working");
    admin_controller.active_user(id).then((response) => {
      console.log(response);
      res.redirect('/admin/edit_users')
    })
  })
})
//............................................................//




//.........................Admin user signup.................//


router.get('/add_user',VerifyAdmin, function (req, res, next) {
  res.render('admin/add_user')

})
router.post('/add_user', async (req, res) => {

  try {
    const newUser = await new User(req.body)
    console.log('hai');
    console.log(newUser);
    newUser.save()

    res.redirect('/admin/edit_users')
  }
  catch (error) {
    console.log(error);
  }
})


//..................Add admin..................//

router.get('/add_admin',VerifyAdmin, function (req, res, next) {
  res.render('admin/add_admin')

})
router.post('/add_admin', async (req, res) => {

  try {
    const newUser = await new Admin(req.body)
    console.log('hai');
    console.log(newUser);
    newUser.save()

    res.redirect('/admin/edit_users')
  }
  catch (error) {
    console.log(error);
  }
})
//.............................................................//



//.....................Category Management.....................//


router.get('/view_category',VerifyAdmin, (req, res) => {
  if (req.session.admin_login) {
    category_Controller.getcategory().then((response) => {
      res.render('admin/view_category', { layout: "admin_layout", response, admin: true })
    })
  } else {
    res.redirect('/admin')
  }
})

router.get('/add_category',VerifyAdmin, (req, res) => {

  res.render('admin/add_category', { layout: 'admin_layout', admin: true, })
})

router.post('/addcategory', async (req, res) => {
  console.log(req.body);
  category_Controller.addcategoryDate(req.body).then((response) => {
    console.log(response);
    if (response.exist) {
      req.session.categoryexist = true
      console.log(req.session.categoryexist);
      req.session.category = res.category;

      res.redirect('/admin/add_category',)
    } else {
      req.session.category = response.category
      console.log(req.session.category);
      console.log(response);
      res.redirect('/admin/view_category')
    }
  }).catch((error) => {
    console.log("error found", error);
  })
})
//..............Delete category...................//

router.get('/delete-category/:_id',VerifyAdmin, (req, res) => {
  const categoryid = req.params._id;

  category_Controller.deletecategory(categoryid).then((data) => {
    res.redirect('/admin/view_category')
  })
})

//..............update category...................//

router.get('/update-category/:_id',VerifyAdmin, (req, res) => {

  const categoryid = req.params._id;
  category_Controller.getcategorydata(categoryid).then((categorydata) => {
    console.log(categorydata);
    res.render('admin/update_category', { layout: 'admin_layout', admin: true, categorydata })
  })
})
router.post('/update-category/:_id', (req, res) => {

  const categoryid = req.params._id;
  category_Controller.updatecategory(categoryid, req.body).then((response) => {
    console.log(response);
    res.redirect('/admin/view_category')
  })
})



//...............................Product Management..............//
// router.get('/product-management', (req, res) => {
//   res.render('admin/product_management', { layout: "admin_layout", admin: true })
// })

router.get('/product-management',VerifyAdmin, (req, res) => {

  if (req.session.admin_login) {
    //  console.log("raaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    product_controller.getPoductdetails().then((productdetails) => {
      //  console.log("vaaaaaaaaaaaaaaaaaaaaaaa");
      console.log(productdetails, 'lllllllllllllllllll');

      res.render('admin/product_management', { productdetails, layout: "admin_layout", admin: true })
    })
  } else {
    res.redirect('/admin')
  }
})




//...............delete product................//
router.get('/delete-product/:_id',VerifyAdmin, (req, res) => {
  let productID = req.params._id
  product_controller.deleteproducts(productID).then((response) => {
    res.redirect('/admin/product-management')

  })
})

//..............edit product...................//
router.get('/update-product/:_id',VerifyAdmin, (req, res) => {
  let productID = req.params._id
  product_controller.getPoductvalue(productID).then((productdata) => {
    category_Controller.getcategory(productID).then((category) => {

      console.log("areeewaaaaaaaaaaaaaaaaaaa");
      console.log(productdata);

      res.render('admin/update_product', { productdata, category, layout: "admin_layout", admin: true })
    })
  })
})


router.post('/updateproduct/:_id',VerifyAdmin, upload.array("image", 5), (req, res) => {
  const images = req.files
  let array = [];
  array = images.map((value) => value.filename)
  req.body.image = array
  let productid = req.params._id

  console.log(productid);

  product_controller.updateProduct(productid, req.body).then((productdata) => {
    console.log('prooooooo');
    console.log(productdata);

    res.redirect('/admin/product-management')

  })

})

//........image adding....................//

router.post('/addproducts',VerifyAdmin, upload.array("image", 5), (req, res) => {
  const images = req.files
  array = images.map((value) => value.filename)
  req.body.image = array
  product_controller.addproduct(req.body).then((response) => {

    res.redirect('/admin/product-management');
  }).catch((err) => {
    console.log("error found", err);
  })
});



//.......get......Add Product.................//

router.get('/add-products',VerifyAdmin, (req, res) => {

  const productexist = req.session.productexist
  req.session.productexist = null
  category_Controller.getcategory().then((category) => {

    res.render('admin/add_products', { category, layout: "admin_layout", admin: true })
  })
})

//...........Post....Add Product.................//
router.post('/addproducts',VerifyAdmin, upload.array("image", 5), (req, res) => {
  console.log(req.body.categoryname, 'fghfghjghjgjh');
  const images = req.files
  let array = [];
  array = images.map((value) => value.filename)
  req.body.image = array
  product_controller.addproduct(req.body).then((response) => {
    console.log(req.body);

    if (response.exist) {
      req.session.productexist = true
      req.session.product = response.product

      res.redirect('/admin/add_products')
    } else {
      req.session.product = response.product

      res.redirect('/admin/product-management')
    }
  }).catch((err) => {
    console.log('error found', err);
  })
})

// ..............................B A N N E R .......................................


router.get('/banner', VerifyAdmin, (req, res) => {

  banner_controller.getbannerdata().then((bannerDetails) => {
    console.log(bannerDetails, '.....................bannerDetails')
    res.render('admin/banner', { layout: "admin_layout", admin: true, bannerDetails })
  })

})


router.post('/addbanner', upload1.array('image', 3), (req, res) => {
  const images = req.files
  console.log(images, 'post banner success')

  array = images.map((value) => value.filename)
  //console.log(array,'------arrrrraaaaaaayyyyyyy');
  req.body.image = array
  banner_controller.addbanner(req.body).then((response) => {
    // console.log(response,'----------------banner aded')
    res.redirect('/admin/banner')
  })
})


router.post('/editbanner/:id', VerifyAdmin, upload1.array('image', 1), (req, res) => {
  const images = req.files
  let array = images.map((value) => value.filename)
  req.body.image = array
  let bannerid = req.params.id
  banner_controller.updatebanner(bannerid, req.body).then((response) => {
    res.redirect('/admin/banner')
  })
})






router.get('/deletebanner/:_id', VerifyAdmin, (req, res) => {
  let bannerid = req.params._id
  banner_controller.deletebanner(bannerid).then((response) => {
    res.redirect('/admin/banner')
  })
})
// .all......................Banner......end.................................


// .all..............................Coupon............................................

router.get('/coupon', VerifyAdmin, (req, res) => {
  coupon_controller.getcoupon().then((coupons) => {

    res.render('admin/coupon', { layout: "admin_layout", admin: true, coupons })
  })

})
router.post('/addcoupon', VerifyAdmin, (req, res) => {

  coupon_controller.addcoupon(req.body).then((coupons) => {
    res.redirect('/admin/coupon')
  })
})
router.post('/editCoupon/:_id', VerifyAdmin, (req, res) => {
  let couponid = req.params._id
  console.log(req.body, '....555.......newcoupon')
  coupon_controller.updatecoupon(couponid, req.body).then((newcoupon) => {
    console.log(newcoupon, '...........newcoupon')
    res.redirect('/admin/coupon')
  })
})
router.get('/removeCoupon/:_id', VerifyAdmin, (req, res) => {
  let couponid = req.params._id
  coupon_controller.deletecoupon(couponid).then((coupon) => {
    res.redirect('/admin/coupon')
  })
})




router.get('/orders', VerifyAdmin, (req, res) => {
  order_controller.allOrders().then((orders) => {
    //console.log(orders,'-------------admin orders')
    res.render('admin/orders', { layout: "admin_layout", admin: true, orders })
  })
})
router.post('/ShipOrder/:_id', VerifyAdmin, (req, res) => {

  console.log(req.params._id, '------------order id  ship')
  order_controller.shipOrder(req.params._id).then((response) => {
    res.json(response)
  })
})
router.post('/Delivered/:_id', VerifyAdmin, (req, res) => {
  order_controller.deliveryOrder(req.params._id).then((response) => {
    res.json(response)
  })
})
router.post('/cancelorder/:_id',VerifyAdmin, (req, res) => {
  order_controller.cancelOrder(req.params._id).then((response) => {
    res.json(response)
  })
})




router.get('/charts', VerifyAdmin, (req, res) => {
  dashboard_controller.alldatas().then((response) => {
    res.render('admin/charts', { layout: "admin_layout", admin: true,response })
  })
})
//.....................................................................................

module.exports = router;
