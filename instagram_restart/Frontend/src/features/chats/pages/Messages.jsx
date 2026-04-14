import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import io from "socket.io-client";
import ChatUserTile from "../components/ChatUserTile";
import "./Message.scss";

const URL = "http://localhost:3000";

const Messages = () => {
  const { fetchChatUsers } = useChat();
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);


  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const socketRef = useRef(null);

  // 🔹 SEND MESSAGE
  function handleSendMessage() {
    if (!inputMessage.trim()) return;

    const newMsg = {
      message: inputMessage,
      self: true,
    };

    //  optimistic UI update
    setChatMessages((prev) => [...prev, newMsg]);

    socketRef.current.emit("send_message", {
      chatId: currentChatId,
      message: inputMessage,
    });

    setInputMessage("");
  }

  // 🔹 SOCKET SETUP
  useEffect(() => {
    const socket = io(URL,{
      withCredentials: true,
    });


    socketRef.current = socket;

    socket.once("connect",()=>{
      console.log("Connected to socket server with id: " + socket.id);
    })


    socket.on("connect_error",(data)=>{
      console.error("Connection error:", data);
    })

    socket.on("receive_message", (data) => {
      setChatMessages((prev) => {
        // duplicate avoid
        const exists = prev.find(
          (msg) => msg.message === data.message && msg.self
        );

        if (exists) return prev;

        return [...prev, { ...data, self: false }];
      });
    });

    fetchChatUsers();

    return () => {
      socket.off("receive_message");
      socket.disconnect();
    };
  }, []);

  const chatUsers = Object.values(chats);

  return (
    <div className="messages-container">
      
      {/* 🔹 SIDEBAR */}
      <div className="sidebar">
        {chatUsers.length > 0 ? (
          chatUsers.map((chat) => (
            <ChatUserTile key={chat._id} user={chat} />
          ))
        ) : (
          <p>No conversations</p>
        )}
      </div>

      {/* 🔹 CHAT AREA */}
      <div className="chat-area">
        
        {/* 🔹 MESSAGES */}
        <div className="messages-list">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.self ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  background: msg.self ? "#0095f6" : "#eee",
                  color: msg.self ? "#fff" : "#000",
                  padding: "8px 12px",
                  margin: "5px",
                  borderRadius: "12px",
                  maxWidth: "60%",
                }}
              >
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        {/* 🔹 INPUT */}
        {currentChatId && (
          <div className="input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;