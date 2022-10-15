const adminModel = require('../model/admin_model')
const bcrypt = require('bcrypt')
const userModel = require('../model/user_model')



module.exports = {

    adminlogin: (logindata) => {

        return new Promise(async (resolve, reject) => {

            let response = {
                status: false,
                usernotfound: false
            }
            let user = await adminModel.findOne({ email: logindata.email })
            console.log('admin email');
            console.log(user);

            if (user) {
                bcrypt.compare(logindata.password, user.password, (err, valid) => {
                    console.log('password');
                    if (valid) {
                        response.status = true
                        response.user = user
                        response.email = user.email
                        console.log(response.email);
                        resolve(response)
                        console.log('success');

                    } else {
                        resolve(response)
                        console.log(('error while bcrypting', err));
                    }
                })
            } else {
                response.usernotfound = true
                console.log('failed');
                resolve(response)
            }

        })
    },


//...................... Block User........................//



    block_user: (id) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findById({ _id: Object(id) })
            user.status = true

            // const block = user.status
            
            await userModel.updateOne({ _id: Object(id) }, user)
            resolve('got it')
            
        })

    },

    active_user: (id) => {
        return new Promise(async (resolve, reject) => {
            let user = await userModel.findById({ _id: Object(id) })
            user.status = false
            await userModel.updateOne({ _id: Object(id) }, user)
            resolve('its done')

        })

    }

}




