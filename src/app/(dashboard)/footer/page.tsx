"use client";

import Link from "next/link";
import { Home, Search, PlusSquare, Bell, User } from "lucide-react";
import withAuth from "@/utils/withAuth";
function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-200 shadow-sm py-1 h-[50px]">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex flex-col items-center">
            <Home className="h-6 w-6 text-blue-600" />
            <span className="text-xs font-medium text-blue-800 mt-1">Home</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center">
            <Search className="h-6 w-6 text-blue-600" />
            <span className="text-xs font-medium text-blue-800 mt-1">
              Search
            </span>
          </Link>
          <Link href="/createPost" className="flex flex-col items-center">
            <PlusSquare className="h-6 w-6 text-blue-600" />
            <span className="text-xs font-medium text-blue-800 mt-1">
              Create
            </span>
          </Link>
          <Link href="/notifications" className="flex flex-col items-center">
            <Bell className="h-6 w-6 text-blue-600" />
            <span className="text-xs font-medium text-blue-800 mt-1">
              Alerts
            </span>
          </Link>
          <Link href="/account" className="flex flex-col items-center">
            <User className="h-6 w-6 text-blue-600" />
            <span className="text-xs font-medium text-blue-800 mt-1">
              Account
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default withAuth(Footer);
