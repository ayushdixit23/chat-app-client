import Link from "next/link";
import React from "react";

const ListMiniComponent = ({ user, data }: { user: any; data: any }) => {
  return (
    <Link
      href={`?id=${user._id}`}
      className="flex items-center p-4 light:hover:bg-gray-50 cursor-pointer border-b light:border-gray-100"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img
          src={user.profilePic}
          alt={user.fullName}
          className="w-full h-full object-cover"
        />

        <div
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
            user?.status === "online" ? "bg-green-500" : "bg-gray-400"
          }`}
        />
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between">
          <h3 className="font-semibold dark:text-white text-sm text-gray-900">
            {user.chatName}
          </h3>
          <span className="text-sm dark:text-white text-gray-500">
            {user.user?.time}
          </span>
        </div>
        <div className="flex justify-between">
          <p className="text-xs mt-[4px] dark:text-white text-gray-500 truncate">
            {user.lastMessage && user.lastMessage.type === "text" && (
              <>
                {user.lastMessage.text
                  ? `${
                      user.lastMessage.sender?._id === data.user.id
                        ? "You: "
                        : ""
                    }${user.lastMessage.text}`
                  : `Start Conversation with ${user.chatName?.slice(0, 5)}...`}
              </>
            )}

            {!user.lastMessage.type && (
              <>Start Conversation with ${user.chatName?.slice(0, 5)}...</>
            )}

            {user.lastMessage && user.lastMessage.type === "image" && (
              <>
                {user.lastMessage.sender?._id === data.user.id ? "You: " : ""}
                sent an image
              </>
            )}

            {user.lastMessage && user.lastMessage.type === "video" && (
              <>
                {user.lastMessage.sender?._id === data.user.id ? "You: " : ""}
                sent a video
              </>
            )}

            {user.lastMessage && user.lastMessage.type === "document" && (
              <>
                {user.lastMessage.sender?._id === data.user.id ? "You: " : ""}
                sent a document
              </>
            )}
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
