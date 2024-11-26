import { FaCameraRetro, FaLocationArrow } from "react-icons/fa";
import Messages from "@/app/messages/page";
import Link from "next/link";

export default function Header() {
  return (
    <div className="bg-white h-[40px] w-full border-b border-b-black flex justify-between items-center text-blue-500 p-8">
      <FaCameraRetro size={36} />
      <h1 className="text-3xl font-light">SocialWave</h1>
      <Link href={"/messages"}>
        <FaLocationArrow size={36} href="/messages" />
      </Link>
    </div>
  );
}
