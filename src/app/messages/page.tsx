"use client";

import React, { useState, useEffect, useRef } from "react";
import { BiMessageRoundedAdd } from "react-icons/bi";
import { FaExclamationCircle } from "react-icons/fa";
import withAuth from "@/utils/withAuth";
import { io, Socket } from "socket.io-client";
import { getChat } from "@/services/chat";
import jwt from "jsonwebtoken";
import { Chat } from "@/types/chat/types";
import { calculateDateDifference } from "@/utils/calculateDate";
import { MessagesType } from "@/types/chat/types";
import { getChatPage } from "@/services/chat";

function Messages() {
  const [dm, setDm] = useState<Chat[]>([]);
  const [selectedUser, setSelectedUser] = useState<{
    profilePicture: string;
    name: string;
    userId: number;
  } | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState<MessagesType[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [chat, setChat] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesStartRef = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState<number>(1);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);

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

    socketConnection.on("receiveMessage", (message) => {
      setConversations((prev) => {
        const isMessageExist = prev.some(
          (msg) =>
            msg.chatId === message[0].chatId && msg.text === message[0].text
        );
        if (!isMessageExist) {
          return [...prev, message[0]];
        }
        return prev;
      });
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
        if (data.senderId !== token) {
          setIsTyping(true);
        }
      });

      socket.on("receiveStopTyping", (data) => {
        if (data.senderId !== token) {
          setIsTyping(false);
        }
      });

      socket.on("receiveMessages", (response) => {
        if (Array.isArray(response.messages)) {
          setConversations((prevConversations) => {
            const reversedMessages = [...response.messages].reverse();
            if (
              JSON.stringify(prevConversations) !==
              JSON.stringify(reversedMessages)
            ) {
              return reversedMessages;
            }
            return prevConversations;
          });
          setHasMoreMessages(response.hasMore);
        } else {
          console.error("Received messages is not an array", response);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("receiveTyping");
        socket.off("receiveStopTyping");
        socket.off("receiveMessages");
      }
    };
  }, [socket, token]);

  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const joinConversation = async (
    user: { profilePicture: string; name: string; userId: number },
    chatId: number
  ) => {
    if (socket) {
      socket.emit("joinChat", { chatId, token });
    }
    setSelectedUser(user);
    setChat(chatId);
    setConversations([]);
    setPage(0);
    setHasMoreMessages(true);
  };

  const handleSendMessage = () => {
    if (socket && messageText.trim() && selectedUser && chat != null) {
      const message = {
        senderId: Number(token),
        receiverId: selectedUser.userId,
        text: messageText,
        chatId: chat,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isRead: false,
      };

      socket.emit("sendMessage", message);

      setConversations((prev) => [message, ...prev]);
      setMessageText("");
      stopTyping();
      scrollToBottom();
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);

    if (e.target.value) {
      sendTyping();
    } else {
      stopTyping();
    }
  };

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const loadMoreMessages = async () => {
    if (isLoadingMore || !hasMoreMessages || !chat) return;

    setIsLoadingMore(true);
    try {
      const nextPage = page + 1;
      const response = await getChatPage(chat, nextPage);
      if (response.messages.length > 0) {
        setConversations((prevMessages) => [
          ...prevMessages,
          ...response.messages,
        ]);
        setPage(nextPage);
      }
      setHasMoreMessages(response.hasMore);
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMoreMessages && !isLoadingMore) {
        loadMoreMessages();
      }
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (observer && messagesStartRef.current) {
      observer.observe(messagesStartRef.current);
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [hasMoreMessages, isLoadingMore, loadMoreMessages]);

  return (
    <div className="grid grid-cols-2 px-8 py-12 bg-blue-50 h-screen gap-8">
      <div className="flex flex-col bg-white rounded-lg shadow-lg h-[90vh]">
        <div className="flex items-center justify-between p-6 bg-blue-500 text-white rounded-t-lg">
          <span className="text-2xl font-semibold">Direct</span>
          <BiMessageRoundedAdd size={36} className="cursor-pointer" />
        </div>

        <div className="flex-1 flex flex-col py-4 gap-4 text-lg overflow-y-auto px-4">
          {dm.map((item, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all cursor-pointer ${
                selectedUser?.userId === item.otherUser.userId
                  ? "bg-blue-100 shadow-inner border-2 border-blue-500"
                  : "bg-white"
              } hover:bg-blue-50`}
              onClick={() => joinConversation(item.otherUser, item.chatId)}
            >
              <div className="w-[60px] h-[60px] flex-shrink-0">
                <img
                  src={item.otherUser.profilePicture || "/default-avatar.png"}
                  alt={`${item.otherUser.name}'s avatar`}
                  className="rounded-full w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col flex-grow">
                <span className="font-medium">{item.otherUser.name}</span>
                {item.lastMessage ? (
                  <>
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
                  </>
                ) : (
                  <span className="text-sm text-gray-500 italic">
                    No messages yet
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col bg-white rounded-lg shadow-lg h-[90vh]">
        {selectedUser ? (
          <>
            <div className="flex items-center justify-between p-6 bg-blue-500 text-white rounded-t-lg">
              <span className="text-2xl font-semibold">
                {selectedUser.name}
              </span>
              <FaExclamationCircle size={36} className="cursor-pointer" />
            </div>

            <div className="flex-1 flex flex-col-reverse p-6 gap-4 overflow-y-auto bg-gray-50 transition-all duration-300 ease-in-out">
              <div ref={messagesEndRef} />
              {Array.isArray(conversations) && conversations.length > 0 ? (
                conversations.map((msg, index) => (
                  <div
                    key={index}
                    className={`group flex ${
                      msg.senderId == Number(token)
                        ? "justify-end"
                        : "justify-start"
                    } relative`}
                  >
                    {msg.senderId === Number(token) && (
                      <div className="relative px-4 py-3 rounded-lg shadow-sm max-w-[75%] bg-blue-500 text-white">
                        {msg.text}
                        <span className="absolute mr-4 whitespace-nowrap right-full top-1/2 transform -translate-y-1/2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          {calculateDateDifference(
                            new Date(msg.createdAt).toLocaleString()
                          )}
                        </span>
                      </div>
                    )}

                    {msg.receiverId === Number(token) && (
                      <div className="flex gap-2">
                        <div className="w-[40px] h-[40px] ml-3">
                          <img
                            src={
                              selectedUser?.profilePicture ||
                              "/default-avatar.png"
                            }
                            alt={`${selectedUser?.name}'s avatar`}
                            className="rounded-full w-full h-full object-cover"
                          />
                        </div>
                        <div className="relative px-4 py-3 rounded-lg shadow-sm max-w-[75%] bg-gray-200 text-black">
                          {msg.text}
                          <span className="absolute ml-4 whitespace-nowrap left-full top-1/2 transform -translate-y-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            {calculateDateDifference(
                              new Date(msg.createdAt).toLocaleString()
                            )}
                          </span>
                          {msg.isRead && index == 0 && (
                            <span className="absolute bottom-0 right-0 flex">
                              {msg.isRead && index === 0 ? (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5 text-blue-500"
                                  >
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                  </svg>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5 text-blue-500 -ml-3"
                                  >
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                  </svg>
                                </>
                              ) : (
                                <>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5 text-gray-400"
                                  >
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                  </svg>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-5 h-5 text-gray-400 -ml-3"
                                  >
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                  </svg>
                                </>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No messages yet.</div>
              )}
              {isLoadingMore && (
                <div className="text-center text-gray-500">
                  Loading more messages...
                </div>
              )}
              <div ref={messagesStartRef} />
            </div>
            {isTyping && (
              <div className="p-2 bg-gray-100 text-gray-500 text-sm italic">
                {selectedUser?.name} is typing...
              </div>
            )}
            <div className="flex items-center p-6 bg-gray-100 rounded-b-lg">
              <input
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-300"
                value={messageText}
                onChange={handleTyping}
                onKeyDown={handleKeyDown}
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
