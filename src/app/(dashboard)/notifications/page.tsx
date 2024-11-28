import { MdArrowForwardIos } from "react-icons/md";

export default function Notifications() {
  const requests = [
    {
      name: "Matei",
    },
    {
      name: "Andrei",
    },
    {
      name: "Edi",
    },
    {
      name: "Ioana",
    },
    {
      name: "Andreea",
    },
  ];
  return (
    <div className="flex flex-col items-center gap-4 justify-center bg-blue-50">
      <div className="flex items-center gap-4 p-2 w-[600px] justify-between">
        <div className="flex gap-4 py-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 top-2 flex justify-center items-center rounded-full bg-blue-600 w-10 h-10">
              <span className="text-white text-xl font-bold">-</span>
            </div>
            <div className="absolute inset-0 left-4 top-4 flex justify-center items-center rounded-full bg-green-500 w-10 h-10">
              <span className="text-white text-xl font-bold">+</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl">Follow-up requests</span>
            {requests.map((item, index) => {
              if (index === 0) {
                const remainingCount = requests.length - 1;
                return (
                  <span key={item.name} className="text-xl">
                    {item.name}{" "}
                    {remainingCount > 0 && `+${remainingCount} more`}
                  </span>
                );
              }
            })}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-blue-700 rounded-full border w-[20px] h-[20px]"></div>
          <div>
            <MdArrowForwardIos size={20} />
          </div>
        </div>
      </div>
      <div className="border border-black">Today</div>
      <div className="border border-black">In the last 7 days</div>
      <div className="border border-black">In the last 30 days</div>
    </div>
  );
}
