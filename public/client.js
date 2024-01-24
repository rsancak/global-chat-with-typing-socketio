const socket = io()
let name;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message-area')
do {
    name = prompt('İsminizi giriniz: ')
} while (!name)

textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value)
    }else{
        typing = true;
        socket.emit('typing', 'yazıyor...');
        timeout = setTimeout(timeoutFunction, 2000);
    }
})

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append 
    appendMessage(msg, 'outgoing')
    textarea.value = ''
    scrollToBottom()

    // Send to server 
    socket.emit('message', msg)

}

function timeoutFunction() {
    typing = false;
    socket.emit("typing", false);
}


socket.on('typing', function (data) {
    if (data) {
        document.getElementsByClassName('typing')[0].innerHTML = data;
    } else {
        document.getElementsByClassName('typing')[0].innerHTML = "";
    }
});

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

// Recieve messages 
socket.on('message', (msg) => {
    appendMessage(msg, 'incoming')
    scrollToBottom()
})

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}



