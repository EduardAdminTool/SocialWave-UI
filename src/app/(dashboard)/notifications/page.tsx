"use client";

import { useEffect, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import withAuth from "@/utils/withAuth";
import { getFollows } from "@/services/follow";
import { getNotifications } from "@/services/notifications";
import NotificationModal from "@/components/NotificationModal";
import { FollowRequestsProps } from "@/types/types";
import { Notification } from "@/types/notifications/types";

function Notifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [FollowRequestNumber, setFollowRequestNumber] = useState<
    FollowRequestsProps[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFollows();
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const fetchedNotifications = await getNotifications();
      setNotifications(fetchedNotifications);
    } catch (err) {
      console.error(err);
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

  const updateFollowRequests = (updatedRequests: FollowRequestsProps[]) => {
    setFollowRequestNumber(updatedRequests);
  };

  return (
    <div className="flex flex-col items-center gap-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen py-8 px-4">
      <div
        className="w-full max-w-[600px] p-4 bg-white shadow-md rounded-lg border border-gray-200 hover:scale-[1.02] transition-transform cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute top-2 left-2 w-12 h-12 flex items-center justify-center rounded-full bg-blue-600">
              <span className="text-white text-lg font-bold">-</span>
            </div>
            <div className="absolute top-4 left-6 w-12 h-12 flex items-center justify-center rounded-full bg-green-500">
              <span className="text-white text-lg font-bold">+</span>
            </div>
          </div>
          <div className="flex flex-col px-4">
            <span className="text-xl font-semibold text-gray-700">
              Follow-up Requests
            </span>
            <span className="text-gray-500">
              {FollowRequestNumber.length > 1
                ? `${FollowRequestNumber[0].name || "Unknown User"} and ${
                    FollowRequestNumber.length - 1
                  } others`
                : FollowRequestNumber.length === 0
                ? "No follow requests"
                : FollowRequestNumber[0].name}
            </span>
            {FollowRequestNumber.length > 0 && (
              <div className="mt-2 text-blue-700 text-sm font-medium">
                {FollowRequestNumber.length} new requests
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <MdArrowForwardIos size={20} className="text-gray-500" />
        </div>
      </div>

      <div className="w-full max-w-[600px] bg-white shadow-md rounded-lg px-8 py-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative w-14 h-14">
            <div className="absolute top-2 left-2 w-12 h-12 flex items-center justify-center rounded-full bg-blue-600">
              <IoIosNotifications className="text-white text-lg" />
            </div>
          </div>
          <span className="text-xl font-semibold text-gray-700">
            Notifications
          </span>
        </div>
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-gray-50 shadow-sm rounded-lg border border-gray-200 flex items-start gap-4"
              >
                <span className="font-medium text-gray-700">{item.userId}</span>
                <span className="text-gray-500">{item.text}</span>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No new notifications</div>
          )}
        </div>
      </div>

      <NotificationModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        fetchedAccount={FollowRequestNumber}
        updateFollowRequests={updateFollowRequests} 
      />
    </div>
  );
}

export default withAuth(Notifications);
