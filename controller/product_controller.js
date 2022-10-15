const productmodel = require("../model/product_model")
const multer = require('multer')
const upload = multer({ dest: "public/productimages" });
const { router } = require("../app")


module.exports = {

    addproduct: (productData) => {
        let today = new Date()
        let newdate = today.toISOString()
        newdate = newdate.slice(0, 10);
        console.log(newdate, '-------------0000000000000000000')
        console.log(productData);
        console.log("sghghgdf");
        return new Promise((resolve, reject) => {
            products = new productmodel({

                brand: productData.brand,
                productname: productData.productname,
                mrp: productData.mrp,
                offerprice: productData.offerprice,
                categoryname: productData.categoryname,
                stock: productData.stock,
                image: productData.image,
                percentage: 100 - parseInt((parseInt(productData.offerprice) / parseInt(productData.mrp)) * 100),
                date: newdate,
            })
            console.log("jjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
            console.log(productData.categoryname);
            products.save().then((data) => {
                console.log("lalaaa");
                resolve(data)
            })
        })

    },
    deleteproducts(productID) {

        return new Promise(async (resolve, reject) => {
            productmodel.findByIdAndDelete({ _id: productID }).then((response) => {
                resolve(response)
                resolve(response)
                console.log(response, 'deletedddddddddddddddddd');
            })
        })

    },

    getlatestProductDetails: () => {

        return new Promise(async (resolve, reject) => {
            let response = {}
            let product = await productmodel.find().sort({ createdAt: -1 }).limit(4).lean()
            console.log(product, '-------------0000000000000000');
            response = product
            resolve(response)
        })

    },
    getPoductdetails: (productID) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let product = await productmodel.find().populate("categoryname").sort({ createdAt: -1 }).lean()
            console.log(product, 'kjjjjj');
            response.status;
            response = product;
            resolve(response)
        })
    },
    getByCategory: (categoryID) => {
        return new Promise(async (resolve, reject) => {
            try {
                let products = await productmodel.find({ categoryname: categoryID }).lean();
                resolve(products)
            } catch (error) {
                reject(error)
            }
        })
    },
    getPoductvalue: (productID) => {
        return new Promise(async (resolve, reject) => {

            try {
                let response = {}
                let product = await productmodel.findOne({ _id: productID }).lean()
                response.status;
                response.data = product;
                console.log(response, 'gggggeeetttttttttttttpdt va');
                resolve(response)
            } catch (error) {
                reject(error)
            }


        })
    },

    updateProduct: (productID, productDetails) => {

        let today = new Date()
        let newdate = today.toISOString()
        newdate = newdate.slice(0, 10);
        console.log(newdate, '-------------0000000000000000000')
        return new Promise(async (resolve, reject) => {

            console.log("huuuuuuuuuuuuuuuuuuuuu");
            console.log(productID);
            console.log(productDetails);
            productmodel.findByIdAndUpdate(productID, {

                brand: productDetails.brand,
                productname: productDetails.productname,
                mrp: productDetails.price,
                offerprice: productDetails.offerprice,
                categoryname: productDetails.categoryname,
                stock: productDetails.stock,
                image: productDetails.image,
                date: newdate,

            }).then((response) => {
                resolve(response)
            })
        })

    },
    productlist: (productID) => {
        return new promise(async (resolve, reject) => {
            let response = {}
            let listproduct = await productmodel.find({}).lean()
            response.status;
            response = listproduct,
                resolve(response)
        })
    },


}
