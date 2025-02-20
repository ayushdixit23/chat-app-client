"use client";
import { getPrivateChat } from "@/actions/chats";
import { useQuery } from "@tanstack/react-query";
import { Search, Send, Users } from "lucide-react";
import React from "react";

const PrivateChat = ({ id }: { id: string }) => {
  let messages: any = [];
  let message = "";
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["getChat", id],
    queryFn: ({ queryKey }) => getPrivateChat(queryKey[1]),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  }

  if (isError) {
    return (
      <>
        <div>{error.message}</div>
      </>
    );
  }

  return (
    <div className="flex-1  flex flex-col">
      <div className="p-4 bg-white dark:bg-[#0d0d0d] dark:text-white border-b light:border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={data?.conversation.otherUser.profilePic}
              alt="John Doe"
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
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Search className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Users className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex ${
                msg.isSent ? "flex-row-reverse" : "flex-row"
              } items-end space-x-2`}
            >
              {!msg.isSent && (
                <img
                  src={msg.image}
                  alt={msg.sender}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.isSent
                    ? "bg-blue-500 text-white ml-2"
                    : "bg-white dark:bg-transparent dark:text-white border text-gray-900 mr-2"
                }`}
              >
                <p>{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.isSent ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white dark:bg-[#0d0d0d] dark:text-white border-t light:border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            // onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border light:border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-transparent bg-gray-50"
          />
          <button
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            // onClick={() => setMessage("")}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivateChat;
