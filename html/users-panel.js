// === Auth bilan Fetch ===
async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem("access_token");
  
    if (!token) {
      alert("Avval tizimga kiring!");
      window.location.href = "login.html";
      return;
    }
  
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  
    const res = await fetch(url, { ...options, headers });
  
    if (res.status === 401) {
      localStorage.clear();
      alert("Sessiya tugagan. Qaytadan kiring.");
      window.location.href = "login.html";
      return Promise.reject(new Error("Unauthorized"));
    }
  
    return res;
  }
  
  // === Logout ===
  function logout() {
    localStorage.clear();
    window.location.href = "login.html";
  }
  
  // === Barcha foydalanuvchilarni yuklash ===
  function loadUsers() {
    fetchWithAuth("http://localhost:3000/api/users")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Xatolik");
  
        let html = `
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Amallar</th>
          </tr>`;
  
        data.forEach((user) => {
          html += `
            <tr id="row-${user.id}">
              <td>${user.id}</td>
              <td class="username">${user.username}</td>
              <td class="email">${user.email}</td>
              <td class="role">${user.role}</td>
              <td>
                <button class="edit-btn" onclick="editUser(${user.id})">✏️</button>
                <button class="delete-btn" onclick="deleteUser(${user.id})">🗑️</button>
              </td>
            </tr>`;
        });
  
        document.getElementById("userTable").innerHTML = html;
      })
      .catch((err) => {
        document.getElementById("result").innerText = err.message;
      });
  }
  
  // === Faqat o‘zini ko‘rsatish ===
  function loadSelf() {
    fetchWithAuth("http://localhost:3000/api/user/me", { method: "POST" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "O‘zingizni topib bo‘lmadi!");
  
        let html = `
          <tr>
            <th>ID</th><th>Username</th><th>Email</th><th>Role</th>
          </tr>
          <tr>
            <td>${data.id}</td>
            <td>${data.username}</td>
            <td>${data.email}</td>
            <td>${data.role}</td>
          </tr>`;
  
        document.getElementById("userTable").innerHTML = html;
      })
      .catch((err) => {
        document.getElementById("result").innerText = err.message;
      });
  }
  
  // === Foydalanuvchini o‘chirish ===
  function deleteUser(id) {
    if (!confirm("Haqiqatan ham o‘chirmoqchimisiz?")) return;
  
    fetchWithAuth(`http://localhost:3000/api/user/delete/${id}`, { method: "DELETE" })
      .then(() => loadUsers())
      .catch((err) => {
        alert("O‘chirishda xatolik: " + err.message);
      });
  }
  
  // === Foydalanuvchini tahrirlash ===
  function editUser(id) {
    const row = document.getElementById(`row-${id}`);
    const uname = row.querySelector(".username").innerText;
    const mail = row.querySelector(".email").innerText;
    const role = row.querySelector(".role").innerText;
  
    row.querySelector(".username").innerHTML = `<input id="username-${id}" value="${uname}">`;
    row.querySelector(".email").innerHTML = `<input id="email-${id}" value="${mail}">`;
    row.querySelector(".role").innerHTML = `
      <select id="role-${id}">
        <option value="USER" ${role === "USER" ? "selected" : ""}>User</option>
        <option value="ADMIN" ${role === "ADMIN" ? "selected" : ""}>Admin</option>
        <option value="SUPERADMIN" ${role === "SUPERADMIN" ? "selected" : ""}>SuperAdmin</option>
      </select>`;
  
    row.querySelector("td:last-child").innerHTML = `
      <button class="edit-btn" onclick="saveUser(${id})">💾</button>
      <button class="delete-btn" onclick="loadUsers()">❌</button>`;
  }
  
  // === Tahrirlangan foydalanuvchini saqlash ===
  function saveUser(id) {
    const u = document.getElementById(`username-${id}`).value;
    const e = document.getElementById(`email-${id}`).value;
    const r = document.getElementById(`role-${id}`).value;
  
    fetchWithAuth(`http://localhost:3000/api/user/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: u, email: e, role: r }),
    })
      .then((res) => res.ok ? loadUsers() : res.json().then((d) => alert(d.message)))
      .catch(console.error);
  }
  
  // === Sahifa yuklanganda barcha foydalanuvchilarni yuklash ===
  window.onload = loadUsers;
  