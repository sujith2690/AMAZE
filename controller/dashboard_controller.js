
const user_model = require('../model/user_model')
const order_model = require('../model/order_model')
const product_model = require('../model/product_model')
module.exports = {



  alldatas: () => {
    return new Promise(async (resolve, reject) => {
      let response = {}

      await user_model.find().lean().then(async (users) => {

        let UserCount = users.length
        console.log(UserCount, '------------------88888888888')
        response.UserCount = UserCount

        await order_model.find({}).lean().then(async (orders) => {
          let OrderCount = orders.length
          response.OrderCount = OrderCount

          let TotalRevenue = orders.reduce((accumulator, object) => {
            return accumulator + object.grandtotalamount
          }, 0)

          response.totalRevenue = TotalRevenue

          console.log(orders, '--------------totalRevenue 00000000000000')

          let today = new Date()
          let newdate = today.toISOString()
          newdate = newdate.slice(0, 10);
          await order_model.find({ date: newdate }).populate('orderitems').lean().then(async (today) => {

            let TodayRevenue = today.reduce((accumulator, object) => {
              return accumulator + object.grandtotalamount
            }, 0)
            response.TodayRevenue = TodayRevenue
            console.log(TodayRevenue, '----------2222222222222TodayRevenue')

            await order_model.find({ paymentMethod: "COD" }).lean().then(async (COD) => {
              let CodCount = COD.length
              response.CodCount = CodCount
              console.log(CodCount, '----------------1111111111')
              await order_model.find({ paymentMethod: "onlinepayment" }).lean().then(async (Online) => {
                let OnlineCount = Online.length
                response.OnlineCount = OnlineCount
                await order_model.find({ productStatus: "Cancelled" }).lean().then(async (cancelled) => {
                  let CancelledCount = cancelled.length
                  response.CancelledCount = CancelledCount
                  await order_model.find({ productStatus: "Shipped" }).lean().then(async (Shipped) => {
                    let ShippedCount = Shipped.length
                    response.ShippedCount = ShippedCount
                    await order_model.find({ productStatus: "Pending" }).lean().then(async (Pending) => {
                      let PendingCount = Pending.length
                      response.PendingCount = PendingCount
                      await order_model.find({ productStatus: "Delivered" }).lean().then(async (Delivered) => {
                        let DeliveredCount = Delivered.length
                        response.DeliveredCount = DeliveredCount


                        await product_model.find().lean().then(async (products) => {
                          let ProductCount = products.length
                          response.ProductCount = ProductCount

                          resolve(response)
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  },


  stati: () => {
    return new Promise(async (resovle, reject) => {
      try {

        let dateArray = []
        for (let i = 0; i < 5; i++) {
          let d = new Date();
          d.setDate(d.getDate() - i)
          let newdate = d.toISOString()
          // console.log(new Date());
          newdate = newdate.slice(0, 10)
          dateArray[i] = newdate
        }
        console.log(dateArray, newdate, 'jkjhkjhkjhkjh');
        

        let dateSale = []

        for (i = 0; i < 5; i++) {
          // dateSale[i] = await ordermodel.find({newdate:dateArray[i]}).lean().count()
          dateSale[i] = await order_model.find({ date: dateArray[i] }).lean().count()
          console.log(dateSale[i], "dateeeeeee");
        }
        let status = {
          dateSale: dateSale,
          dateArray: dateArray
        }
        resovle(status)
      } catch (error) {
        console.log("error", error);
      }
    })
  },






  gettotalnetbanking: () => {
    return new Promise(async (resolve, reject) => {
      // let cod = await Helpers.getOrders()
      let netbanking = await ordermodel.find({ paymentdetails: 'netbanking' }, { _id: 0, paymentdetails: 1 })
      console.log(netbanking, "codddddddddd");
      count = 0
      count = netbanking.length
      console.log(netbanking, "jjjjjjjjjjjj");
      resolve(count)

    })
  },
  gettotalcod: () => {
    return new Promise(async (resolve, reject) => {
      // let cod = await Helpers.getOrders()
      let cod = await ordermodel.find({ paymentdetails: 'COD' }, { _id: 0, paymentdetails: 1 })
      console.log(cod, "codddddddddd");
      count = 0
      count = cod.length
      console.log(cod, "jjjjjjjjjjjj");
      resolve(count)

    })
  },
  getsucessdelivey: () => {
    return new Promise(async (resolve, reject) => {
      // let cod = await Helpers.getOrders()
      let delivery = await ordermodel.find({ deliveystatus: 'success' }, { _id: 0, deliveystatus: 1 })
      console.log(delivery, "codddddddddd");
      count = 0
      count = delivery.length
      console.log(delivery, "jjjjjjjjjjjj");
      resolve(count)

    })
  },
  getpendingdelivey: () => {
    return new Promise(async (resolve, reject) => {
      // let cod = await Helpers.getOrders()
      let pending = await ordermodel.find({ deliveystatus: 'pending' }, { _id: 0, deliveystatus: 1 })
      console.log(pending, "codddddddddd");
      count = 0
      count = pending.length
      console.log(pending, "jjjjjjjjjjjj");
      resolve(count)

    })
  },
  gettotalincome: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let wholeincome = await ordermodel.find().lean()
        console.log(wholeincome, "wholeincome");
        let a = 0;
        let b = 0;
        let totalamount = 0;
        let grandtotal = 0;
        for (let i = 0; i < wholeincome.length; i++) {
          if (wholeincome[i].grandtotal == null) {
            for (let x = a; x <= a; x++) {
              totalamount = totalamount + wholeincome[i].totalprice;
            }
          } else {
            for (let y = b; y <= b; y++) {
              grandtotal = grandtotal + wholeincome[i].grandtotal;
            }

          }
        }
        console.log(totalamount, grandtotal, 'both are given below');
        totalincome = totalamount + grandtotal;
        console.log(totalincome, 'thsi is  total income....');
        resolve(totalincome)

      } catch (err) {
        reject(err, "error founded")
      }
    })
  },

  gettotalincome: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let wholeincome = await ordermodel.find().lean()
        console.log(wholeincome, "wholeincome");
        let a = 0;
        let b = 0;
        let totalamount = 0;
        let grandtotal = 0;
        console.log(wholeincome.length, 'is the wolelenght');
        for (let i = 0; i < wholeincome.length; i++) {
          if (wholeincome[i].grandtotal == null) {
            for (let x = a; x <= a; x++) {
              totalamount = totalamount + wholeincome[i].totalprice;
            }
          } else {
            for (let y = b; y <= b; y++) {
              grandtotal = grandtotal + wholeincome[i].grandtotal;
            }

          }
        }
        console.log(totalamount, grandtotal, 'both are given below');
        totalincome = totalamount + grandtotal;
        console.log(totalincome, 'thsi is  total income....');
        resolve(totalincome)

      } catch (err) {
        reject(err, "error founded")
      }
    })
  },

  todayIncome: () => {
    return new Promise(async (resolve, reject) => {
      try {
        let today = new Date().toISOString();
        let day = today.slice(0, 10);
        console.log(day, 'is today');
        let wholeincome = await ordermodel.find({ newdate: day }).lean()
        console.log(wholeincome, "wholeincome");
        let a = 0;
        let b = 0;
        let totalamount = 0;
        let grandtotal = 0;
        console.log(wholeincome.length, 'is the length of the array');
        for (let i = 0; i < wholeincome.length; i++) {
          if (wholeincome[i].grandtotal == null) {
            for (let x = a; x <= a; x++) {
              totalamount = totalamount + wholeincome[i].totalprice;
              console.log(totalamount, 'is totalamount tody');
            }
          } else {
            for (let y = b; y <= b; y++) {
              grandtotal = grandtotal + wholeincome[i].grandtotal;
              console.log(grandtotal, 'is grandtotal toady');
            }

          }
        }
        console.log(totalamount, grandtotal, 'both are given below');
        totalincome = totalamount + grandtotal;
        console.log(totalincome, 'thsi is  total income....');
        resolve(totalincome)
        console.console.log("day by day income", totalincome);

      } catch (err) {
        reject(err, "error founded")
      }
    })
  },

  cancellorders: () => {
    return new Promise(async (resolve, reject) => {

      let cancelled = await ordermodel.find({ productstatus: 'Cancelled' }, { _id: 0, productstatus: 1 })
      let count = 0
      count = cancelled.length
      resolve(count)
    })
  },
  deliveredorders: () => {
    return new Promise(async (resolve, reject) => {

      let delivered = await ordermodel.find({ productstatus: 'delivered' }, { _id: 0, productstatus: 1 })
      let count = 0
      count = delivered.length
      resolve(count)
    })
  },
  pendingorders: () => {
    return new Promise(async (resolve, reject) => {

      let pending = await ordermodel.find({ productstatus: 'pending' }, { _id: 0, productstatus: 1 })
      let count = 0
      count = pending.length
      resolve(count)
    })
  },

  shippedorders: () => {
    return new Promise(async (resolve, reject) => {
      let shipped = await ordermodel.find({ productstatus: 'shipped' }, { _id: 0, productstatus: 1 })
      let count = 0
      count = shipped.length
      console.log(count, "shippped")
      resolve(count)
    })
  },


}




