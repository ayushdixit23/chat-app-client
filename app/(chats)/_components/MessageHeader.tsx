import { Search, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

const MessageHeader = ({
  data,
  socket,
}: {
  data: any;
  socket: Socket | null;
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const chatName = data?.conversation.isGroup ? data?.conversation.groupName : data?.conversation.otherUser.fullName
  const chatPic=data?.conversation.isGroup ? data?.conversation.groupPic : data?.conversation.otherUser.profilePic

  useEffect(() => {
    socket?.on(`typing`, (socketData) => {
      if (socketData?.conversationId === data?.conversation.conversationId) {
        setIsTyping(true);
      }
    });

    socket?.on("not-typing", (socketData) => {
      if (socketData?.conversationId === data?.conversation.conversationId) {
        setIsTyping(false);
      }
    });
  }, [socket]);

  return (
    <div className="p-4 bg-white dark:bg-[#0d0d0d] dark:text-white border-b light:border-gray-200">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={chatPic}
            alt={chatName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold dark:text-white text-gray-900">
                {chatName}
              </h2>
              <p className="text-sm text-green-500">
                {isTyping ? "typing..." : "Online"}
              </p>
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
