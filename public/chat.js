
document.addEventListener("DOMContentLoaded", () => {
  const createBtn = document.querySelector(".create-btn");
  const groupList = document.getElementById("groupList");
  const token = localStorage.getItem("token");

  const socket = io("http://localhost:3000");
  socket.on("message", (msg) => {
    showMessageOnScreen(msg);
  });

  async function loadGroups() {
    try {
      const res = await axios.get("http://localhost:3000/group/fetch", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const groups = res.data.groups;
      groupList.innerHTML = "";

      groups.forEach((group) => {
        const li = document.createElement("li");
        li.textContent = group.groupname;
        li.dataset.groupId = group.id;

        li.addEventListener("click", () => {
          joinGroup(group.id, group.groupname);
        });

        groupList.appendChild(li);
      });
      const lastGroupId = localStorage.getItem("lastGroupId");
      if (lastGroupId) {
        const lastGroup = groups.find((g) => g.id == lastGroupId);
        if (lastGroup) {
          joinGroup(lastGroup.id, lastGroup.groupname);
        } else {
          localStorage.removeItem("lastGroupId");
        }
      }
    } catch (err) {
      console.error("Could not load groups:", err);
    }
  }

  createBtn.addEventListener("click", async () => {
    const groupName = prompt("Enter Group Name:");
    if (!groupName) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/group/create",
        { groupname: groupName },
        { headers: { Authorization: `Bearer ${token}` } }
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
  fileBtn.addEventListener("click", async () => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const groupId = localStorage.getItem("lastGroupId");
      let file = document.getElementById("fileBtn").files[0];
      let formData = new FormData();
      formData.append("file", file);
      const headers = {
        Authorization: token,
        "Content-Type": "multipart/form-data",
      };
      const res = await axios.post(
        `http://localhost:3000/api/upload/${groupId}`,
        formData,
        { headers }
      );
      if (res.data && res.data.userFile) {
        showMessageOnScreen({
          senderName: res.data.userFile.senderName,
          message: res.data.userFile.message,
          type: res.data.userFile.type,
        });
      }
      socket.emit(
        "file",
        res.data.userFile.message,
        res.data.userFile.name,
        groupId,
        res.data.userFile.userId
      );
    } catch (error) {
      console.log(error);
    }
  });

  document.getElementById("sendBtn").addEventListener("click", async () => {
    const message = document.getElementById("msgInput").value;
    const groupId = document.querySelector("#groupList li.active")?.dataset
      .groupId;

    if (!groupId || !message) return;

    try {
      const res = await axios.post(
        "http://localhost:3000/api/message",
        { message, groupId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data && res.data.newMessage) {
        showMessageOnScreen({
          senderName: res.data.senderName,
          message: res.data.newMessage.message,
          type : res.data.newMessage.type
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

    const oldDetails = document.getElementById("groupDetails");
    if (oldDetails) oldDetails.remove();
     const adminBtns = document.getElementById("adminButtons");
if (adminBtns) adminBtns.style.display = "none";
    const detailsBtn = document.getElementById("groupDetailsBtn");
    detailsBtn.style.display = "inline-block";
    detailsBtn.dataset.groupId = groupId;
    localStorage.setItem("lastGroupId", String(groupId));
    socket.emit("joinGroup", groupId);

    document
      .querySelectorAll("#groupList li")
      .forEach((li) => li.classList.remove("active"));
    const clicked = document.querySelector(
      `#groupList li[data-group-id="${groupId}"]`
    );
    if (clicked) clicked.classList.add("active");

    setupGroupDetailsButton(groupId);
    loadChats(groupId);
  }

  // Load chats
  async function loadChats(groupId) {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/getmessages/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const div = document.getElementById("messages");
      div.innerHTML = "";

      res.data.allGroupMessages.forEach((msg) => showMessageOnScreen(msg));
    } catch (err) {
      console.error("Could not load messages:", err);
    }
  }

  function showMessageOnScreen(msg) {
    const ul = document.getElementById("messages");
    if (!ul) return;

    if (msg.type == "text") {
      const li = document.createElement("li");
      li.textContent = `${msg.senderName || "Unknown"}: ${msg.message}`;
      ul.appendChild(li);
      ul.scrollTop = ul.scrollHeight;
    } else {
      const li = document.createElement("li");
      let fileLink = document.createElement("a");
      fileLink.href = msg.message;
      fileLink.innerText = "click to see(download)";
      li.textContent = `${msg.senderName || "Unknown"}: ${fileLink}`;
      ul.appendChild(li);
      ul.scrollTop = ul.scrollHeight;
    }
  }

  loadGroups();

  function setupGroupDetailsButton(groupId) {
    const detailsBtn = document.getElementById("groupDetailsBtn");
    detailsBtn.style.display = "inline-block";
    detailsBtn.onclick = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:3000/group/details/${groupId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { admin, members } = res.data;
        const currentUser = getUserFromToken();

        if (currentUser && admin && currentUser.userId === admin.id) {
          document.getElementById("adminButtons").style.display = "block";
        } else {
          document.getElementById("adminButtons").style.display = "none";
        }

        const oldDetails = document.getElementById("groupDetails");
        if (oldDetails) oldDetails.remove();

        const detailsDiv = document.createElement("div");
        detailsDiv.id = "groupDetails";
        detailsDiv.style.background = "#b5d1dfff";
        detailsDiv.style.padding = "10px";
        detailsDiv.style.marginTop = "10px";
        detailsDiv.innerHTML = `
        <strong>Admin:</strong> ${admin.name}<br/>
        <strong>Members:</strong>
        <ul>${members.map((m) => `<li>${m.name}</li>`).join("")}</ul>
      `;

        document.getElementById("chatHeader").appendChild(detailsDiv);
      } catch (err) {
        console.error("Could not fetch group details:", err);
      }
    };
  }

  function getUserFromToken() {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload;
    } catch (err) {
      console.error("Error decoding token:", err);
      return null;
    }
  }
  document
    .getElementById("addMemberBtn")
    .addEventListener("click", async () => {
      const memberEmail = prompt("Enter the email of the member to add:");
      if (!memberEmail) return;

      try {
        const token = localStorage.getItem("token");
        const groupId = localStorage.getItem("lastGroupId");
        const res = await axios.post(
          "http://localhost:3000/group/addmember",
          { memberEmail, groupid: groupId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          alert("✅ " + res.data.msg);
        } else {
          alert("⚠️ " + res.data.msg);
        }
      } catch (err) {
        console.error("Error adding member:", err);
        alert("❌ Failed to add member. Check console.");
      }
    });

  document
    .getElementById("removeMemberBtn")
    .addEventListener("click", removeMemberFromGroup);
  async function removeMemberFromGroup() {
    const email = prompt("Enter the member's email to remove:");
    if (!email) return;

    const groupId = document.getElementById("groupDetailsBtn").dataset.groupId;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/group/removemember",
        { memberEmail: email, groupid: groupId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert(res.data.msg);

        document.getElementById("groupDetailsBtn").click();
      } else {
        alert(res.data.msg || "Failed to remove member");
      }
    } catch (err) {
      console.error("Error removing member:", err);
      alert("Error removing member. Check console for details.");
    }
  }
  document
    .getElementById("changeAdminBtn")
    .addEventListener("click", changeAdmin);

  async function changeAdmin() {
    const newAdminEmail = prompt(
      "Enter the email of the member to make admin:"
    );
    if (!newAdminEmail) return;

    const groupId = localStorage.getItem("lastGroupId");
    const token = localStorage.getItem("token");
    if (!token || !groupId) {
      alert("You are not logged in or no group selected!");
      return;
    }

    try {
      const res = await axios.patch(
        "http://localhost:3000/group/changeadmin",
        { memberEmail: newAdminEmail, groupid: groupId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        alert("✅ " + res.data.msg);

        document.getElementById("groupDetailsBtn").click();

        const currentUser = getUserFromToken();
        if (currentUser && currentUser.userId !== res.data.newAdminId) {
          document.getElementById("adminButtons").style.display = "none";
        }
      } else {
        alert("⚠️ " + res.data.msg);
      }
    } catch (err) {
      console.error("Error changing admin:", err);
      alert("❌ Failed to change admin. Check console.");
    }
  }
  document
    .getElementById("deleteGroupBtn")
    .addEventListener("click", deleteGroup);

  async function deleteGroup() {
    const confirmDelete = confirm(
      "Are you sure you want to delete this group? This cannot be undone!"
    );
    if (!confirmDelete) return;

    const groupId = localStorage.getItem("lastGroupId");
    const token = localStorage.getItem("token");
    if (!token || !groupId) {
      alert("You are not logged in or no group selected!");
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:3000/group/delete/${groupId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200) {
        alert("✅ " + res.data.msg);
        const groupLi = document.querySelector(
          `#groupList li[data-group-id="${groupId}"]`
        );
        if (groupLi) groupLi.remove();

        document.getElementById("messages").innerHTML = "";
        const groupDetails = document.getElementById("groupDetails");
        if (groupDetails) groupDetails.remove();

        document.getElementById("adminButtons").style.display = "none";

        localStorage.removeItem("lastGroupId");
        document.getElementById("groupName").textContent = "Select a group";
      }
    } catch (err) {
      console.error("Error deleting group:", err);
      alert("❌ Failed to delete group. Check console.");
    }
  }
});