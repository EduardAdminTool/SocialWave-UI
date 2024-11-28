"use client";

import Link from "next/link";
import { useState } from "react";
import { VscAccount } from "react-icons/vsc";

export default function MessagesHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query) {
      setShowHistory(true);
    } else {
      setShowHistory(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
      setSearchHistory((prev) => [searchQuery.trim(), ...prev.slice(0, 4)]);
    }
    setSearchQuery(""); // Clear input
    setShowHistory(false);
  };

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    setShowHistory(false);
  };
  return (
    <div className="border-b border-b-black py-3 px-2 flex justify-between bg-blue-50 ">
      <Link href={"/"}>
        <h1 className="text-3xl font-light text-blue-500 ">SocialWave</h1>
      </Link>
      <div className="relative w-[250px]">
        <input
          placeholder="Search"
          value={searchQuery}
          className="border border-black text-center rounded-full h-[40px]"
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
        />
        {showHistory && (
          <div className="absolute mt-1 w-[200px] bg-white border border-gray-300 rounded-lg shadow-lg">
            {searchHistory.length > 0 ? (
              searchHistory.map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleHistoryClick(item)}
                >
                  {item}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500 z-10">
                No recent searches
              </div>
            )}
          </div>
        )}
      </div>

      <VscAccount size={36} />
    </div>
  );
}
