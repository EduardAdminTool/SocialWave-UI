"use client";

import { useState } from "react";
import { BiMessageRoundedAdd } from "react-icons/bi";
import { FaExclamationCircle } from "react-icons/fa";

export default function Messages() {
  const dm = [
    {
      logo: "L1",
      name: "name1",
      message: "message1",
    },
    {
      logo: "L2",
      name: "name2",
      message: "message2",
    },
    {
      logo: "L3",
      name: "name3",
      message: "message3",
    },
    {
      logo: "L4",
      name: "name4",
      message: "message4",
    },
    {
      logo: "L5",
      name: "name5",
      message: "message5",
    },
    {
      logo: "L6",
      name: "name6",
      message: "message6",
    },
  ];

  const [selectedUser, setSelectedUser] = useState(dm[0]);

  return (
    <div className="grid grid-cols-2 px-8 py-12">
      <div className="flex-col flex">
        <div className="flex items-center border border-b-black justify-between p-4">
          <span className="text-2xl">Direct</span>
          <BiMessageRoundedAdd size={36} />
        </div>
        <div className="flex flex-col py-4 gap-4 text-xl border border-b-black px-4 cursor-pointer">
          {dm.map((item) => (
            <div
              className={`flex items-center gap-4 border-b border-b-black py-4 hover:scale-95 ${
                selectedUser.name === item.name ? "bg-blue-100" : ""
              }`}
              key={item.name}
              onClick={() => setSelectedUser(item)}
            >
              <div className="bg-black rounded-full w-[80px] h-[80px] flex justify-center items-center text-white">
                {item.logo}
              </div>
              <div className="flex flex-col">
                <span>{item.name}</span>
                <span className="truncate">{item.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="border border-b-black p-4 flex justify-between items-center">
          <span className="text-2xl">{selectedUser.name}</span>
          <FaExclamationCircle size={36} />
        </div>
        <div className="border border-b-black p-4 flex flex-col gap-4 h-[400px] overflow-y-auto">
          <div className="flex gap-4 items-start">
            <div className="bg-black rounded-full w-[60px] h-[60px] flex justify-center items-center text-white">
              {selectedUser.logo}
            </div>
            <div className="bg-gray-200 px-4 py-2 rounded-lg">
              {selectedUser.message}
            </div>
          </div>
        </div>
        <div className="border text-center py-4 h-auto border-b-black text-xl flex px-4 justify-between items-center">
          <input
            placeholder="Type a message..."
            className="px-4 w-[500px] h-[50px] border border-black rounded-full"
          />
          <button className="bg-blue-500 h-[50px] text-white px-4 py-2 mt-2 rounded-full">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
