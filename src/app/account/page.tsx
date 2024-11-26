import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function AccountPage() {
  const story = [
    {
      image: "poza",
      name: "Andrei",
    },
    {
      image: "poza1",
      name: "Matei1",
    },
    {
      image: "poza1",
      name: "Matei2",
    },
    {
      image: "poza1",
      name: "Matei3",
    },
    {
      image: "poza1",
      name: "Matei4",
    },
    {
      image: "poza1",
      name: "Matei5",
    },
    {
      image: "poza1",
      name: "Matei6",
    },
    {
      image: "poza1",
      name: "Matei7",
    },
    {
      image: "poza1",
      name: "Matei8",
    },
    {
      image: "poza1",
      name: "Matei9",
    },
    {
      image: "poza1",
      name: "Matei91",
    },
    {
      image: "poza1",
      name: "Matei92",
    },
    {
      image: "poza1",
      name: "Matei93",
    },
    {
      image: "poza1",
      name: "Matei94",
    },
    {
      image: "poza1",
      name: "Matei95",
    },
    {
      image: "poza1",
      name: "Matei96",
    },
    {
      image: "poza1",
      name: "Matei79",
    },
    {
      image: "poza1",
      name: "Matei97",
    },
    {
      image: "poza1",
      name: "Matei98",
    },
    {
      image: "poza1",
      name: "Matei99",
    },
    {
      image: "poza1",
      name: "Matei988",
    },
    {
      image: "poza1",
      name: "Matei932",
    },
  ];
  return (
    <div className="py-4">
      <div className="grid grid-cols-2 h-[300px] bg-blue-500">
        <div className="bg-black w-[200px] h-[200px] flex justify-center items-center rounded-full">
          Account Photo
        </div>
        <div>Account details</div>
      </div>
      <div className="border border-black py-4 px-8 flex gap-8">
        <ScrollArea className="w-128 whitespace-nowrap">
          <div className="flex w-max space-x-4 p-4">
            {story.map((item) => (
              <div className="flex flex-col items-center">
                <div className="bg-black rounded-full w-[80px] h-[80px] flex justify-center items-center text-white">
                  {item.image}
                </div>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="opacity-0" />
        </ScrollArea>
      </div>
    </div>
  );
}
