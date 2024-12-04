import type { Metadata } from "next";

import "../globals.css";
import Header from "@/components/Header";
import Footer from "./footer/page";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen dashboard-layout">
      <div className="flex flex-col min-h-screen relative z-0">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
