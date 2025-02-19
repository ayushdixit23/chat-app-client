// "use client"
// import { logOut } from "@/actions/auth";
// import { useSession } from "next-auth/react";

// export default function Home() {
//     const { data } = useSession();

//     return (
//         <>
//             {JSON.stringify(data?.user)}
//             <button onClick={logOut} className="cursor-pointer">log out</button>
//         </>
//     );
// }
"use client";
import React, { useState } from "react";
import {
  Search,
  Home,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Send,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getAllChats } from "@/actions/chats";
import { User } from "@/types/next-auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ChatInterface = () => {
  const [message, setMessage] = useState("");
  const [activeNav, setActiveNav] = useState("messages");
  const params = useSearchParams();
  const id = params.get("id");
  // const { data } = useSession()
  const {
    data: users,
    isError,
    isLoading,
    error,
  } = useQuery({ queryKey: ["allChats"], queryFn: getAllChats });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{error.message}</div>;
  }

  const messages = [
    {
      id: 1,
      text: "Hey, how are you?",
      sender: "John Doe",
      time: "10:30 AM",
      isSent: false,
      image: "/api/placeholder/40/40",
    },
    {
      id: 2,
      text: "I'm good, thanks! How about you?",
      sender: "You",
      time: "10:31 AM",
      isSent: true,
      image: "/api/placeholder/40/40",
    },
  ];

  return (
    <div className="flex w-full bg-gray-50 dark:bg-[#0d0d0d] dark:text-white">
      {/* Navigation Sidebar */}

      {/* Users List */}
      <div className="w-[350px] bg-white dark:bg-[#0d0d0d] dark:text-white border-r light:border-gray-200 flex flex-col">
        <div className="p-4 border-b light:border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold dark:text-white text-gray-800">
              Messages
            </h2>
            <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
              <Menu className="h-6 w-6" />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full p-2 pl-8 rounded-lg border light:border-gray-300 focus:outline-none light:focus:border-blue-500 dark:bg-transparent bg-gray-50"
            />
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {users?.users.map((user) => (
            <Link
              href={`?id=${user.user._id}`}
              key={user.id}
              className="flex items-center p-4 light:hover:bg-gray-50 cursor-pointer border-b light:border-gray-100"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={user.user.profilePic}
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
                    {user.user.fullName}
                  </h3>
                  <span className="text-sm dark:text-white text-gray-500">
                    {user.user?.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <p className="text-xs mt-[4px] dark:text-white text-gray-500 truncate">
                    {user.lastMessage.message ||
                      `Start Conversation with ${user.user.fullName?.slice(
                        0,
                        5
                      )}...`}
                  </p>
                  {user?.unread > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {user?.unread}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {id ? (
        <div className="flex-1  flex flex-col">
          <div className="p-4 bg-white dark:bg-[#0d0d0d] dark:text-white border-b light:border-gray-200">
            <div className="flex items-center">
              <img
                src="/api/placeholder/40/40"
                alt="John Doe"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold dark:text-white text-gray-900">
                      John Doe
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
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.isSent ? "justify-end" : "justify-start"
                }`}
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
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 border light:border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-transparent bg-gray-50"
              />
              <button
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                onClick={() => setMessage("")}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center flex flex-1 justify-center items-center flex-col gap-4">
          <h2 className="text-2xl font-bold dark:text-white text-gray-700">
            Select a conversation
          </h2>
          <p className="dark:text-white text-gray-500">
            Choose a chat from the list to start messaging.
          </p>
        </div>
      )}
      {/* Chat Area */}
    </div>
  );
};

export default ChatInterface;
