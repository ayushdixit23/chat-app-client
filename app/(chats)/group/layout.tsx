import React from "react";
import {
  Search,
  Plus,
} from "lucide-react";
import ListGroups from "../_components/ListGroups";
import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full bg-gray-50 dark:bg-[#0d0d0d] dark:text-white">

      {/* Users List */}
      <div className="w-[350px] bg-white dark:bg-[#0d0d0d] dark:text-white border-r light:border-gray-200 flex flex-col">
        <div className="p-4 border-b light:border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-white text-gray-800">
              Groups
            </h2>
            <Link href={`/group/createGroup`} className="p-2 rounded-lg">
            <Plus />
            </Link>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full p-2 pl-8 rounded-lg border light:border-gray-300 focus:outline-none light:focus:border-blue-500 dark:bg-transparent bg-gray-50"
            />
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <ListGroups />
      </div>

      {children}
    </div>
  );
}

export default Layout;
