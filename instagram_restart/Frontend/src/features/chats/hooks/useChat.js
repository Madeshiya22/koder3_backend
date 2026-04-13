import { useDispatch } from 'react-redux';
import { getChatUsers, getChatUsersByChatId } from '../services/chat.api.js';
import { setChats, setCurrentChatId } from '../state/chat.slice.js';

export const useChat = () => {
    const dispatch = useDispatch();

    // 🔹 fetch all chat users
    const fetchChatUsers = async () => {
        try {
            const data = await getChatUsers();

            dispatch(setChats(data.users || data));

        } catch (error) {
            console.error("Error fetching chat users:", error);
        }
    };

    // 🔹 set active chat
    const setActiveChat = (chatId) => {
        dispatch(setCurrentChatId(chatId));
    };

    return {
        fetchChatUsers,
        setActiveChat,
    };
};