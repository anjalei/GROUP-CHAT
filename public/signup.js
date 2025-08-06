async function addUser(event) {
    event.preventDefault();
    const username = document.getElementById("username")?.value;
    const phone = document.getElementById("phone")?.value;
    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const obj = { username, phone, email, password };

    if (!username || !phone || !email || !password) {
        alert("Please fill all the fields!");
        return;
    }

    try {
        const res = await axios.post("http://localhost:3000/api/post", obj);

       
        document.getElementById("username").value = "";
        document.getElementById("phone").value = "";
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        
       
        window.location.href = 'login.html';

    } catch (error) {
        console.error(error);
        alert('Something went wrong during signup.');
    }
}