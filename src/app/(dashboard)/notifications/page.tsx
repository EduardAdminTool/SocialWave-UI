"use client";

import { useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { Button } from "@/components/ui/button";
import withAuth from "@/utils/withAuth";
import { getFollows } from "@/services/follow";
import { FollowRequestsProps } from "@/types/types";
import NotificationModal from "@/components/NotificationModal";
import { getNotifications } from "@/services/notifications";
import { IoIosNotifications } from "react-icons/io";

import { Notification } from "@/types/notifications/types";
function Notifications() {
  const [followClicked, setIsFollowClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [FollowRequestNumber, setFollowRequestNumber] = useState<
    FollowRequestsProps[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const handleFollowButton = () => {
    setIsFollowClicked(!followClicked);
  };

  useEffect(() => {
    fetchFollows();
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const fetchedNotifications = await getNotifications();
      setNotifications(fetchedNotifications);
    } catch (err) {
      console.log(err);
    }
  };

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
            <span className="text-lg">
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
          {FollowRequestNumber.length > 0 && (
            <div className="bg-blue-700 rounded-full border w-[20px] h-[20px]"></div>
          )}
          <div>
            <MdArrowForwardIos size={20} />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between w-[600px] p-2">
        <div className="flex gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 top-2 flex justify-center items-center rounded-full bg-blue-600 w-10 h-10">
              <span className="text-white text-xl font-bold"></span>
            </div>
            <div className="absolute inset-0 left-4 top-4 flex justify-center items-center rounded-full bg-green-500 w-10 h-10">
              <span className="text-white text-xl font-bold">
                <IoIosNotifications />
              </span>
            </div>
          </div>
          <span className="text-2xl py-4">Notifications</span>
        </div>
        <span className="text-lg">Follow</span>
        {notifications.map((item, index) => (
          <div className="flex flex-col" key={index}>
            <span>
              {item.userId} sent a {item.text}
            </span>
          </div>
        ))}
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
