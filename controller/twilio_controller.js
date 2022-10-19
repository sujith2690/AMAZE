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

            let response = {}
            client.verify.v2.services(config.serviceId).verifications.create({
                to: '+91' + number,
                channel: "sms"
            }).then((data) => {
                console.log("response");
                response.data = data;

                response.ActiveStatus = true;
                resolve(response)
            }).catch((err) => {
                console.log("ERROR FOUND AT VERIFICATIION"),

                    reject(err)
            })


        })


    },


    checkOut: (otpcode, data) => {
        console.log(otpcode, '-------otp number');
        console.log(data.mobile, '----------mobile number');
        return new Promise((resolve, reject) => {
            client.verify.v2.services(config.serviceId).verificationChecks.create({
                to: '+91' + data.mobile,
                code: otpcode.otp
            }).then((verification_check) => {
                console.log(verification_check.status, "---------verification success in Twilio chechout");
                resolve(verification_check.status)
            }).catch((err) => {
                console.log("error", err);
            })
        });
    }
}