import { RiLoopLeftLine } from "react-icons/ri";
import { IoIosNotifications } from "react-icons/io";
import { VscAccount } from "react-icons/vsc";
import { FaPlusSquare } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex gap-8 justify-between px-4">
      <RiLoopLeftLine size={36} />
      <FaSearch size={36} />
      <FaPlusSquare size={36} />
      <IoIosNotifications size={36} />
      <Link href={"/account"}>
        <VscAccount size={36} />
      </Link>
    </div>
  );
}
