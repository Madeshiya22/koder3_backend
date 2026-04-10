import {createSlice} from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: [],
        currentChatId: null,
    },
    reducers: {
        setChats: (state, action) => {
            state.chats = action.payload;
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload;
        },
    },
});

export const {setChats, setCurrentChatId} = chatSlice.actions;

export default chatSlice.reducer;