import React from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useChat } from '../hooks/useChat';
import ChatUserTile from '../components/ChatUserTile';
import './Message.scss'


const Messages = () => {
    const {fetchChatUsers} = useChat();
    const chats = useSelector((state) => state.chat.chats);    

    useEffect(() => {
        fetchChatUsers(chatId);
    }, [chatId])

    const chatUsers = object.value(chats)

    if(chatUsers.length === 0){
        return null;
    }

    return (
           <div className="messages-container">
            <div className="sidebar">
                {chatUsers.map((chat) => (
                    <div className="chat-user" key={chat._id}>
                        <ChatUserTile user={chat.followee} />
                    </div>
                ))}
            </div>

            <div className="chat-area">
                {/* Chat messages will go here */}
            </div>
        </div>

    )

}
            

export default Messages