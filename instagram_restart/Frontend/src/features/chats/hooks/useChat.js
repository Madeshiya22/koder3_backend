import { useDispatch } from 'react-redux';
import { getChatUsers } from '../services/chat.api.js';
import { setChats } from '../state/chat.slice.js';

export const useChat = () => {
    const dispatch = useDispatch();

    const fetchChatUsers = async () => {
        try {
            const data = await getChatUsers();

            // agar backend direct array bhej raha hai
            dispatch(setChats(data));

            // agar structure ho { users: [...] }
            // dispatch(setChats(data.users));

        } catch (error) {
            console.error("Error fetching chat users:", error);
        }
    };

    return {
        fetchChatUsers
    };
};