const BASE_URL = "http://localhost:3001";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const loginUser = async ({ email, password, role }) => {
  await delay(500);

  try {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) throw new Error("Failed to connect to authentication server");

    const users = await response.json();

    const user = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password &&
        u.role === role &&
        u.active
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // mock JWT token
    const fakeToken = btoa(`${user.email}:${Date.now()}`);

    return {
      token: fakeToken,
      role: user.role,
      name: user.name,
      userId: user.id,
      email: user.email,
    };
  } catch (error) {
    throw error;
  }
};