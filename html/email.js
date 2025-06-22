// Har bir fayl boshida qo‘shing:

async function fetchWithAuth(url, options = {}) {
  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    // Sessiya tugagan yoki token xato
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    alert("Sessiyangiz tugadi, iltimos qaytadan tizimga kiring.");
    window.location.href = "login.html";
    return Promise.reject(new Error("Unauthorized"));
  }

  return res;
}



document.getElementById("emailForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: document.getElementById("toEmail").value,
    matn: document.getElementById("subject").value,
    description: document.getElementById("description").value,
  };

  try {
    const res = await fetch("http://localhost:3000/auth/send/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
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

    // ✅ Email muvaffaqiyatli yuborildi
    resultElement.innerText = result.message || "Xabar yuborildi!";
    resultElement.style.color = "green";

    // ⏳ 3 sekunddan keyin boshqa sahifaga yo‘naltirish
    setTimeout(() => {
      window.location.href = "login.html";
    }, 3000);

  } catch (err) {
    document.getElementById("emailResult").innerText = "Serverga ulanib bo‘lmadi!";
    console.error("Xatolik:", err);
  }
});
