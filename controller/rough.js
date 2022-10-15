// applyCoupen: (userID, coupendata) => {
//   console.log(userID, "useriddddddd");
//   console.log("coupendataaaaaaa", coupendata);
//   return new Promise(async (resolve, reject) => {
//     try {
//       let response = {};

//       response.discount = 0;
//       let coupen = await coupenmodel.findOne({
//         CoupenCode: coupendata.code,
//       })


//       console.log(coupen, "coupenood");
//       Helpers.getTotalAmout(userID).then(async (totalamount) => {
//         console.log("totalamount", totalamount);

//         if (coupen) {
//           response.coupen = coupen;
//           let coupenuser = await coupenmodel.findOne({
//             CoupenCode: coupendata.code,
//             userId: { $in: [userID] },
//           });
//           if (coupen.Coupenlimit <= totalamount) {
//             console.log(coupen.Coupenlimit, "coupenlimit");
//             response.Status = true;

//             if (coupenuser) {
//               response.Status = false;
//               resolve(response);
//             } else {
//               response.Status = true;
//               response.coupen = response;
//               Helpers.addproductdetails(userID).then((cartprod) => {
//                 Helpers.getTotaldiscount(userID).then((totaldiscount) => {
//                   console.log(cartprod.cart, "productiddddd");
//                   cart = cartprod.cart;

//                   let grandtotal;

//                   if (cart) {
//                     let cartlength = cart.Cartdata.length;
//                     if (cartlength >= 0) {
//                       grandtotal = cart.Cartdata.reduce((acc, curr) => {
//                         acc += curr.productId.price * curr.quantity;
//                         return acc;
//                       }, 0);

//                       if (coupen.Discountprice <= coupen.Coupenlimit) {
//                         coupen.Discountprice = coupen.Discountprice;
//                       } else {
//                         coupen.Discountprice = coupen.Coupenlimit;
//                       }

//                       grandtotal = grandtotal - coupen.Discountprice;

//                       response.grandtotal = grandtotal;
//                       response.coupen = coupen;
//                       resolve(response);
//                       console.log(response, "vanditta response");
//                     } else {
//                       resolve(response);
//                     }
//                   } else {
//                     resolve(response);
//                   }
//                 });
//               });
//             }
//           } else {
//             response.Status = false;
//             resolve(response);
//             console.log(response, "hearelast response");
//           }
//         } else {
//           response.Status = false;
//           resolve(response);
//         }
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// },


//   applyCoupon: (userID, coupendata) => {
//     //console.log(userID, "------------------useriddddddd");
//     console.log(coupendata.code, "------------coupendataaaaaaa");
//     return new Promise(async (resolve, reject) => {
//       try {
//         let response = {};
//         // let number = coupendata.code
//         //console.log(number,'-----number');

//         let coupen = await couponModal.findOne({
//           Couponcode: coupendata.code,
//         })
//         console.log(coupen, "----------coupenood");
//         cart_controller.totalAmount(userID).then(async (totalamount) => {
//           console.log(totalamount.grandtotalprice, "---------totalamount");
//           let total = totalamount.grandtotalprice
//           if (coupen) {
//             console.log(total, '--------kkkkkkkkkk')
//             response.coupen = coupen;
//             let coupenuser = await couponModal.findOne({
//               Couponcode: coupendata.code,
//               userId: { $in: [userID] },
//             });
//             if (coupen.Discountpricelimit <= total) {
//               // console.log(coupen, '--------ttttttttttttt')
//               console.log(coupen.Discountpricelimit, "coupenlimit");
//               let coupon_limit = coupen.Discountpricelimit
//               response.Status = true;
//               if (coupenuser) {
//                 console.log(coupenuser, '----------coupenuser')
//                 response.Status = false;
//                 resolve(response);
//               }else{
//                 response.Coupon_Discount = coupon_limit;
//                 let Coupon_grandtotal = total - coupon_limit
//                 console.log(Coupon_grandtotal, '----------Coupon_grandtotal')
//                 response.Coupon_grandtotal = Coupon_grandtotal
  
//                 console.log(response, '-----------final response')
//                 resolve(response);
//               }
              

//               // else {
//               // response.Status = true;
//               // response.coupen = response;
//               // Helpers.addproductdetails(userID).then((cartprod) => {
//               //   Helpers.getTotaldiscount(userID).then((totaldiscount) => {
//               //     console.log(cartprod.cart, "productiddddd");
//               //     cart = cartprod.cart;
//               //  });
//               // });
//               // }

//             } else {
//               response.Status = false;
//               resolve(response);
//               console.log(response, "hearelast response");
//             }
//           } else {
//             response.Status = false;
//             resolve(response);
//           }
//         });
//       } catch (error) {
//         reject(error);
//       }
//     });
//   },