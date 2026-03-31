import axios from "axios";

export async function register({ username, fullname, email, password }) {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/register",
      {
        username,
        fullname,
        email,
        password,
      },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
}

export async function login({ username, email, password }) {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/login",
      {
        username,
        email,
        password,
      },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error(
      "Login failed:",
      error.response?.data?.message || error.message
    );
    throw error;
  }
}