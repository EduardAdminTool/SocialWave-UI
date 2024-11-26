import Link from "next/link";
import { VscAccount } from "react-icons/vsc";

export default function MessagesHeader() {
  return (
    <div className="border-b border-b-black p-4 flex justify-between">
      <Link href={"/"}>
         <span className="text-blue-500 font-light text-2xl">Social Wave</span>
      </Link>
      <input
        placeholder="search"
        className="border border-black w-[200px] text-center rounded-full"
      ></input>
      <VscAccount size={36} />
    </div>
  );
}
