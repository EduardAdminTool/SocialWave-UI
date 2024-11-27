import { RiLoopLeftLine } from "react-icons/ri";
import { IoIosNotifications } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { FaPlusSquare } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="px-8 border-t border-t-black">
      <div className="flex gap-8 justify-between px-4">
        <Link href={"/"}>
          <RiLoopLeftLine size={36} />
        </Link>
        <FaSearch size={36} />
        <Link href={"/createPost"}>
          <FaPlusSquare size={36} />
        </Link>
        <IoIosNotifications size={36} />
        <Link href={"/account"}>
          <VscAccount size={36} />
        </Link>
      </div>
    </div>
  );
}
