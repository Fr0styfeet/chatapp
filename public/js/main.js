const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages')

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});


const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

//message from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit

chatForm.addEventListener('submit', e => {
    e.preventDefault();     //default input to a file

    const msg = e.target.elements.msg.value; //taking that text

    //emits the msg to server
    socket.emit('chatMessage', msg);

    //clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

//output msg to dom
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('messsage');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}