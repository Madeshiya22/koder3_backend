import axios from 'axios';

// 🔹 Axios instance bana rahe hain (base URL + credentials)
const API = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true, // cookies (auth) automatically send hongi
});


// 🔹 Sidebar ke liye - sab chat users laane ke liye
export const getChatUsers = async () => {
    try {
        // API hit ho rahi hai: /chats/users
        const { data } = await API.get("/chats/users");

        // jo data backend se aaya wo return kar diya
        return data;

    } catch (error) {
        // error ko handle karne ke liye common function call
        handleError(error);
    }
};


// 🔹 Specific chat ke users (group ya detail view)
export const getChatUsersByChatId = async (chatId) => {
    try {
        // dynamic route: /chats/:chatId/users
        const { data } = await API.get(`/chats/${chatId}/users`);

        return data;

    } catch (error) {
        handleError(error);
    }
};


// 🔹 Common error handler (baar baar same code likhne se bachne ke liye)
const handleError = (error) => {
    // agar backend se proper error aaya hai to wo print karo
    console.error("API Error:", error?.response?.data || error.message);

    // error ko aage throw kar diya taaki UI handle kar sake
    throw error?.response?.data || error;
};