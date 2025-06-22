document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const user = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    repeat_password: document.getElementById("repeat_password").value
  };

  try {
    const res = await fetch("https://kirish-markazi-backend.onrender.com/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById("registerResult").innerText = Array.isArray(data.message)
        ? data.message.join("\n")
        : data.message || "Xatolik yuz berdi!";
      return;
    }

    // ✅ Muvaffaqiyatli bo'lsa, verify sahifasiga aniq yo'naltirish:
    window.location.href = "https://kirish-markazi-frontend.onrender.com/verify.html"; // <-- To‘liq yo‘l

  } catch (err) {
    document.getElementById("registerResult").innerText = "Serverga ulanib bo'lmadi!";
    console.error("Xatolik:", err);
  }
});
