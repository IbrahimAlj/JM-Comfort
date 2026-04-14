const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
// Constants for keys 

export async function login({ email, password }) {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: password }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || data.error || "Login failed");
    err.status = res.status;
    throw err;
  }
  const token = btoa(JSON.stringify({ sub: "admin", exp: Date.now() + 60*60*1000 }));
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_user", JSON.stringify({ email }));
  return { token, user: { email } };
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}