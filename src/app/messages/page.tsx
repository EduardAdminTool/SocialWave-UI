"use client";

import { useState } from "react";
import { BiMessageRoundedAdd } from "react-icons/bi";
import { FaExclamationCircle } from "react-icons/fa";

export default function Messages() {
  const dm = [
    { logo: "L1", name: "name1", message: "message1" },
    { logo: "L2", name: "name2", message: "message2" },
    { logo: "L3", name: "name3", message: "message3" },
    { logo: "L4", name: "name4", message: "message4" },
    { logo: "L5", name: "name5", message: "message5" },
    { logo: "L6", name: "name6", message: "message6" },
  ];

  const [selectedUser, setSelectedUser] = useState(dm[0]);

  return (
    <div className="grid grid-cols-2 px-8 py-12 bg-blue-50 h-screen gap-8">
      {/* Sidebar */}
      <div className="flex flex-col bg-white rounded-lg shadow-lg h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-blue-500 text-white rounded-t-lg">
          <span className="text-2xl font-semibold">Direct</span>
          <BiMessageRoundedAdd size={36} className="cursor-pointer" />
        </div>
        {/* Contacts List */}
        <div className="flex flex-col py-4 gap-4 text-lg overflow-y-auto">
          {dm.map((item) => (
            <div
              key={item.name}
              className={`flex items-center gap-4 p-4 rounded-lg transition-transform transform hover:scale-95 cursor-pointer ${
                selectedUser.name === item.name
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
                <span className="truncate text-gray-500">{item.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col bg-white rounded-lg shadow-lg h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-blue-500 text-white rounded-t-lg">
          <span className="text-2xl font-semibold">{selectedUser.name}</span>
          <FaExclamationCircle size={36} className="cursor-pointer" />
        </div>
        {/* Messages */}
        <div className="flex flex-col flex-1 p-6 gap-4 overflow-y-auto bg-gray-50">
          <div className="flex gap-4 items-start">
            <div className="bg-blue-500 rounded-full w-[50px] h-[50px] flex justify-center items-center text-white text-lg font-bold">
              {selectedUser.logo}
            </div>
            <div className="bg-gray-200 px-4 py-3 rounded-lg shadow-sm">
              {selectedUser.message}
            </div>
          </div>
        </div>
        {/* Message Input */}
        <div className="flex items-center p-6 bg-gray-100 rounded-b-lg">
          <input
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button className="ml-4 bg-blue-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:bg-blue-600 transition">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
