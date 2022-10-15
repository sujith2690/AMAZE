

console.log('hello:--------- this is custom js from /public/js/custom.js')
async function addtoWishlist(proId) {
    console.log(proId, 'lllllllllllllllllllllll')
    await axios.get(`/add_to_wishlist/${proId}`, {}).then((e) => {
        swal({
            title: "Item Add to Wishlist!",
            icon: "success",
            buttons: false,
            timer: 1000,
            width: '25em'
        });
        console.log("else of script wishlist")
        setTimeout(() => {
            //location.reload()
            $("#wish").load(location.href + " #wish>*", "")
            //$("#wish").load(location.href + "#wish")
        }, 60)
    })
}
async function addtoCart(proId) {
    console.log(proId, '------------cart axios l')
    await axios.get(`/add_to_cart/${proId}`, {}).then((e) => {
        swal({
            title: "Item Add to Cart!",
            icon: "success",
            buttons: false,
            timer: 1000,
            width: '25em'
        });
        console.log("else of script cart")
        setTimeout(() => {
            //location.reload()
            $("#cart").load(location.href + " #cart>*", "")
            //$("#wish").load(location.href + "#wish")
        }, 60)
    })
}


//...................      ///// ....C A R T....     ....... ///....................//

async function decQty(proId) {
    console.log(proId, '------------cart axios l')
    await axios.post(`/decQty/${proId}`, {}).then((e) => {

        if (e.data.status) {
            document.getElementById(proId).value = e.data.qty
        }
        console.log("else of script cart")

        //location.reload()
        $("#quantity").load(location.href + " #quantity>*", "")
        //$("#wish").load(location.href + "#wish")

    })
}

async function incQty(proId) {
    console.log(proId, '------------cart axios l')
    await axios.post(`/incQty/${proId}`, {}).then((e) => {
        if (e.data.status) {
            document.getElementById(proId).value = e.data.qty
        }
        console.log("else of script cart")

        //location.reload()
        $("#quantity").load(location.href + " #quantity>*", "")
        //$("#wish").load(location.href + "#wish")

    })
}




// const decQty = (id) => {
//     console.log(id, 'oooooooooooooooooooo')
//     const res = axios.post(`/decQty/` + id).then((e) => {
//         window.location.reload()
//         if (e.data.status) {
//             document.getElementById(id).value = e.data.qty
//         }
//         window.location.reload()


//     })
// }
// const incQty = (id) => {
//     const res = axios.post('/incQty/' + id).then((e) => {
//         if (e.data.qty > 1) {
//             if (e.data.status) {
//                 document.getElementById(id).value = e.data.qty
//             }
//             location.reload()
//         }
//         if (e.data.qty == 2) {
//             if (e.data.status) {
//                 document.getElementById(id).value = e.data.qty
//             }
//             window.location.reload()
//         }

//     })
// }


function remove(ev, id) {
    ev.preventDefault();
    var url = ev.currentTarget.getAttribute('href')
    swal({
        title: "Are you sure?",
        text: "You Want to remove this item!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {

            if (willDelete) {

                swal({
                    title: "Item Has been removed...!",
                    icon: "success",
                    buttons: false,
                    timer: 1000,
                    width: '25em'
                });
                window.location.href = url;
                setTimeout(() => {
                    $("#quantity").load(location.href + " #quantity>*", "")
                }, 1000)

            } else {
                
                swal({
                    title: "Your file is safe!",
                    buttons: false,
                    timer: 1000,
                    width: '25em'
                });

            }
        });
}


const count = async () => {

    try {
        const res = await axios.get('/cart_count', {}).then((e) => {
            document.getElementById('cart-count').innerHTML = e.data.items
        })
    } catch (error) {
        console.log(error)
    }
    try {
        const res = await axios.get('/wish_count', {}).then((e) => {
            document.getElementById('wish-count').innerHTML = e.data.item
        })
    } catch (error) {
        console.log(error)
    }
}

document.addEventListener('DOMContentLoaded', count)

