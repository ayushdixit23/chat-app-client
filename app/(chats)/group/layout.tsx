import React from "react";
import {
  Plus,
} from "lucide-react";
import ListGroups from "../_components/ListGroups";
import Link from "next/link";
import ChatSearch from "../_components/ChatSearch";

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
          <ChatSearch />
        </div>

        <ListGroups />
      </div>

      {children}
    </div>
  );
}

export default Layout;
