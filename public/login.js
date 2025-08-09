document.getElementById('loginForm').addEventListener('submit', loginUser);

async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value.trim();

    if (!email || !password) {
        alert("Please fill in both email and password!");
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/api/login', {
            email,
            password
        });

        if (response.status === 200 && response.data.token) {
            localStorage.setItem("token", response.data.token);
            console.log("Token saved:", response.data.token);
            alert("Login successful!");
            window.location.href = "chat.html";
        } else {
            alert("No token received from server.");
        }
    } catch (error) {
        console.error("Login error:", error);

        if (error.response && error.response.status === 401) {
            alert("Invalid credentials. Please try again.");
        } else {
            alert("Something went wrong during login.");
        }
    }
}
