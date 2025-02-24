import { Search, Users } from "lucide-react";
import React from "react";

const MessageHeader = ({ data }: { data: any }) => {
  return (
    <div className="p-4 bg-white dark:bg-[#0d0d0d] dark:text-white border-b light:border-gray-200">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={data?.conversation.otherUser.profilePic}
            alt={data?.conversation.otherUser.fullName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold dark:text-white text-gray-900">
                {data?.conversation.otherUser.fullName}
              </h2>
              <p className="text-sm text-green-500">Online</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <Search className="h-5 w-5 text-gray-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <Users className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageHeader;
