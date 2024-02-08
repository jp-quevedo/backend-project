const socketClient = io()

// UPDATE IMPORT

const updateUserForm = document.getElementById('updateUserForm')
const userIdUpdate = document.getElementById('userIdUpdate')
const userNameUpdate = document.getElementById('userNameUpdate')
const userEmailUpdate = document.getElementById('userEmailUpdate')
const userPasswordUpdate = document.getElementById('userPasswordUpdate')
const userRoleUpdate = document.getElementById('userRoleUpdate')
const userCartUpdate = document.getElementById('userCartUpdate')

// DELETE IMPORT

const deleteUserForm = document.getElementById('deleteUserForm')
const deletingUserId = document.getElementById('deletingUserId')

// RESET IMPORT

const resetPassReqForm = document.getElementById('resetPassReqForm')
const resetPassRequest = document.getElementById('resetPassRequest')

const resetPassForm = document.getElementById('resetPassForm')
const resetPassEmail = document.getElementById('resetPassEmail')
const resetPassCode = document.getElementById('resetPassCode')
const resetPass = document.getElementById('resetPass')

// TABLE IMPORT

const usersTable = document.getElementById('usersTable')

// UPDATE EVENT

updateUserForm.onsubmit = (e) => {
    e.preventDefault()
    if (userIdUpdate.value == '' ||
        userNameUpdate.value == '' ||
        userEmailUpdate.value == '' ||
        userPasswordUpdate.value == '' ||
        userRoleUpdate.value == '' ||
        userCartUpdate.value == ''
    ) {
        Swal.fire({
            icon: 'error',
            title: 'Some data is missing!',
          })
    } else {
        const newUserUpdate = {
            _id: userIdUpdate.value,
            name: userNameUpdate.value,
            email: userEmailUpdate.value,
            password: userPasswordUpdate.value,
            role: userRoleUpdate.value,
            cart: userCartUpdate.value
        }
        socketClient.emit('updateUser', newUserUpdate)
    }
}

socketClient.on('userUpdated', (newUserUpdated) => {
    let users = `<thead>
        <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Cart Id</th>
        </tr>
    </thead>`
    newUserUpdated
        .map((objUsers) => 
        users += `<tr>
            <td>${objUsers._id}</td>
            <td>${objUsers.name}</td>
            <td>${objUsers.email}</td>
            <td>${objUsers.role}</td>
            <td>${objUsers.usersCart}</td>
        </tr>`)
    usersTable.innerHTML = users
})

// DELETE EVENT

deleteUserForm.onsubmit = (e) => {
    e.preventDefault()
    if (deletingUserId.value == '') {
        Swal.fire({
            icon: 'error',
            title: 'Some data is missing!',
          })
    } else {
        const newUserDelete = { _id: deletingUserId.value }
        socketClient.emit('deleteUser', newUserDelete)
    }
}

socketClient.on('userDeleted', (newUsersArray) => {
    let users = `<thead>
        <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Cart Id</th>
        </tr>
    </thead>`
    newUsersArray
        .map((objUsers) => 
        users += `<tr>
            <td>${objUsers._id}</td>
            <td>${objUsers.name}</td>
            <td>${objUsers.email}</td>
            <td>${objUsers.role}</td>
            <td>${objUsers.usersCart}</td>
        </tr>`)
    usersTable.innerHTML = users
})

// REQUEST EVENT

resetPassReqForm.onsubmit = (e) => {
    e.preventDefault()
    if (resetPassRequest.value == '') {
        Swal.fire({
            icon: 'error',
            title: 'Some data is missing!',
          }) 
    } else {
        const newCodeRequest = { email: resetPassRequest.value }
        socketClient.emit('requestNewPass', newCodeRequest)
    }
}

socketClient.on('codeRequested', Swal.fire('Code sent!'))

// RESET EVENT

resetPassForm.onsubmit = (e) => {
    e.preventDefault()
    if (resetPassEmail.value == '' ||
        resetPassCode.value == '' ||
        resetPass.value == ''
    ) {
        Swal.fire({
            icon: 'error',
            title: 'Some data is missing!',
          })
    } else {
        const newPassValidation = {
            email: resetPassEmail.value,
            code: resetPassCode.value,
            password: resetPass.value
        }
        socketClient.emit('resetOldPass', newPassValidation)
    }
}

socketClient.on('passResetOk', Swal.fire('New password saved!'))