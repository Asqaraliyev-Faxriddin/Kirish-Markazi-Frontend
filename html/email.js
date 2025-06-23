// Foydalanuvchini va roli ADMIN yoki SUPERADMIN ekanini tekshirish
(async () => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    alert("Avval tizimga kiring.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch("https://kirish-markazi-backend.onrender.com/api/user/me", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok || (data.role !== "ADMIN" && data.role !== "SUPERADMIN")) {
      alert("Sizga email yuborish vakolati yo‘q!");
      window.location.href = "users-panel.html";
      return;
    }
  } catch (err) {
    console.error("Xatolik:", err);
    alert("Tizimda muammo. Qaytadan tizimga kiring.");
    window.location.href = "login.html";
  }
})();

// Email yuborish formasi
document.getElementById("emailForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: document.getElementById("toEmail").value,
    matn: document.getElementById("subject").value,
    description: document.getElementById("description").value,
  };

  try {
    const res = await fetch("https://kirish-markazi-backend.onrender.com/auth/send/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    const resultElement = document.getElementById("emailResult");

    if (!res.ok) {
      resultElement.innerText = result.message || "Xatolik yuz berdi!";
      resultElement.style.color = "red";
      return;
    }

    resultElement.innerText = result.message || "Xabar yuborildi!";
    resultElement.style.color = "green";

    setTimeout(() => {
      window.location.href = "users-panel.html";
    }, 3000);

  } catch (err) {
    document.getElementById("emailResult").innerText = "🌐 Serverga ulanib bo‘lmadi!";
    console.error("Xatolik:", err);
  }
});
