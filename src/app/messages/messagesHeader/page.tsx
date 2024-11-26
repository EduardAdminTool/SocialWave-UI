import { VscAccount } from "react-icons/vsc";

export default function MessagesHeader() {
  return (
    <div className="border-b border-b-black p-4 flex justify-between">
      <span className="text-blue-500 font-light text-2xl">Social Wave</span>
      <input
        placeholder="search"
        className="border border-black w-[200px] text-center"
      ></input>
      <VscAccount size={36} />
    </div>
  );
}
