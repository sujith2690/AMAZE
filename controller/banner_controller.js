const bannermodel = require("../model/banner_model");
const multer = require('multer')

module.exports = {

    addbanner: (bannerdata) => {

        console.log("tttttttttttttttt");
        console.log(bannerdata);
        return new Promise((resolve, reject) => {
            const banner = new bannermodel({

                bannerheading: bannerdata.bannerheading,
                bannersubheading: bannerdata.bannersubheading,
                image: bannerdata.image,
                description: bannerdata.description,

            })
            console.log("gfhjkl")
            console.log(banner);

            banner.save().then((banners) => {
                console.log(banners);
                resolve(banners)
            })

        })

    },


    getbannerdata: () => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let banner = await bannermodel.find({}).lean()
            response.status
            response = banner
            resolve(response)

        })
    },


    // getbannervalue:(bannerID)=>{
    //     return new Promise(async(resolve,reject)=>{
    //       let response={}
    //       let banner = await bannermodel.findOne({_id:bannerID}).lean()
    //       response.status
    //       response = banner
    //       resolve(response)

    //     })
    //   },

    deletebanner: (bannerID) => {
        return new Promise(async (resolve, reject) => {
            bannermodel.findByIdAndDelete({ _id: bannerID }).then((response) => {
                resolve(response)
            })

        })
    },


    // updatebanner: (bannerID, bannerdetails) => {
    //     console.log(bannerID, "---------varunneee");
    //     console.log(bannerdetails, '------------bannerdetails');
    //     return new Promise(async (resolve, reject) => {
    //         bannermodel.findByIdAndUpdate(bannerID, {
    //             bannername: bannerdetails.bannername,
    //             image: bannerdetails.image, description: bannerdetails.description
    //         }).then((response) => {
    //             console.log("ghjsdfgklk");
    //             console.log(response);
    //             resolve(response)
    //         })
    //     })
    // },
    updatebanner: (bannerID, bannerdetails) => {
        console.log(bannerID);
        console.log("varunneee");
        console.log(bannerdetails, '..............bannerdetails@updatebanner');
        return new Promise(async (resolve, reject) => {
            bannermodel.findByIdAndUpdate(bannerID, {
                bannerheading: bannerdetails.bannerheading,
                image: bannerdetails.image, description: bannerdetails.description, bannersubheading: bannerdetails.bannersubheading
            }).then((response) => {
                console.log(response, '............oioioooiooooiopp............');
                resolve(response)
            })
        })
    }







}