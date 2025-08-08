document.getElementById('loginForm').addEventListener('submit', loginUser);

async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;

    if (!email || !password) {
        alert("Please fill in both email and password!");
        return;
    }

    try {
        const response = await axios.post('http://localhost:3000/api/login', {
            email,
            password
        });

        if (response.status === 200) {
            alert("Login successful!");
            localStorage.setItem("token", response.data.token);
            window.location.href = "/chat.html"; 
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            alert("Invalid credentials. Please try again.");
        } else {
            alert("Something went wrong during login.");
        }
    }
}
