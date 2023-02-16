import moment from "moment/moment";
import { useEffect, useRef } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useSocket } from "./Hooks/useSocket";

function App() {
  const { socket } = useSocket("http://localhost:4000");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = useCallback(() => {
    socket.on("server:getMessages", (messages) => {
      setMessages(messages);
    });
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("client:addMessage", {message, hour: Date.now()});
    setMessage("");
    inputRef.current.focus();
  };

  return (
    <div className="container">
      <h1 className="mt-3">RetroChat</h1>
      <div className="col-6 mt-3">
        <form onSubmit={sendMessage}>
          <div className="mb-3">
            <input
              ref={inputRef}
              className="form-control"
              type="text"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoFocus
            />
            <button className="btn btn-primary mt-3 mb-3" type="submit">
              Send
            </button>
          </div>
        </form>
      </div>

      <div className="col-12">
        <ol className="list-group">
          {messages.map((item, i) => (
            <li key={i} className="list-group-item">
              <div className="fw-bold">{item.message}</div>
              {moment(item.hour).format("MMMM Do YYYY, h:mm:ss a")}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default App;
