import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: [],
        currentChatId: null,
    },
    reducers: {
        setChats: (state, action) => {
            const users = action.payload;
            state.chats = users.reduce((acc, user) => {
                acc[user.id] = {
                    ...user,
                    messages: [],
                };
                return acc;
            }, state.chats);
        },

        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },

        appendMessage: (state, action) => {
           const {message, senderId,receiverId,currentChatId} = action.payload;
              if(state.chats[currentChatId]){
                state.chats[currentChatId].messages.push({
                    message,
                    senderId,
                    receiverId,
                });
              }
        }
    },
});

export const { setChats, setCurrentChatId, appendMessage } = chatSlice.actions;

export default chatSlice.reducer;

