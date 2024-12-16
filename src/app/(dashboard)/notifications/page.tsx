"use client";

import { useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { Button } from "@/components/ui/button";
import withAuth from "@/utils/withAuth";
import { getFollows } from "@/services/follow";
import { FollowRequestsProps } from "@/types/types";
import NotificationModal from "@/components/NotificationModal";
function Notifications() {
  const [followClicked, setIsFollowClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [FollowRequestNumber, setFollowRequestNumber] = useState<
    FollowRequestsProps[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const handleFollowButton = () => {
    setIsFollowClicked(!followClicked);
  };

  useEffect(() => {
    fetchFollows();
    // fetchFollowersFollowing();
  }, []);

  // const fetchFollowersFollowing = async () => {
  //   const fetchedFollowers = await getFollowers();
  //   const fetchedFollowing = await getFollowing();
  // };

  const fetchFollows = async () => {
    setError(null);
    try {
      const fetchedAccount = await getFollows();
      setFollowRequestNumber(fetchedAccount);
    } catch (err) {
      setError("Nu s-au putut obtine date");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 justify-center bg-blue-50 min-h-screen">
      <div
        className="flex items-center gap-4 p-2 w-[600px] justify-between hover:scale-95 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex gap-4 py-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 top-2 flex justify-center items-center rounded-full bg-blue-600 w-10 h-10">
              <span className="text-white text-xl font-bold">-</span>
            </div>
            <div className="absolute inset-0 left-4 top-4 flex justify-center items-center rounded-full bg-green-500 w-10 h-10">
              <span className="text-white text-xl font-bold">+</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl">Follow-up requests</span>
            <span className="text-xl">
              {FollowRequestNumber.length > 1
                ? `${FollowRequestNumber[0].name || "Unknown User"} and ${
                    FollowRequestNumber.length - 1
                  } others`
                : FollowRequestNumber.length === 0
                ? "No follow requests"
                : FollowRequestNumber[0].name}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-700 rounded-full border w-[20px] h-[20px]"></div>
          <div>
            <MdArrowForwardIos size={20} />
          </div>
        </div>
      </div>
      <div className="w-[600px] gap-4 flex flex-col px-4 py-4">
        <span className="text-3xl">Today</span>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <div className="inset-0 border-2 border-black flex justify-center items-center rounded-full bg-green-500 w-10 h-10">
              <span className="text-white text-xl font-bold">+</span>
            </div>
            <div className="flex flex-col">
              <p>
                <span className="font-bold">Account name</span> started
                following you
              </p>
              <span>This is an message bla bla</span>
            </div>
          </div>

          <Button
            variant={followClicked ? "outline" : "default"}
            className="w-24"
            onClick={handleFollowButton}
          >
            {followClicked ? "Following" : "Follow"}
          </Button>
        </div>
      </div>
      <div className="w-[600px] px-4 py-4 flex flex-col gap-4">
        <span className="text-3xl">In the last 7 days</span>
        <div className="flex gap-2">
          <div className="inset-0 border-2 border-red-500 flex justify-center items-center rounded-full bg-blue-500 w-10 h-10">
            <span className="text-white text-xl font-bold">+</span>
          </div>
          <div className="flex flex-col">
            <p>
              <span className="font-bold">Account name</span> posted a thread
            </p>
            <span>
              This a thread posted by Account name to describe instagram
            </span>
          </div>
        </div>
      </div>
      <div className="w-[600px] px-4 py-4 flex flex-col gap-4">
        <span className="text-3xl">In the last 30 days</span>
        <div className="flex gap-2">
          <div className="inset-0 border-2 border-red-500 flex justify-center items-center rounded-full bg-blue-500 w-10 h-10">
            <span className="text-white text-xl font-bold">+</span>
          </div>
          <div className="flex flex-col">
            <p>
              <span className="font-bold">Account name</span> posted a thread
            </p>
            <span>
              This a thread posted by Account name to describe instagram
            </span>
          </div>
        </div>
      </div>
      <div className="flex px-4 py-20 flex-col w-[600px]">
        <span className="text-3xl">People you might know</span>
      </div>
      <NotificationModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        fetchedAccount={FollowRequestNumber}
      />
    </div>
  );
}

export default withAuth(Notifications);
