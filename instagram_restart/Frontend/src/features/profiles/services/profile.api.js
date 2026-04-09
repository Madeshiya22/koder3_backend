import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

/**
 * Get user profile with stats
 */
export async function getUserProfileData({ userId }) {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/profiles/${userId}`,
            { withCredentials: true }
        );
        return response.data.user;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

/**
 * Get user's posts with pagination
 */
export async function getUserPosts({ userId, page = 1, limit = 12 }) {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/profiles/${userId}/posts`,
            {
                params: { page, limit },
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching posts:", error);
        throw error;
    }
}

/**
 * Get user's videos with pagination
 */
export async function getUserVideos({ userId, page = 1, limit = 12 }) {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/profiles/${userId}/videos`,
            {
                params: { page, limit },
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching videos:", error);
        throw error;
    }
}

/**
 * Get current user's bookmarked posts
 */
export async function getBookmarkedPosts({ page = 1, limit = 12 }) {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/profiles/current/bookmarks`,
            {
                params: { page, limit },
                withCredentials: true
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        throw error;
    }
}

/**
 * Bookmark a post
 */
export async function bookmarkPost({ postId }) {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/api/profiles/${postId}/bookmark`,
            {},
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("Error bookmarking post:", error);
        throw error;
    }
}

/**
 * Remove bookmark from post
 */
export async function removeBookmark({ postId }) {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/api/profiles/${postId}/bookmark`,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        console.error("Error removing bookmark:", error);
        throw error;
    }
}

/**
 * Check if post is bookmarked
 */
export async function isPostBookmarked({ postId }) {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/profiles/${postId}/is-bookmarked`,
            { withCredentials: true }
        );
        return response.data.isBookmarked;
    } catch (error) {
        console.error("Error checking bookmark status:", error);
        return false;
    }
}
