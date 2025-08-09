console.log("Chat JS loaded!");


const form = document.getElementById('messageForm');
console.log("Form element found:", form);

if (form) {
    form.addEventListener('submit', Message);
} else {
    console.error("❌ messageForm not found in DOM");
}


async function Message(event) {
    event.preventDefault();

    try {
        const token = localStorage.getItem('token');
        const messageText = document.getElementById('messageInput').value.trim();

        if (!messageText) {
            alert("Please enter a message!");
            return;
        }

        await axios.post(
            'http://localhost:3000/api/message',
            { message: messageText },
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        document.getElementById('messageInput').value = ""; 
    } catch (error) {
        console.error(error);
        alert("Error sending message!");
    }
}

async function fetchMessages() {
    try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get('http://localhost:3000/api/getmessages', {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const chatBox = document.getElementById('messages');
        chatBox.innerHTML = ''; 

        response.data.messages.forEach(msg => {
            const p = document.createElement('p');
            p.textContent = `${msg.name}: ${msg.message}`;
            chatBox.appendChild(p);
        });
    } catch (err) {
        console.error('Error fetching messages:', err);
    }
}

setInterval(fetchMessages, 1000);
fetchMessages();
function displayMessages(messages) {
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML = '';
    messages.forEach(msg => {
        const div = document.createElement('div');
        div.textContent = `${msg.name}: ${msg.message}`;
        chatBox.appendChild(div);
    });
}
