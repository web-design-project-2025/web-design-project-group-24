document.addEventListener("DOMContentLoaded", () => {
  const loginSection = document.getElementById("log-in");
  const profileSection = document.getElementById("profile-info");

  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const remember = document.getElementById("remember-me");
  const msg = document.getElementById("login-msg");

  const profileEmail = document.getElementById("profile-email");
  const profileName = document.getElementById("profile-name");
  const profileImg = document.getElementById("profile-img");
  const profileBio = document.getElementById("profile-bio");

  const logoutBtn = document.getElementById("logout-btn");

  // test creds
  const TEST_EMAIL = "test@example.com";
  const TEST_PASS = "test123";

  function saveSession(session, persist) {
    const store = persist ? localStorage : sessionStorage;
    store.setItem("auth", JSON.stringify(session));
  }

  function loadSession() {
    try {
      const raw =
        sessionStorage.getItem("auth") || localStorage.getItem("auth");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function setMsg(text, ok) {
    if (!msg) return;
    msg.textContent = text;
    msg.style.color = ok ? "var(--blue)" : "var(--red)";
  }

  function setView(isAuthenticated) {
    if (loginSection) loginSection.hidden = isAuthenticated;
    if (profileSection) profileSection.hidden = !isAuthenticated;
  }

  function nameFromEmail(email = "") {
    const base = email.split("@")[0];
    return base
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase() || "");
  }

  function renderProfile(session) {
    const me = loadSession();
    if (!me) {
      setView(false);
      return;
    }
    if (profileEmail) profileEmail.textContent = me.email || "";
    if (
      profileName &&
      (profileName.textContent === "" || !profileName.dataset.locked)
    ) {
      profileName.textContent = me.name || nameFromEmail(me.email);
    }
    setView(true);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // stop page reload

    const email = (emailInput.value || "").trim().toLowerCase();
    const pass = (passwordInput.value || "").trim();

    if (email === TEST_EMAIL && pass === TEST_PASS) {
      setMsg("✅ Login successful!", "green");
      localStorage.setItem("loggedIn", "true");

      saveSession(
        {
          email: email,
          name: nameFromEmail(email),
        },
        !!remember?.checked
      );

      // check for redirect
      const redirectUrl = localStorage.getItem("redirectAfterLogin");

      setTimeout(() => {
        if (redirectUrl) {
          localStorage.removeItem("redirectAfterLogin"); // cleanup
          window.location.href = redirectUrl;
        } else {
          renderProfile();
          form.reset();
        }
      }, 400);
    } else {
      setMsg("❌ Invalid email or password.", false);
    }
  });

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("auth");
    setView(false);
    setMsg("You have been logged out.", true);
    window.location.href = "home.html"; // redirect to home
  });

  renderProfile();
});
