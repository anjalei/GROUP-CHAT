console.log("Chat JS loaded!");

const form = document.getElementById('messageForm');
console.log("Form element found:", form);

if (form) {
    form.addEventListener('submit', (e) => {
        console.log("Form submitted!");
        Message(e);
    });
} else {
    console.error("❌ messageForm not found in DOM");
}


async function Message(event) {
    event.preventDefault();

    try {
        const token = localStorage.getItem('token');
         console.log("Token from localStorage:", token);
        console.log("Authorization header will be:", `Bearer ${token}`);
        const messageText = document.getElementById('messageInput').value;

        if (!messageText.trim()) {
            alert("Please enter a message!");
            return;
        }

      
        const message = { message: messageText };

        const res = await axios.post(
            'http://localhost:3000/api/message',
            message,
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        if (res.status === 200) {
            console.log(res.data.newMessage);
            showMessageOnScreen(res.data);
            document.getElementById('messageInput').value = ""; 
        }
    } catch (error) {
        console.error(error);
        alert("Error sending message!");
    }
}

function showMessageOnScreen(data) {
    const parentNode = document.getElementById('messages');
    const childNode = `<li>${data.name}: ${data.newMessage.message}</li>`;
    parentNode.innerHTML += childNode;
}

