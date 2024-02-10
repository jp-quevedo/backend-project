const socketClient = io()

// CREATE IMPORT

const createForm = document.getElementById('createForm')
const productTitle = document.getElementById('productTitle')
const productDescription = document.getElementById('productDescription')
const productCode = document.getElementById('productCode')
const productPrice = document.getElementById('productPrice')
const productStatus = document.getElementById('productStatus')
const productStock = document.getElementById('productStock')
const productCategory = document.getElementById('productCategory')
const productOwner = document.getElementById('productOwner')

// UPDATE IMPORT

const updateProductForm = document.getElementById('updateProductForm')
const productIdUpdate = document.getElementById('productIdUpdate')
const productTitleUpdate = document.getElementById('productTitleUpdate')
const productDescriptionUpdate = document.getElementById('productDescriptionUpdate')
const productCodeUpdate = document.getElementById('productCodeUpdate')
const productPriceUpdate = document.getElementById('productPriceUpdate')
const productStatusUpdate = document.getElementById('productStatusUpdate')
const productStockUpdate = document.getElementById('productStockUpdate')
const productCategoryUpdate = document.getElementById('productCategoryUpdate')
const productOwnerUpdate = document.getElementById('productOwnerUpdate')

// DELETE IMPORT

const deleteForm = document.getElementById('deleteForm')
const deletingProductId = document.getElementById('deletingProductId')

// TABLE IMPORT

const rtpTable = document.getElementById('rtpTable')

// CREATE EVENT

createForm.onsubmit = (e) => {
    e.preventDefault()
    if (
        productTitle.value == '' ||
        productDescription.value == '' ||
        productCode.value == '' ||
        productPrice.value == '' ||
        productStatus.value == '' ||
        productStock.value == '' ||
        productCategory.value == '' ||
        productOwner.value == ''
        ) {
            Swal.fire({
                icon: 'error',
                title: 'Some data is missing!',
              })
    } else {
        const newProduct = {
            title: productTitle.value,
            description: productDescription.value,
            code: productCode.value,
            price: productPrice.value,
            status: productStatus.value,
            stock: productStock.value,
            category: productCategory.value,
            owner: productOwner.value,
        }
        socketClient.emit('createProduct', newProduct)
    }
}

socketClient.on('productCreated', (creatingProduct) => {
    const { _id, title, description, code, price, status, stock, category, owner } = creatingProduct
    const productRow = `
        <tr>
            <td>${_id}</td>
            <td>${title}</td>
            <td>${description}</td>
            <td>${code}</td>
            <td>${price}</td>
            <td>${status}</td>
            <td>${stock}</td>
            <td>${category}</td>
            <td>${owner}</td>
        </tr>
    `
    rtpTable.innerHTML += productRow
})

// UPDATE EVENT

updateProductForm.onsubmit = (e) => {
    e.preventDefault()
    if (productIdUpdate.value == '' ||
        productTitleUpdate.value == '' ||
        productDescriptionUpdate.value == '' ||
        productCodeUpdate.value == '' ||
        productPriceUpdate.value == '' ||
        productStatusUpdate.value == '' ||
        productStockUpdate.value == '' ||
        productCategoryUpdate.value == '' ||
        productOwnerUpdate.value == ''
    ) {
        Swal.fire({
            icon: 'error',
            title: 'Some data is missing!',
          })
    } else {
        const newProductUpdate = {
            _id: productIdUpdate.value,
            title: productTitleUpdate.value,
            description: productDescriptionUpdate.value,
            code: productCodeUpdate.value,
            price: productPriceUpdate.value,
            status: productStatusUpdate.value,
            stock: productStockUpdate.value,
            category: productCategoryUpdate.value,
            owner: productOwnerUpdate.value,
        }
        socketClient.emit('updateProduct', newProductUpdate)
    }
}

socketClient.on('productUpdated', (newProductUpdated) => {
    let products = `<thead>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Code</th>
            <th>Price</th>
            <th>Status</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Owner</th>
        </tr>
    </thead>`
    newProductUpdated
        .map((objProducts) => 
        products += `<tr>
            <td>${objProducts._id}</td>
            <td>${objProducts.title}</td>
            <td>${objProducts.description}</td>
            <td>${objProducts.code}</td>
            <td>${objProducts.price}</td>
            <td>${objProducts.status}</td>
            <td>${objProducts.stock}</td>
            <td>${objProducts.category}</td>
            <td>${objProducts.owner}</td>
        </tr>`)
    rtpTable.innerHTML = products
})

// DELETE EVENT

deleteForm.onsubmit = (e) => {
    e.preventDefault()
    if (deletingProductId.value == '') {
        Swal.fire({
            icon: 'error',
            title: 'Some data is missing!',
          })
    } else {
        const newProductDelete = { _id: deletingProductId.value }
    socketClient.emit('deleteProduct', newProductDelete)
    }
}

socketClient.on('productDeleted', (newProductsArray) => {
    let products = `<thead>
        <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Code</th>
            <th>Price</th>
            <th>Status</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Owner</th>
        </tr>
    </thead>`
    newProductsArray
        .map((objProducts) => 
        products += `<tr>
            <td>${objProducts._id}</td>
            <td>${objProducts.title}</td>
            <td>${objProducts.description}</td>
            <td>${objProducts.code}</td>
            <td>${objProducts.price}</td>
            <td>${objProducts.status}</td>
            <td>${objProducts.stock}</td>
            <td>${objProducts.category}</td>
            <td>${objProducts.owner}</td>
        </tr>`)
    rtpTable.innerHTML = products
})