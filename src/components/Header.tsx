"use client";

import { FaCameraRetro, FaLocationArrow } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import withAuth from "@/utils/withAuth";
import { useRouter } from "next/navigation";
import { AccountSearchProps } from "@/types/types";
import { getAccountsName } from "@/services/account";

function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedAccounts, setFetchedAccounts] = useState<AccountSearchProps[]>(
    []
  );
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
      const fetchedData = await getAccountsName(query);
      setFetchedAccounts(fetchedData);
      console.log(fetchedData);
      setShowHistory(true);
    } catch (err) {
      setError("Nu s-au putut obtine postari");
      setFetchedAccounts([]);
    }
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) return;

    const matchedAccount = fetchedAccounts.find(
      (account) => account.name === searchQuery.trim()
    );

    if (!matchedAccount) {
      setError("User not found.");
      return;
    }

    const { userId } = matchedAccount;

    if (!searchHistory.includes(searchQuery.trim())) {
      setSearchHistory((prev) => [searchQuery.trim(), ...prev.slice(0, 4)]);
    }

    router.push(`/account/${userId}`);
    setSearchQuery("");
    setShowHistory(false);
    setFetchedAccounts([]);
  };

  const handleHistoryClick = (query: string, userId: number) => {
    setSearchQuery(query);
    router.push(`/account/${userId}`);
    setShowHistory(false);
  };

  return (
    <div className="bg-blue-50 h-[40px] w-full border-b border-b-black flex justify-between items-center text-blue-500 py-8 px-4">
      <Link href={"/"}>
        <h1 className="text-2xl font-light">SocialWave</h1>
      </Link>
      <div className="relative">
        <input
          placeholder="Search"
          value={searchQuery}
          className="border border-black px-4 rounded-full h-[40px] w-[200px]"
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
        />
        {showHistory && (
          <div className="absolute mt-1 w-[200px] z-10 bg-white border rounded-md border-gray-300 shadow-lg">
            {fetchedAccounts.length > 0 ? (
              fetchedAccounts.map((account, index) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    handleHistoryClick(
                      account.name,
                      fetchedAccounts[index].userId
                    )
                  }
                >
                  {account.name}
                </div>
              ))
            ) : searchHistory.length > 0 ? (
              searchHistory.map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  onClick={() =>
                    handleHistoryClick(
                      item,
                      fetchedAccounts[index]?.userId || 0
                    )
                  }
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
