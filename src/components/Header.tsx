"use client";

import { FaCameraRetro, FaLocationArrow } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/navigation"; 
import { AccountSearchProps } from "@/types/types";
import { getAccounts } from "@/services/account";

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedAccounts, setFetchedAccounts] = useState<AccountSearchProps[]>([]); // To store API results
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      setShowHistory(false);
      setFetchedAccounts([]); 
      return;
    }

    try {
      const fetchedData = await getAccounts(query);
      setFetchedAccounts(fetchedData); 
      setShowHistory(true);
    } catch (err) {
      setError("Nu s-au putut obtine postari");
      setFetchedAccounts([]); 
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
      setSearchHistory((prev) => [searchQuery.trim(), ...prev.slice(0, 4)]);
    }
    setSearchQuery("");
    setShowHistory(false);
    setFetchedAccounts([]); 
  };

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    router.push(`/${searchQuery.trim()}`);
    setShowHistory(false);
  };

  return (
    <div className="bg-blue-50 h-[40px] w-full border-b border-b-black flex justify-between items-center text-blue-500 py-8 px-2">
      <Link href={"/"}>
        <h1 className="text-3xl font-light">SocialWave</h1>
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
          <div className="absolute mt-1 w-full z-10 bg-white border border-gray-300 rounded-lg shadow-lg">
            {fetchedAccounts.length > 0 ? (
              fetchedAccounts.map((account, index) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleHistoryClick(account.name)}
                >
                  {account.name} {}
                </div>
              ))
            ) : searchHistory.length > 0 ? (
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
  );
}

export default withAuth(Header);
