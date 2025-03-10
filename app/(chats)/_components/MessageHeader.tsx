import React, { useEffect, useState, useMemo } from "react";
import { Search, Users } from "lucide-react";
import { Socket } from "socket.io-client";
import useFeatures from "@/app/zustand/stores/feature";

interface MessageHeaderProps {
  data: any;
  socket: Socket | null;
  userId: string;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ data, socket, userId }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  const { onlineUsers } = useFeatures((state) => state);

  const isGroup = data?.conversation?.isGroup;
  const chatName = isGroup ? data?.conversation?.groupName : data?.conversation?.otherUser?.fullName;
  const chatPic = isGroup ? data?.conversation?.groupPic : data?.conversation?.otherUser?.profilePic;
  const otherUserId = data?.conversation?.otherUser?._id;


 

  // Compute online users in the group
  const groupUsersOnline = useMemo(() => {
    return data?.conversation?.groupUsers?.filter((d: any) => onlineUsers.includes(d._id) && d._id !== userId) || [];
  }, [data?.conversation?.groupUsers, onlineUsers]);

  const isUserOnline = useMemo(() => {
    return onlineUsers.includes(otherUserId);
  }, [onlineUsers, otherUserId]);

  useEffect(() => {
    if (!data || !socket) return;

    const handleTyping = (socketData: any) => {
      if (socketData?.conversationId === data.conversation.conversationId && socketData.senderId !== userId) {
        if (socketData.isGroup) {
          setUser(socketData.fullName);
        }
        setIsTyping(true);
      }
    };

    const handleNotTyping = (socketData: any) => {
      if (socketData?.conversationId === data.conversation.conversationId && socketData.senderId !== userId) {
        if (socketData.isGroup) {
          setUser(null);
        }
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("not-typing", handleNotTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("not-typing", handleNotTyping);
    };
  }, [socket, data, userId]);

  return (
    <div className="p-4 bg-white dark:bg-[#0d0d0d] dark:text-white border-b light:border-gray-200">
      <div className="flex items-center">
        {/* Profile Picture */}
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img src={chatPic} alt={chatName} className="w-full h-full object-cover" />
        </div>

        {/* Chat Info */}
        <div className="ml-4 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold dark:text-white text-gray-900">{chatName}</h2>
              <p className="text-sm text-green-500">
                {isTyping
                  ? user
                    ? `${user} is typing...`
                    : "typing..."
                  : isGroup
                    ? groupUsersOnline.length > 0
                      ? groupUsersOnline.length === 1
                        ? `${groupUsersOnline[0].fullName.split(" ")[0]} is online`
                        : `${groupUsersOnline[0].fullName.split(" ")[0]} and ${groupUsersOnline.length - 1} others are online`
                      : "No one is online!"
                    : isUserOnline
                      ? "Online"
                      : "Offline"}
              </p>
            </div>

            {/* Action Buttons */}
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
