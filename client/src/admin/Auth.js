const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
// Constants for keys 

export async function login({ email, password }) { 
// Fake check for demo (replace with a real API like axios library later)
  await new Promise(r => setTimeout(r, 250)); // delay to simulate network test, can REMOVE when backend is setup
  
  if (email === "admin@example.com" && password === "password123") {
    const fakeJwt = btoa(JSON.stringify({ sub: "admin", exp: Date.now() + 60*60*1000 }));
    localStorage.setItem(TOKEN_KEY, fakeJwt);
    localStorage.setItem(USER_KEY, JSON.stringify({ email }));
    return { token: fakeJwt, user: { email } };
  }
  
  const err = new Error("Invalid email or password");
  err.status = 401;
  throw err;
  
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