

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
        console.log("------Add to  wishlist")
        setTimeout(() => {

            $("#wish").load(location.href + " #wish>*", "")
        }, 60)
    })
}
async function addtoCart(proId) {
    console.log(proId, '------------cart axios with product id')
    await axios.get(`/add_to_cart/${proId}`, {}).then((e) => {
        swal({
            title: "Item Add to Cart!",
            icon: "success",
            buttons: false,
            timer: 1000,
            width: '25em'
        });
        console.log("---------add to cart axios cart")
        setTimeout(() => {
            $("#cart").load(location.href + " #cart>*", "")
        }, 60)
    })
}


//..............................C A R T.......................   //  
async function decQty(proId) {
    console.log(proId, '------------cart axios l')
    await axios.post(`/decQty/${proId}`, {}).then((e) => {

        if (e.data.status) {
            document.getElementById(proId).value = e.data.qty
        }
        console.log("----------d qty cart")

        $("#quantity").load(location.href + " #quantity>*", "")

    })
}

async function incQty(proId) {
    console.log(proId, '------------cart axios l')
    await axios.post(`/incQty/${proId}`, {}).then((e) => {
        if (e.data.status) {
            document.getElementById(proId).value = e.data.qty
        }
        console.log("------------ i qty cart")

        $("#quantity").load(location.href + " #quantity>*", "")

    })
}





function remove(ev, id) {
    ev.preventDefault();
    let url = ev.currentTarget.getAttribute('href')
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

function removeaddress(ev, id) {
    ev.preventDefault();
    let url = ev.currentTarget.getAttribute('href')
    swal({
        title: "Are you sure?",
        text: "You Want to remove this Address!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {

            if (willDelete) {

                swal({
                    title: "Address Has been removed...!",
                    icon: "success",
                    buttons: false,
                    timer: 1000,
                    width: '25em'
                });
                window.location.href = url;
            } else {
                swal("Your file is safe!");
            }
        });
}


function cancelorder(ev, id) {
    ev.preventDefault();
    let url = ev.currentTarget.getAttribute('href')
    swal({
        title: "Are you sure?",
        text: "You Want to remove this item!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {

        if (willDelete) {

            swal({
                title: "Order Has been Cancelled...!",
                icon: "success",
                buttons: false,
                timer: 1000,
                width: '25em'
            });
            axios({
                method: 'post',
                url: '/cancelorder/' + id

            }).then((response) => {
                location.reload()
            }).catch((response) => {
                console.log(response, "catch error at delivered axios.")
            })
        } else {
        }
    });


}


