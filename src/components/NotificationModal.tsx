"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FollowRequestsProps } from "@/types/types";
import { acceptFollow, rejectFollow } from "@/services/follow";
export default function NotificationModal({
  isOpen,
  setIsOpen,
  fetchedAccount,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  fetchedAccount: FollowRequestsProps[];
}) {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  const handleAccept = async (userId: number) => {
    const response = await acceptFollow(userId);
  };

  const handleReject = async (userId: number) => {
    const response = await rejectFollow(userId);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white text-black rounded-lg overflow-hidden w-[90%] max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Follow Requests</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <ScrollArea className="h-[70vh]">
          {fetchedAccount.map((request) => (
            <div
              key={request.userId}
              className="flex items-center justify-between p-4 border-b"
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage
                    src={request.profilePicture}
                    alt={request.name}
                  />
                  <AvatarFallback>
                    {request.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{request.name}</p>
                  <p className="text-sm text-gray-500">Wants to follow you</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => handleAccept(request.userId)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(request.userId)}
                  className="text-gray-700 border-gray-300 hover:bg-gray-100"
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
}