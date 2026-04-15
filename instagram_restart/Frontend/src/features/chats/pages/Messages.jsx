import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import io from "socket.io-client";
import ChatUserTile from "../components/ChatUserTile";
import { getMessagesByUserId } from "../services/chat.api";
import "./Message.scss";

const URL = "http://localhost:3000";

const Messages = () => {
  const { fetchChatUsers } = useChat();
  const chats = useSelector((state) => state.chat.chats);
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const loggedInUserId = useSelector((state) => state.auth.user?._id);


  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const activeChatRef = useRef(currentChatId);
  const loggedInUserIdRef = useRef(loggedInUserId);

  useEffect(() => {
    activeChatRef.current = currentChatId;
  }, [currentChatId]);

  useEffect(() => {
    loggedInUserIdRef.current = loggedInUserId;
  }, [loggedInUserId]);

  //  SEND MESSAGE
  function handleSendMessage() {
    if (!inputMessage.trim() || !currentChatId) return;

    setLoading(true);
    
    const newMsg = {
      message: inputMessage,
      self: true,
    };

    setChatMessages((prev) => [...prev, newMsg]);

    socketRef.current.emit("send_message", {
      receiver: currentChatId,
      message: inputMessage,
    });

    setInputMessage("");
  }

  //  SOCKET SETUP
  useEffect(() => {
    const socket = io(URL, { withCredentials: true });
    socketRef.current = socket;

    socket.once("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("connect_error", (data) => {
      console.error("Connection error:", data);
    });

    //  Message receive karo
    socket.on("receive_message", (data) => {
      const activeChatId = activeChatRef.current;
      const currentUserId = loggedInUserIdRef.current;
      const isForActiveChat =
        String(data.sender) === String(activeChatId) ||
        String(data.receiver) === String(activeChatId);

      if (!isForActiveChat) {
        return;
      }

      setChatMessages((prev) => {
        const exists = prev.find((msg) => msg._id === data._id);
        if (exists) return prev;
        return [
          ...prev,
          { ...data, self: String(data.sender) === String(currentUserId) },
        ];
      });
    });

    //  Confirmation krna(when message saved successfully)
    socket.on("message_sent", (data) => {
      setChatMessages((prev) => 
        prev.map((msg) => 
          msg.message === data.message && msg.self 
            ? { ...msg, _id: data._id, createdAt: data.createdAt }
            : msg
        )
      );
      setLoading(false);
    });

    //  Error handling
    socket.on("message_error", (error) => {
      console.error("Message error:", error);
      setLoading(false);
      alert("Message send failed!");
    });

    fetchChatUsers();

    return () => {
      socket.off("receive_message");
      socket.off("message_sent");
      socket.off("message_error");
      socket.disconnect();
    };
  }, []);  // Remove currentChatId dependency issue

  useEffect(() => {
    const loadMessages = async () => {
      if (!currentChatId || !loggedInUserId) {
        setChatMessages([]);
        return;
      }

      try {
        const data = await getMessagesByUserId(currentChatId);
        const formattedMessages = (data.messages || []).map((msg) => ({
          ...msg,
          self: String(msg.sender) === String(loggedInUserId),
        }));

        setChatMessages(formattedMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
        setChatMessages([]);
      }
    };

    loadMessages();
  }, [currentChatId, loggedInUserId]);

  const chatUsers = Object.values(chats);

  return (
    <div className="messages-container">
      
      {/*  SIDEBAR */}
      <div className="sidebar">
        {chatUsers.length > 0 ? (
          chatUsers.map((chat) => (
            <ChatUserTile key={chat._id} user={chat} />
          ))
        ) : (
          <p>No conversations</p>
        )}
      </div>

      {/*  CHAT AREA */}
      <div className="chat-area">
        
        {/*  MESSAGES */}
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

        {/*  INPUT */}
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