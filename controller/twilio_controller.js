const userModel = require('../model/user_model')

let config = {
    serviceId: process.env.serviceId,
    accountSID: process.env.accountSID,
    authToken: process.env.authToken
};

const client = require('twilio')(config.accountSID, config.authToken);

module.exports = {
    getOtp: (number) => {
        console.log(number, '-------------number1111111')
        return new Promise(async (resolve, reject) => {
            //let user = await userModel.findOne({ mobile: number });
            //console.log(user, '-------------number')
            let response = {}

            // if (user) {
            // response.exist = true;
            //  if (!user.ActiveStatus) {
            client.verify.v2.services(config.serviceId).verifications.create({
                to: '+91' + number,
                channel: "sms"
            })
                .then((data) => {
                    console.log("response");
                    response.data = data;
                    //response.user = user;
                   // response.email = user.email = user.email,
                        response.ActiveStatus = true;
                    resolve(response)
                }).catch((err) => {
                    console.log("ERROR FOUND AT VERIFICATIION"),

                        reject(err)
                })
            //     } else {
            //         response.userBlocker = true;
            //         resolve(response)
            //     }
            // } else {
            //     response.exist = false,
            //         resolve(response)
            
            // }

        })


    },


    checkOut: (otpcode, data) => {
        console.log(otpcode.otp, '-------otp number');
        console.log(data.mobile, '----------mobile number');
        return new Promise((resolve, reject) => {
            client.verify.v2.services(config.serviceId).verificationChecks.create({
                to: '+91' + data.mobile,
                code: otpcode.otp
            }).then((verification_check) => {
                console.log(verification_check.status,"---------verification success in Twilio chechout");
                resolve(verification_check.status)
            }).catch((err) => {
                console.log("error", err);
            })
        });
    }
}