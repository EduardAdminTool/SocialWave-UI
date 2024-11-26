import type { Metadata } from "next";

import "../globals.css";

import Image from "next/image";

import MessagesHeader from "../messages/messagesHeader/page";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen messages-layout">
      <MessagesHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
