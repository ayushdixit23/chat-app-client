import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import ChatSearch from "../../_components/ChatSearch";
import ListGroups from "../../_components/ListGroups";

const GroupComponent = ({ id, hide = false }: { id?: string | undefined, hide?: boolean }) => {
  return (
    <div
      className={`${id || hide ? "hidden sm:block" : ""
        } w-full sm:w-[350px] bg-white dark:bg-[#0d0d0d] dark:text-white border-r h-full light:border-gray-200 flex flex-col`}
    >
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
  );
};

export default GroupComponent;
