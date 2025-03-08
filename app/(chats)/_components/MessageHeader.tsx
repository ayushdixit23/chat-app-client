import { Search, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

const MessageHeader = ({
  data,
  socket,
  userId
}: {
  data: any;
  socket: Socket | null;
  userId: string
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const chatName = data?.conversation.isGroup ? data?.conversation.groupName : data?.conversation.otherUser.fullName
  const chatPic = data?.conversation.isGroup ? data?.conversation.groupPic : data?.conversation.otherUser.profilePic
  const [user, setUser] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(false)

  useEffect(() => {
    if(!data) return
    socket?.on(`typing`, (socketData) => {
      if (socketData?.conversationId === data?.conversation.conversationId && socketData.senderId !== userId) {
        if (socketData.isGroup) {
          setUser(socketData.fullName)
        }
        setIsTyping(true);
      }
    });

    socket?.on("not-typing", (socketData) => {
      if (socketData?.conversationId === data?.conversation.conversationId && socketData.senderId !== userId) {
        if (socketData.isGroup) {
          setUser(null)
        }
        setIsTyping(false);
      }
    });

    if (!data.conversation.isGroup) {
      socket?.emit("check-user-online", data?.conversation.otherUser._id)
    }

    if (!data.conversation.isGroup) {
      
      socket?.on("check-user:online", (data) => {
        console.log("runned",data)
        setIsOnline(data?.isOnline)
      })
    }

  }, [socket,data]);

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
                {isTyping ? user ? `${user} is typing...` : "typing..." :

                  isOnline ? "Online" : "Offline"
                }
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
