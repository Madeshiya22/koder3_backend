import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export async function getStoriesFeed() {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/stories`, {
            withCredentials: true,
        });
        return {
            stories: response.data.stories || [],
            ownStories: response.data.ownStories || [],
        };
    } catch (error) {
        console.error("Error fetching stories:", error);
        throw error;
    }
}

export const getHomeStories = getStoriesFeed;

export async function getStoriesByUser(userId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/stories/${userId}`, {
            withCredentials: true,
        });

        return response.data.stories || [];
    } catch (error) {
        console.error("Error fetching user stories:", error);
        throw error;
    }
}

export async function uploadStory({ storyImage }) {
    try {
        const formData = new FormData();
        formData.append("storyImage", storyImage);

        const response = await axios.post(`${API_BASE_URL}/api/story`, formData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error uploading story:", error);
        throw error;
    }
}