import { FaCameraRetro, FaLocationArrow } from "react-icons/fa";
import Messages from "@/app/messages/page";
import Link from "next/link";

export default function Header() {
  return (
    <div>
      <div className="bg-blue-50 h-[40px] w-full border-b border-b-black flex justify-between items-center text-blue-500 p-8">
        <Link href={"/"}>
          <h1 className="text-3xl font-light">SocialWave</h1>
        </Link>
        <Link href="/messages" className="group">
          <div className="transition-all duration-300 ease-in-out transform group-hover:scale-110">
            <FaLocationArrow
              size={36}
              className="transition-colors duration-300 ease-in-out group-hover:text-blue-600"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
