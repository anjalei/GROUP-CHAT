console.log("Signup JS loaded");
document.getElementById('signupForm').addEventListener('submit', addUser);

async function addUser(event) {
    event.preventDefault();
    const username = document.getElementById("username")?.value;
    const phone = document.getElementById("phone")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;

    if (!username || !phone || !email || !password) {
        alert("Please fill all the fields!");
        return;
    }

    try {
        const response = await axios.post("http://localhost:3000/api/signup", {
            username, phone, email, password
        });

        // Clear form fields
        document.getElementById("username").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

        if (response.status === 201) {
            alert("Successfully signed up!");
            window.location.href = "/login.html";
        }

    } catch (error) {
        if (error.response && error.response.status === 409) {
            alert("User already exists, Please Login");
        } else {
            alert("Something went wrong during signup.");
        }
    }
}
