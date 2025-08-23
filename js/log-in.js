document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const msg = document.getElementById("login-msg");

  // 🔑 hardcoded test creds
  const TEST_EMAIL = "test@example.com";
  const TEST_PASS = "test123";

  function setMsg(text, ok) {
    if (!msg) return;
    msg.textContent = text;
    msg.style.color = ok ? "green" : "red";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page reload

    const email = (emailInput.value || "").trim().toLowerCase();
    const pass = (passwordInput.value || "").trim();

    if (email === TEST_EMAIL && pass === TEST_PASS) {
      setMsg("✅ Login successful!", true);
      localStorage.setItem("loggedIn", "true");

      // check for redirect
      const redirectUrl = localStorage.getItem("redirectAfterLogin");

      setTimeout(() => {
        const url =
          localStorage.getItem("redirectAfterLogin") || "profile-page.html";
        localStorage.removeItem("redirectAfterLogin"); // cleanup
        window.location.replace(url);
        if (redirectUrl) {
          localStorage.removeItem("redirectAfterLogin"); // cleanup
          window.location.href = redirectUrl;
        } else {
          window.location.href = "home.html"; // default
        }
      }, 400);
    } else {
      setMsg("❌ Invalid email or password.", false);
    }
  });
});
