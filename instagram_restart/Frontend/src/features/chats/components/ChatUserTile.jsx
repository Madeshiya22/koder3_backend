import React from 'react';
import { useChat } from '../hooks/useChat';
import './ChatUserTile.scss';

const ChatUserTile = ({ user }) => {
    const { setActiveChat } = useChat();

    if (!user) return null;

    function handleClick() {
        setActiveChat(user._id); 
    }

    return (
        <button className="chat-user-tile" onClick={handleClick}>
            <div className="chat-user-avatar">
                <img
                    src={user.profilePicture || "/default-avatar.png"}
                    alt={user.username || "user"}
                />
            </div>

            <div className="chat-user-info">
                <p className="chat-user-name">
                    {user.username || "Unknown User"}
                </p>
                <span className="chat-user-subtext">
                    Tap to view chat
                </span>
            </div>
        </button>
    );
};

export default ChatUserTile;