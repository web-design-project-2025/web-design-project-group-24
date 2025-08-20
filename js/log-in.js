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

    // debug to console so you can see what's happening
    console.log({
      emailEntered: email,
      passEntered: pass,
      emailMatch: email === TEST_EMAIL,
      passMatch: pass === TEST_PASS,
    });

    if (email === TEST_EMAIL && pass === TEST_PASS) {
      setMsg("✅ Login successful!", "green");
      localStorage.setItem("loggedIn", "true");

      // check for redirect
      const redirectUrl = localStorage.getItem("redirectAfterLogin");

      setTimeout(() => {
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
