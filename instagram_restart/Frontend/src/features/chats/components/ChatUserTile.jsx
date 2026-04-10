import React from 'react'
import './ChatUserTile.scss'

const ChatUserTile = ({ user }) => {
    // agar user undefined ho to crash na ho
    if (!user) return null;

    return (
        <div className="chat-user-tile">
            <img 
                src={user.profilePicture || "/default-avatar.png"} 
                alt={user.username || "user"} 
            />
            <p>{user.username || "Unknown User"}</p>
        </div>
    )
}

export default ChatUserTile