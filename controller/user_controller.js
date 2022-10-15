const userModel = require('../model/user_model')
  
const bcrypt = require('bcrypt')



module.exports = {

  userlogin: (logindata) => {

    return new Promise(async (resolve, reject) => {

      let response = {
        status: false,
        usernotfound: false
      }
      let user = await userModel.findOne({ email: logindata.email })
     // console.log('email');


      if (user) {
        bcrypt.compare(logindata.password, user.password, (err, valid) => {
          //console.log('password');
          if (valid) {
            response.status = true
            response.user = user
            response.email = user.email
            //console.log(response.email);
            resolve(response)
           // console.log('success');

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
  updateUser: (UserID, userDetails) => {
    
    return new Promise(async (resolve, reject) => {
      try {
        // console.log("huuuuuuuuuuuuuuuuuuuuu");
        console.log(UserID);
        console.log(userDetails, 'given user details');
        await userModel.findOneAndUpdate({ _id: UserID }, {

          name: userDetails.name,
          lastname: userDetails.lastname,
          mobile: userDetails.mobile,
          email: userDetails.email

        }).then((response) => {
          console.log(response, 'new user details');
          resolve(response)
        })
      } catch (error) {
        console.log(error, 'errorrrrrr');
        reject(error)

      }


    })

  },
  getUserdetails: (userID) => {

   // console.log("fccccccccccccccd",userID);
    return new Promise(async (resolve, reject) => {
      let response = {}
      let User = await userModel.findOne({_id:userID}).lean()
       // console.log(User,'kjjjjj');
      response.status;
      response.data = User;
      resolve(response)
    })
  },
  updateuserverify: (phone)=>{
    return new Promise (async(resolve,reject)=>{
        let response={status:true}
   await userModel.findOneAndUpdate({phonenumber:phone},{verified:true}).then(()=>{
    response.status=true; 
    resolve(response)
   })
  
    })
   },
  

}