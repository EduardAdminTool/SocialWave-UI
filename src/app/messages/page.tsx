"use client";

import { useState, useEffect } from "react";
import { BiMessageRoundedAdd } from "react-icons/bi";
import { FaExclamationCircle } from "react-icons/fa";
import withAuth from "@/utils/withAuth";
import { io, Socket } from "socket.io-client";
import { getChat } from "@/services/chat";
import jwt from "jsonwebtoken";
import { Chat } from "@/types/chat/types";
import { calculateDateDifference } from "@/utils/calculateDate";
function Messages() {
  const [dm, setDm] = useState<Chat[]>([]);
  const [selectedUser, setSelectedUser] = useState<{
    profilePicture: string;
    name: string;
    userId: number;
  } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<
    { sender: string; text: string; senderVerify: string }[]
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [chat, setChat] = useState<number | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await getChat();
        setDm(response);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const decodedToken = jwt.decode(token);
          const userIdFromToken = decodedToken?.sub || null;
          setToken(userIdFromToken);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      } else {
        setToken(null);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    const socketConnection = io("ws://localhost:3001/chat");
    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      setIsConnected(true);
    });
    socketConnection.on("receiveMessages", (messages) => {
      setConversations(messages);
    });
    socketConnection.on("receiveMessage", (message) => {
      if (message[0].senderId !== token) {
        setConversations((prev) => [
          ...prev,
          { sender: "other", text: message[0].text, senderVerify: "other" },
        ]);
      }
    });

    socketConnection.on("disconnect", () => {
      console.log("Disconnected from server");
      setIsConnected(false);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [token]);
  useEffect(() => {
    if (socket) {
      socket.on("receiveTyping", (data) => {
        // Only show "is typing" if the sender is not the current user
        if (data.senderId !== token) {
          console.log(`${data.senderId} is typing...`);
          setIsTyping(true);
        }
      });

      socket.on("receiveStopTyping", (data) => {
        // Stop showing "is typing" only if the sender is not the current user
        if (data.senderId !== token) {
          console.log(`${data.senderId} stopped typing.`);
          setIsTyping(false);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("receiveTyping");
        socket.off("receiveStopTyping");
      }
    };
  }, [socket, token]);

  const sendTyping = () => {
    if (socket && selectedUser) {
      socket.emit("typing", {
        senderId: token,
        receiverId: selectedUser.userId,
        chatId: chat,
      });
    }
  };

  const stopTyping = () => {
    if (socket && selectedUser) {
      socket.emit("stopTyping", {
        senderId: token,
        receiverId: selectedUser.userId,
        chatId: chat,
      });
    }
  };

  const receiveTyping = () => {
    if (socket) {
      socket.on("receiveTyping", (data) => {
        console.log(data);
      });
    }
  };

  const receiveStopTyping = () => {
    if (socket) {
      socket.on("receiveStopTyping", (data) => {
        console.log(data);
      });
    }
  };

  const joinConversation = (
    user: { profilePicture: string; name: string; userId: number },
    chatId: number
  ) => {
    if (socket) {
      socket.emit("joinChat", { chatId, token });
    }
    setSelectedUser(user);
    setChat(chatId);
  };
  const handleMessageTextChange = (e) => {
    setMessageText(e.target.value);
    if (e.target.value) {
      sendTyping();
    } else {
      stopTyping();
    }
  };
  const handleSendMessage = () => {
    if (socket && messageText.trim() && selectedUser) {
      const message = {
        senderId: token,
        receiverId: selectedUser.userId,
        chatId: chat,
        text: messageText,
      };

      socket.emit("sendMessage", message);

      setConversations((prev) => [
        ...prev,
        { sender: "me", text: messageText, senderVerify: "sendByMe" },
      ]);

      setMessageText("");
      setIsTyping(false);
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);

    if (e.target.value) {
      sendTyping();
    } else {
      stopTyping();
    }
  };

  return (
    <div className="grid grid-cols-2 px-8 py-12 bg-blue-50 h-screen gap-8">
      <div className="flex flex-col bg-white rounded-lg shadow-lg h-full">
        <div className="flex items-center justify-between p-6 bg-blue-500 text-white rounded-t-lg">
          <span className="text-2xl font-semibold">Direct</span>
          <BiMessageRoundedAdd size={36} className="cursor-pointer" />
        </div>

        <div className="flex flex-col py-4 gap-4 text-lg overflow-y-auto px-4">
          {dm.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg transition-transform transform hover:scale-95 cursor-pointer ${
                selectedUser?.userId === item.otherUser.userId
                  ? "bg-blue-100 shadow-inner"
                  : "bg-white"
              }`}
              onClick={() => joinConversation(item.otherUser, item.chatId)}
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
                <span className="text-sm text-gray-500">
                  {item.lastMessage.text}
                  <span className="text-xs text-gray-400">
                    {" "}
                    - {calculateDateDifference(item.lastMessage.createdAt)}
                  </span>
                </span>
                <span className="text-xs text-gray-400">
                  {item.lastMessage.senderId === item.otherUser.userId
                    ? "Received"
                    : "Sent"}
                </span>
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
              {conversations.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "me" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "me" && (
                    <div
                      className={`px-4 py-3 rounded-lg shadow-sm max-w-[75%] bg-blue-500 text-white`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {msg.sender === "other" && (
                    <div className="flex gap-2">
                      <div className="w-[40px] h-[40px] ml-3">
                        <img
                          src={
                            selectedUser.profilePicture || "/default-avatar.png"
                          }
                          alt={`${selectedUser.name}'s avatar`}
                          className="rounded-full w-full h-full object-cover"
                        />
                      </div>
                      <div
                        className={`px-4 py-3 rounded-lg shadow-sm max-w-[75%] bg-gray-200 text-black"`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="text-gray-500 text-sm italic">
                  {selectedUser?.name} is typing...
                </div>
              )}
            </div>

            <div className="flex items-center p-6 bg-gray-100 rounded-b-lg">
              <input
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-300"
                value={messageText}
                onChange={handleTyping}
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
