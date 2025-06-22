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
        Authorization: `Bearer ${localStorage.getItem("access_token")}`
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
      window.location.href = "login.html";
    }, 3000);

  } catch (err) {
    document.getElementById("emailResult").innerText = "Serverga ulanib bo'lmadi!";
    console.error("Xatolik:", err);
  }
});
