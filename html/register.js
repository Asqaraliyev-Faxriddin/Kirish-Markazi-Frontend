document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const user = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    repeat_password: document.getElementById("repeat_password").value
  };

  try {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(user)
    });

    const data = await res.json();

    if (!res.ok) {
      document.getElementById("registerResult").innerText = data.message || "Xatolik yuz berdi!";
      return;
    }

    // To‘g‘ridan-to‘g‘ri frontend faylingiz portiga yo‘naltiring
    window.location.href = "http://127.0.0.1:5500/verify.html";

  } catch (err) {
    document.getElementById("registerResult").innerText = "Serverga ulanib bo'lmadi!";
    console.error("Xatolik:", err);
  }
});
