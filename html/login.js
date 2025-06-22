document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };

  const res = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    document.getElementById("loginResult").innerText = result.message || "Login xatolik.";
  } else {
    // Foydalanuvchining access tokenini saqlaymiz
    localStorage.setItem("access_token", result.tokens.accessToken);

    // Agar kerak bo‘lsa refresh token ham saqlanadi
    localStorage.setItem("refresh_token", result.tokens.refreshToken);

    // 3 soniyadan keyin foydalanuvchilar paneliga o‘tamiz
    document.getElementById("loginResult").innerText = "Tizimga muvaffaqiyatli kirdingiz. Yuborilmoqda...";
    setTimeout(() => {
      window.location.href = "users-panel.html";
    }, 3000);
  }
});
