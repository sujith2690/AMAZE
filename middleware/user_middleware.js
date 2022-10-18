const userModel = require('../model/user_model');
const usercontroller = require('../controller/user_controller')

module.exports = {
    isblocked: (req, res, next) => {
        if (req.session.user) {
            new Promise(async (resolve, reject) => {
                console.log(req.session.email, 'email');
                let user = await userModel.findOne({ email: req.session.email })
                resolve(user)
            }).then((user) => {
                if (user) {
                    if (user.status) {
                        req.session.isblocked = user.status
                        res.render('user/user_login', { blocked: req.session.isblocked })
                        req.session.destroy()
                    }
                    else {
                        next()
                    }
                } else {
                    next()
                }
            })
        } else {
            next()
        }
    }
}