"use client";

import { useState, useEffect } from "react";
import { BiMessageRoundedAdd } from "react-icons/bi";
import { FaExclamationCircle } from "react-icons/fa";
import withAuth from "@/utils/withAuth";
import { io, Socket } from "socket.io-client";
import { getChat } from "@/services/chat";
import jwt from "jsonwebtoken";
import { Chat } from "@/types/chat/types";
function Messages() {
  const [dm, setDm] = useState<Chat[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await getChat();
        setDm(response);
        const token = localStorage.getItem("authToken");
        if (token) {
          try {
            const decodedToken = jwt.decode(token);
            const userIdFromToken = decodedToken?.sub;
          } catch (error) {
            console.error("Error decoding token:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, []);

  const [selectedUser, setSelectedUser] = useState<{
    profilePicture: string;
    name: string;
    userId: number;
  } | null>(null);
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

  const joinConversation = (user: {
    profilePicture: string;
    name: string;
    userId: number;
  }) => {
    if (socket) {
      socket.emit("joinChat", user.userId);
      console.log(`Joined chat with user ID: ${user.userId}`);
    }
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (socket && messageText.trim() && selectedUser) {
      const message = {
        senderId: 1,
        receiverId: selectedUser.userId,
        text: messageText,
      };
      socket.emit("sendMessage", message);

      setConversations((prev) => ({
        ...prev,
        [selectedUser.userId]: [
          ...(prev[selectedUser.userId] || []),
          { sender: "me", text: messageText },
        ],
      }));

      setTimeout(() => {
        socket.emit("receiveMessage", {
          senderId: selectedUser.userId,
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
          {dm.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg transition-transform transform hover:scale-95 cursor-pointer ${
                selectedUser?.userId === item.otherUser.userId
                  ? "bg-blue-100 shadow-inner"
                  : "bg-white"
              }`}
              onClick={() => joinConversation(item.otherUser)}
            >
              <div className="w-[60px] h-[60px]">
                <img
                  src={item.otherUser.profilePicture || "/default-avatar.png"}
                  alt={`${item.otherUser.name}'s avatar`}
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{item.otherUser.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col bg-white rounded-lg shadow-lg h-full">
        {selectedUser ? (
          <>
            <div className="flex items-center justify-between p-6 bg-blue-500 text-white rounded-t-lg">
              <span className="text-2xl font-semibold">
                {selectedUser.name}
              </span>
              <FaExclamationCircle size={36} className="cursor-pointer" />
            </div>

            <div className="flex flex-col flex-1 p-6 gap-4 overflow-y-auto bg-gray-50">
              {(conversations[selectedUser.userId] || []).map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-lg shadow-sm ${
                      msg.sender === "me"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
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
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

export default withAuth(Messages);
