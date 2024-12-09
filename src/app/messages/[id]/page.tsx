"use client";

import { useState, useEffect } from "react";
import { BiMessageRoundedAdd } from "react-icons/bi";
import { FaExclamationCircle } from "react-icons/fa";
import withAuth from "@/utils/withAuth";
import { io, Socket } from "socket.io-client";

function Messages() {
  const dm = [
    { logo: "L1", name: "name1", id: 2 },
    { logo: "L2", name: "name2", id: 3 },
    { logo: "L3", name: "name3", id: 4 },
    { logo: "L4", name: "name4", id: 5 },
    { logo: "L5", name: "name5", id: 6 },
    { logo: "L6", name: "name6", id: 7 },
  ];

  const [selectedUser, setSelectedUser] = useState(dm[0]);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<{
    [key: number]: { sender: string; text: string }[];
  }>({});
  const [messageText, setMessageText] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketConnection = io("ws://localhost:3001/chat");
    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log("Connected to server");
      setIsConnected(true);
      socketConnection.emit("joinChat", 1);
    });

    socketConnection.on("receiveMessage", (message) => {
      console.log("Received message:", message);
      setConversations((prev) => ({
        ...prev,
        [message.senderId]: [
          ...(prev[message.senderId] || []),
          { sender: "other", text: message.text },
        ],
      }));
    });

    socketConnection.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (socket && messageText.trim()) {
      const message = {
        senderId: 1,
        receiverId: selectedUser.id,
        text: messageText,
      };
      socket.emit("sendMessage", message);

      setConversations((prev) => ({
        ...prev,
        [selectedUser.id]: [
          ...(prev[selectedUser.id] || []),
          { sender: "me", text: messageText },
        ],
      }));

      setTimeout(() => {
        socket.emit("receiveMessage", {
          senderId: selectedUser.id,
          text: `Echo: ${messageText}`,
        });
      }, 500);

      setMessageText("");
    }
  };

  return (
    <div className="grid grid-cols-2 px-8 py-12 bg-blue-50 h-screen gap-8">
      <div className="flex flex-col bg-white rounded-lg shadow-lg h-full">
        <div className="flex items-center justify-between p-6 bg-blue-500 text-white rounded-t-lg">
          <span className="text-2xl font-semibold">Direct</span>
          <BiMessageRoundedAdd size={36} className="cursor-pointer" />
        </div>

        <div className="flex flex-col py-4 gap-4 text-lg overflow-y-auto">
          {dm.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-transform transform hover:scale-95 cursor-pointer ${
                selectedUser.id === item.id
                  ? "bg-blue-100 shadow-inner"
                  : "bg-white"
              }`}
              onClick={() => setSelectedUser(item)}
            >
              <div className="bg-blue-500 rounded-full w-[60px] h-[60px] flex justify-center items-center text-white text-lg font-bold">
                {item.logo}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col bg-white rounded-lg shadow-lg h-full">
        <div className="flex items-center justify-between p-6 bg-blue-500 text-white rounded-t-lg">
          <span className="text-2xl font-semibold">{selectedUser.name}</span>
          <FaExclamationCircle size={36} className="cursor-pointer" />
        </div>

        <div className="flex flex-col flex-1 p-6 gap-4 overflow-y-auto bg-gray-50">
          {(conversations[selectedUser.id] || []).map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-3 rounded-lg shadow-sm ${
                  msg.sender === "me" ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center p-6 bg-gray-100 rounded-b-lg">
          <input
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-300"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button
            className="ml-4 bg-blue-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:bg-blue-600 transition"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Messages);
