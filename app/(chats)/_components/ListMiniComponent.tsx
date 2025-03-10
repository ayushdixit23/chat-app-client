import { extractHourMinutes } from "@/app/utils/helper";
import Link from "next/link";
import React from "react";

// Function to display the last message text based on its type


const getLastMessageText = (lastMessage: any, user: any, currentUserId: string) => {
  if (!lastMessage.type) {
    return `Start Conversation ${user.isGroup ? "in" : "with"} ${user.chatName?.slice(0, 5)}...`;
  }

  if (lastMessage.type === "text") {
    return lastMessage.text
      ? `${lastMessage.sender?._id === currentUserId
        ? "You: "
        : user.isGroup
          ? `${lastMessage.sender.fullName.split(" ")[0]}: `
          : ""
      }${lastMessage.text}`
      : `Start Conversation with ${user.chatName?.slice(0, 5)}...`;
  }

  if (lastMessage.type === "image") {
    return `${lastMessage.sender?._id === currentUserId ? "You: " : ""}sent an image`;
  }

  if (lastMessage.type === "video") {
    return `${lastMessage.sender?._id === currentUserId ? "You: " : ""}sent a video`;
  }

  if (lastMessage.type === "document") {
    return `${lastMessage.sender?._id === currentUserId ? "You: " : ""}sent a document`;
  }

  return "";
};

// Function to determine if the user is online
const getOnlineStatus = (user: any, onlineUsers: string[]) => {
  const otherUser = user.users.find((u: any) => u._id !== user.id);
  return onlineUsers.includes(otherUser?._id) && !user.isGroup;
};

const ListMiniComponent = ({
  user,
  data,
  onlineUsers,
}: {
  user: any;
  data: any;
  onlineUsers: string[];
}) => {
  // Check if the other user in the conversation is online
  const otherUserArray = user.users.filter((u: any) => u._id !== data.user.id);
  const otherUserId = otherUserArray[0]._id;
  const isOnline = getOnlineStatus(user, onlineUsers);

  return (
    <Link
      href={`?id=${user._id}`}
      className="flex items-center p-4 light:hover:bg-gray-50 cursor-pointer border-b light:border-gray-100"
    >
      <div className="w-10 h-10 relative">
        <div className="w-full h-full rounded-full overflow-hidden">
          <img
            src={user.profilePic}
            alt={user.fullName}
            className="w-full h-full object-cover"
          />
        </div>

        {isOnline && (
          <div
            className="absolute w-3 h-3 rounded-full border-2 border-white bg-green-500"
            style={{ bottom: "-1px", right: "-1px" }}
          />
        )}
      </div>

      <div className="ml-3 flex-1">
        <div className="flex justify-between">
          <h3 className="font-semibold dark:text-white text-sm text-gray-900">
            {user.chatName.length > 20 ? `${user.chatName.slice(0, 20)}...` : user.chatName}
          </h3>
          <span className="text-xs dark:text-white text-gray-500">
            {user.lastMessage.createdAt ? extractHourMinutes(user.lastMessage.createdAt) : ""}
          </span>
        </div>

        <div className="flex justify-between">
          <p className="text-xs mt-[4px] dark:text-white text-gray-500 truncate">
            {getLastMessageText(user.lastMessage, user, data.user.id)}
          </p>

          {user?.unread > 0 && (
            <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {user?.unread}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ListMiniComponent;
