"use client";

import { FaCameraRetro, FaLocationArrow } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
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
    <div>
      <div className="bg-blue-50 h-[40px] w-full border-b border-b-black flex justify-between items-center text-blue-500 py-8 px-4">
        <Link href={"/"}>
          <h1 className="text-3xl font-light">SocialWave</h1>
        </Link>
        <div className="relative w-[250px]">
          <input
            placeholder="Search"
            value={searchQuery}
            className="border border-black w-full text-center rounded-full h-[40px]"
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
          />
          {showHistory && (
            <div className="absolute mt-1 w-full z-10 bg-white border border-gray-300 rounded-lg shadow-lg">
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
                <div className="px-4 py-2 text-sm text-gray-500">
                  No recent searches
                </div>
              )}
            </div>
          )}
        </div>
        <Link href="/messages" className="group">
          <div className="transition-all duration-300 ease-in-out transform group-hover:scale-110">
            <FaLocationArrow
              size={36}
              className="transition-colors duration-300 ease-in-out group-hover:text-blue-600"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
