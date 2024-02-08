const socketClient = io()
const chatForm = document.getElementById('chatForm')
const inputMessage = document.getElementById('chatMessage')
const userName = document.getElementById('chatName')
const chatDiv = document.getElementById('chat')

let userEmail

const { value: email } = Swal.fire({
    title: 'Input email address',
    input: 'email',
    inputLabel: 'Your email address',
    inputPlaceholder: 'Enter your email address'
    }).then((input) => {
        userEmail = input.value,
        userName.innerText = `Chat User: ${ userEmail }`
        socketClient.emit('newChatUser', userEmail)
    })

socketClient.on('newChatUserBroadcast', (userEmail) => {
    Toastify({
        text: `${ userEmail } connected`,
        duration: 5000,
        style: {
            background: 'linear-gradient(to right, #00b09b, #96c93d)'
        }
      }).showToast()
})

chatForm.onsubmit = (e) => {
    e.preventDefault()
    const infoMessage = {
        userEmail: userEmail,
        message: inputMessage.value
    }
    if (!inputMessage.value) {
        return Swal.fire({
            icon: 'error',
            title: 'Say something!',
          })
    } else {
        socketClient.emit('chatMessage', infoMessage)
    }
}

socketClient.on('chat', (newMessage) => {
    const { userEmail, message } = newMessage
    const chatRow = 
        `
        <td>${userEmail}</td>
        <td>${message}</td>
        `
    chatDiv.innerHTML += chatRow
})