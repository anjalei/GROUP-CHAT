console.log('js loaded');

document.addEventListener("DOMContentLoaded", () => {
    const createBtn = document.querySelector(".create-btn");
    const groupList = document.getElementById("groupList");
    const token = localStorage.getItem("token");

    const socket = io("http://localhost:3000");
    socket.on("message", (msg) => {
        showMessageOnScreen(msg);
    });

    // Load groups
    async function loadGroups() {
        try {
            const res = await axios.get("http://localhost:3000/group/fetch", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            const groups = res.data.groups;
            groupList.innerHTML = "";

            groups.forEach(group => {
                const li = document.createElement("li");
                li.textContent = group.groupname;
                li.dataset.groupId = group.id;

                li.addEventListener("click", () => {
                    joinGroup(group.id, group.groupname);
                });

                groupList.appendChild(li);
            });
        } catch (err) {
            console.error("Could not load groups:", err);
        }
    }

    // Create new group
    createBtn.addEventListener("click", async () => {
        const groupName = prompt("Enter Group Name:");
        if (!groupName) return;

        try {
            const res = await axios.post("http://localhost:3000/group/create",
                { groupname: groupName },
                { headers: { "Authorization": `Bearer ${token}` } }
            );

            if (res.data.success) {
                const li = document.createElement("li");
                li.textContent = res.data.group.groupname;
                li.dataset.groupId = res.data.group.id;
                li.addEventListener("click", () => {
                    joinGroup(res.data.group.id, res.data.group.groupname);
                });
                groupList.appendChild(li);
            }
        } catch (err) {
            console.error("Error creating group:", err);
            alert("Failed to create group!");
        }
    });

    // Send a new message
    document.getElementById("sendBtn").addEventListener("click", async () => {
        const message = document.getElementById("msgInput").value;
        const groupId = document.querySelector("#groupList li.active")?.dataset.groupId;

        if (!groupId || !message) return;

        try {
            const res = await axios.post("http://localhost:3000/api/message", { message, groupId }, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            // Show the message immediately
            if (res.data && res.data.newMessage) {
                showMessageOnScreen({
                    senderName: res.data.senderName,
                    message: res.data.newMessage.message
                });
            }

            document.getElementById("msgInput").value = "";
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    });

    // Join group
    async function joinGroup(groupId, groupName) {
        document.getElementById("groupName").textContent = groupName;
        const detailsBtn = document.getElementById("groupDetailsBtn");
        detailsBtn.style.display = "inline-block";
        detailsBtn.dataset.groupId = groupId;

        socket.emit("joinGroup", groupId);

        document.querySelectorAll("#groupList li").forEach(li => li.classList.remove("active"));
        const clicked = document.querySelector(`#groupList li[data-group-id="${groupId}"]`);
        if (clicked) clicked.classList.add("active");

        setupGroupDetailsButton(groupId);
        loadChats(groupId);
    }

    // Load chats
    async function loadChats(groupId) {
        try {
            const res = await axios.get(`http://localhost:3000/api/getmessages/${groupId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            const div = document.getElementById("messages");
            div.innerHTML = "";

            res.data.allGroupMessages.forEach(msg => showMessageOnScreen(msg));
        } catch (err) {
            console.error("Could not load messages:", err);
        }
    }

    // Show message
    function showMessageOnScreen(msg) {
        const div = document.getElementById("messages");
        if (!div) return;

        const li = document.createElement("li");
        li.textContent = `${msg.senderName || "Unknown"}: ${msg.message}`;
        div.appendChild(li);
        div.scrollTop = div.scrollHeight;
    }

    loadGroups();
});

// Setup details button
function setupGroupDetailsButton(groupId) {
    const detailsBtn = document.getElementById("groupDetailsBtn");
    detailsBtn.style.display = "inline-block"; // make it visible

    detailsBtn.onclick = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:3000/group/details/${groupId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (res.data.success) {

                let oldDetails = document.getElementById("groupDetails");
                if (oldDetails) oldDetails.remove();

                const detailsDiv = document.createElement("div");
                detailsDiv.id = "groupDetails";
                detailsDiv.style.border = "1px solid #ccc";
                detailsDiv.style.padding = "5px";
                detailsDiv.style.marginTop = "5px";

                const memberNames = res.data.members.map(m => m.name).join(", ");
                detailsDiv.innerHTML = `
                    <strong>Admin:</strong> ${res.data.admin.name} <br>
                    <strong>Members:</strong> ${memberNames}
                `;

                const chatHeader = document.getElementById("chatHeader");
                chatHeader.after(detailsDiv);
            }
        } catch (err) {
            console.error("Could not fetch group details:", err);
        }
    };
}
