import { BiMessageRoundedAdd } from "react-icons/bi";
import { FaExclamationCircle } from "react-icons/fa";

export default function Messages() {
  const dm = [
    {
      logo: "logo1",
      name: "name1",
      message: "message1",
    },
    {
      logo: "logo2",
      name: "name2",
      message: "message2",
    },
    {
      logo: "logo2",
      name: "name2",
      message: "message2",
    },
    {
      logo: "logo3",
      name: "name3",
      message: "message3",
    },
    {
      logo: "logo4",
      name: "name4",
      message: "message4",
    },
    {
      logo: "logo5",
      name: "name5",
      message: "message5",
    },
    {
      logo: "logo6",
      name: "name6",
      message: "message6",
    },
  ];
  return (
    <div className="grid grid-cols-2 px-16 py-12">
      <div className="flex-col flex">
        <div className="flex items-center border border-b-black justify-between p-4">
          <span className="text-2xl">Direct</span>
          <BiMessageRoundedAdd size={36} />
        </div>
        <div className="flex flex-col py-4 gap-4 text-xl border border-b-black px-4 cursor-pointer">
          {dm.map((item) => (
            <div className="flex items-center gap-4 border-b border-b-black py-4 hover:scale-95">
              <div className="bg-black rounded-full w-[80px] h-[80px] flex justify-center items-center text-white">
                {item.logo}
              </div>
              <div className="flex flex-col">
                <span>{item.name}</span>
                <span className="truncate">{item.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="border border-b-black p-4 flex justify-between items-center">
          <span className="text-2xl">User</span>
          <FaExclamationCircle size={36} />
        </div>
        <div className="border text-center py-4 h-auto border-b-black text-xl flex flex-col justify-between items-center">
          <span>Message Content</span>
          <input
            placeholder="Message"
            className="px-4 w-[350px] border border-black rounded-full"
          ></input>
        </div>
      </div>
    </div>
  );
}
