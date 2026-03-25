import { useState, useEffect } from "react";
import "../styles/app.scss";
import { connectSocket, addListener, emitEvent } from "../services/app.socket.js";

function App() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleSend = (e) => {
    e.preventDefault();

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: inputValue, isIncoming: false },
    ]);
    emitEvent("hero", inputValue);

    setInputValue("");
  };

  useEffect(() => {
    connectSocket();
    addListener("message", (msg) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: msg, isIncoming: true },
      ]);
    });
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Chat Interface</h1>
      </header>

      <main className="chat-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-row ${message.isIncoming ? "incoming" : "outgoing"}`}
          >
            <div className="message-bubble">
              <p>{message.text}</p>
            </div>
          </div>
        ))}
      </main>

      <footer className="footer">
        <form onSubmit={handleSend} className="chat-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
          />
          <button type="submit">Send</button>
        </form>
      </footer>
    </div>
  );
}

export default App;
