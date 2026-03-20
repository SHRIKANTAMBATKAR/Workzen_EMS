import api from "./api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const loginUser = async ({ email, password, role }) => {
  await delay(500);

  try {
    const response = await api.post("/auth/login", { email, password });
    const user = response.data;

    // Based on the Java backend, the LoginResponseDTO returns:
    // id, name, email, role, active, message
    
    // The backend does not actually verify the provided 'role' against the login attempt directly here except in controller mapping,
    // so we verify that the returned role matches the requested one, and that active is true.
    if (!user || user.message === "Invalid email or password") {
      throw new Error("Invalid credentials");
    }
    
    if (user.role !== role || !user.active) {
      throw new Error("Invalid role or inactive account");
    }

    return {
      token: user.token, // Use real JWT from backend
      role: user.role,
      name: user.name,
      userId: String(user.id),
      email: user.email,
    };
  } catch (error) {
    throw error;
  }
};