import { MessageSquare, Bell, Settings, UserPlus } from "lucide-react";
import UserImage from "./UserImage";
import Link from "next/link";
import LogOut from "./Logout";

const Sidebar = () => {
  return (
    <div className="h-screen w-[70px] border-r flex flex-col items-center justify-between bg-white text-black py-4">

      <div className="w-12 h-12 rounded-full flex items-center overflow-hidden justify-center">
        <UserImage />
      </div>

      <div className="flex flex-col space-y-[50px] flex-1 mt-16">
        <Link href={"/"}> <MessageSquare size={24} className="cursor-pointer" /></Link>
        <Link href={"/notifications"}>   <Bell size={24} className="cursor-pointer" /></Link>
        <Link href={"/requests"}> <UserPlus size={24} className="cursor-pointer" /></Link>
        <Link href={"/settings"}> <Settings size={24} className="cursor-pointer" /></Link>
      </div>

      <LogOut />
    </div>
  );
};

export default Sidebar;