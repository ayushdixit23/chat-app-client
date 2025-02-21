import React from "react";

const MessageBody = ({
  isOwnMessage,
  index,
  msg,
}: {
  isOwnMessage: any;
  index: any;
  msg: any;
}) => {
  return (
    <div
      key={index}
      className={`flex items-end ${
        isOwnMessage ? "justify-end" : "justify-start"
      } space-x-2`}
    >
      {!isOwnMessage && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden ">
            <img
              src={msg.senderId.profilePic}
              alt={msg.senderId.fullName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div
        className={`flex flex-col ${
          isOwnMessage ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`relative inline-block max-w-[280px] md:max-w-[420px] ${
            isOwnMessage
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-transparent dark:text-white dark:border"
          } px-4 py-3 rounded-xl shadow-sm`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {isOwnMessage && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700">
            <img
              src={msg.senderId.profilePic}
              alt={msg.senderId.fullName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageBody;
