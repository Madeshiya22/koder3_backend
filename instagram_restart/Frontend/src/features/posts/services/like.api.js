import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export async function likePost(postId) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/posts/${postId}/like`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
}

export async function unlikePost(postId) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/posts/${postId}/unlike`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error("Error unliking post:", error);
    throw error;
  }
}
