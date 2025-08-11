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

        // Send message to backend
        const res = await axios.post(
            'http://localhost:3000/api/message',
            { message: messageText },
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        document.getElementById('messageInput').value = ""; 

        // Show message instantly in UI
        const newMsg = {
            name: res.data.name, // comes from backend
            message: res.data.newMessage.message
        };
        showMessageonscreen(newMsg);

        // Update localStorage with the new message
        let storedMessages = JSON.parse(localStorage.getItem('Allmessages')) || [];
        storedMessages.push(res.data.newMessage);
        if (storedMessages.length > 10) {
            storedMessages = storedMessages.slice(storedMessages.length - 10);
        }
        localStorage.setItem('Allmessages', JSON.stringify(storedMessages));

    } catch (error) {
        console.error(error);
        alert("Error sending message!");
    }
}

async function fetchMessages(allMessages) {
    try {
        const chatBox = document.getElementById('messages');
        chatBox.innerHTML = ''; 

        allMessages.forEach(msg => {
            showMessageonscreen(msg);
        });

    } catch (err) {
        console.error('Error fetching messages:', err);
    }
}

function showMessageonscreen(user) {
    const chatBox = document.getElementById('messages');
    const childNode = `<li><strong>${user.name}:</strong> ${user.message}</li>`;
    chatBox.innerHTML += childNode;
}

// Load messages on page load
window.addEventListener('DOMContentLoaded', async () => {
    let concatedArray;
    const token = localStorage.getItem('token');
    let message = JSON.parse(localStorage.getItem('Allmessages'));
    let lastmessageid;

    if (!message || message.length === 0) lastmessageid = 0;
    else lastmessageid = message[message.length - 1].id;

    try {
        const res = await axios.get(
            `http://localhost:3000/api/getmessages?lastmessageid=${lastmessageid}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 202) {
            const backendArray = res.data.allMessages;
            if (!message || message.length === 0) {
                concatedArray = [...backendArray];
            } else {
                concatedArray = message.concat(backendArray);
            }
            if (concatedArray.length > 10) {
                concatedArray = concatedArray.slice(concatedArray.length - 10);
            }
            localStorage.setItem('Allmessages', JSON.stringify(concatedArray));
            fetchMessages(concatedArray);
        }

    } catch (error) {
        document.body.innerHTML += `<div style="color: red;text-align: center;">
                                        <h3>${error}</h3>
                                    </div>`;
    }
});
