import axios from "axios";

export async function register({ username, fullname, email, password }) {
  try {
    const responmse = awaitaxios.post(
      "http:localhost:3000/api/auth/register",
      {
        username,
        fullname,
        email,
        password,
      },
      { withCredentials: true },
    );
    return responmse.data;
  } catch (error) {
    console.error("Registration failed", error);
    throw error;
  }
}
