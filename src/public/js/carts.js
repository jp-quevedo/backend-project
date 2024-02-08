const socketClient = io()

// CREATE IMPORT

const createCartForm = document.getElementById('createCartForm')
const cartId = document.getElementById('cartId')
const productIdInCreation = document.getElementById('productsInCreation')

// ADD PRODUCTS IMPORT

const updateCartForm = document.getElementById('updateCartForm')
const updatingCartId = document.getElementById('updatingCartId')
const productsInAddP = document.getElementById('productsInAddP')

// DELETE PRODUCTS IMPORT

const deletePFCartForm = document.getElementById('deletePFCartForm')
const deletePFCartId = document.getElementById('deletePFCartId')
const deletingProduct = document.getElementById('deletingProduct')

// DELETE IMPORT

const deleteCartForm = document.getElementById('deleteCartForm')
const deletingCartId = document.getElementById('deletingCartId')

// PURCHASE IMPORT

const purchaseCartForm = document.getElementById('purchaseCartForm')
const userEmail = document.getElementById('userEmail')
const purchasingCartId = document.getElementById('purchasingCartId')

// TABLE IMPORT

const cTable = document.getElementById('cTable')

// CREATE CART EVENT

createCartForm.onsubmit = (e) => {
    e.preventDefault()
    socketClient.emit('createCart')
}

socketClient.on('cartCreated', (creatingCart) => {
    const { _id, productsInCart } = creatingCart
    const cartRow = `
        <tr>
            <td>${_id}</td>
            <td>${productsInCart}</td>
        </tr>
    `
    cTable.innerHTML += cartRow
})

// ADD PRODUCTS EVENT

updateCartForm.onsubmit = (e) => {
    e.preventDefault()
    if (updatingCartId.value == '' ||
        productsInAddP.value == ''
    ) {
        Swal.fire({
            icon: 'error',
            title: 'Some data is missing!',
          })
    } else {
        socketClient.emit('updateCart', { _id: updatingCartId.value }, { product: productsInAddP.value, quantity: 1 })
    }
}

socketClient.on('cartUpdated', (newCartsArray) => {
    let carts = `<thead>
        <tr>
            <th>Cart Id</th>
            <th>Products Id</th>
        </tr>
    </thead>`
    newCartsArray
        .map((objCarts) => 
        carts += `<tr>
            <td>${objCarts._id}</td>
            <td>${objCarts.productsInCart}</td>
        </tr>`)
    cTable.innerHTML = carts
})

// DELETE PRODUCTS EVENT

deletePFCartForm.onsubmit = (e) => {
    e.preventDefault()
    if (
        deletePFCartId.value == '' ||
        deletingProduct.value == ''
    ) {
        Swal.fire({
            icon: 'error',
            title: 'Some data is missing!',
          })
    } else {
        socketClient.emit('deletePFCart', { _id: deletePFCartId.value }, { product: deletingProduct.value, quantity: 1 })
    }
}

socketClient.on('productFCDeleted', (newPFCartsArray) => {
    let carts = `<thead>
        <tr>
            <th>Cart Id</th>
            <th>Products Id</th>
        </tr>
    </thead>`
    newPFCartsArray
        .map((objCarts) => 
        carts += `<tr>
            <td>${objCarts._id}</td>
            <td>${objCarts.productsInCart}</td>
        </tr>`)
    cTable.innerHTML = carts
})

// DELETE CART EVENT

deleteCartForm.onsubmit = (e) => {
    e.preventDefault()
    if (deletingCartId.value == '') {
        Swal.fire({
            icon: 'error',
            title: 'Some data is missing!',
          })
    } else {
        const cartDelete = { _id: deletingCartId.value }
        socketClient.emit('deleteCart', cartDelete)
    }
}

socketClient.on('cartDeleted', (newCartsArray) => {
    let carts = `<thead>
        <tr>
            <th>Cart Id</th>
            <th>Products Id</th>
        </tr>
    </thead>`
    newCartsArray
        .map((objCarts) => 
        carts += `<tr>
            <td>${objCarts._id}</td>
            <td>${objCarts.productsInCart}</td>
        </tr>`)
    cTable.innerHTML = carts
})

// PURCHASE EVENT

purchaseCartForm.onsubmit = (e) => {
    e.preventDefault()
    if(
        purchasingCartId.value == '' ||
        userEmail.value == ''
    ) {
        Swal.fire({
            icon: 'error',
            title: 'Some data is missing!',
          })
    } else {
        const purchase = { 
            purchaser: userEmail.value,
            cart: purchasingCartId.value
        }
        socketClient.emit('purchaseCart', purchase)
    }
}

socketClient.on('cartPurchased', (purchasingCart) => {
    const { _id, code, purchaser, date, products } = purchasingCart
    const purchaseRow = `
        <tr>
            <td>${_id}</td>
            <td>${code}</td>
            <td>${purchaser}</td>
            <td>${date}</td>
            <td>${products.title}</td>
            <td>${products.price}</td>
            <td>${products.quantity}</td>
        </tr>
    `
    ticketsTable.innerHTML += purchaseRow
})