"use client";
import { getPrivateChat } from "@/actions/chats";
import { formatDate, generateRandomChatId } from "@/app/utils/helper";
import { useSocketContext } from "@/components/providers/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import InputText from "./InputText";
import MessageBody from "./MessageBody";
import MessageHeader from "./MessageHeader";

const PrivateChat = ({ id }: { id: string }) => {
  const { data: user } = useSession();
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["getChat", id],
    queryFn: ({ queryKey }) => getPrivateChat(queryKey[1]),
    enabled: !!id,
  });
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();

  useEffect(() => {
    // console.log(`Rendered`)
    socket?.on("message", (socketData) => {
      console.log(
        socketData?.conversationId === id,
        id,
        socketData.conversationId,
        socketData
      );
      if (socketData?.conversationId === id) {
        queryClient.setQueryData(["getChat", id], (oldData: any) => {
          if (!oldData) return oldData;
          const formattedDate = formatDate(socketData.createdAt);
          return {
            ...oldData,
            conversation: {
              ...oldData.conversation,
              messages: {
                ...oldData.conversation.messages,
                [formattedDate]: [
                  ...(oldData?.conversation?.messages?.[formattedDate] || []),
                  socketData,
                ],
              },
            },
          };
        });
      }
    });
  }, [socket, id]);

  const sendMessage = (
    message: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!message) return;
    try {
      const messageToSend = {
        mesId: generateRandomChatId(),
        senderId: {
          _id: user?.user.id,
          fullName: user?.user.fullName,
          profilePic: user?.user.profilePic,
        },
        conversationId: id,
        text: message,
        roomId: data?.conversation.otherUser._id,
        createdAt: new Date(Date.now()),
      };

      // Function to format date as "DD/MM/YYYY"

      queryClient.setQueryData(["getChat", id], (oldData: any) => {
        if (!oldData) return oldData;

        const formattedDate = formatDate(messageToSend.createdAt);

        return {
          ...oldData,
          conversation: {
            ...oldData.conversation,
            messages: {
              ...oldData.conversation.messages,
              [formattedDate]: [
                ...(oldData?.conversation?.messages?.[formattedDate] || []),
                messageToSend,
              ],
            },
          },
        };
      });

      socket?.emit(`message`, messageToSend);
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Header */}
      <MessageHeader data={data} />

      {/* Messages */}
      <div className="flex-1 w-full overflow-y-auto">
        <div className="flex items-center justify-center p-4 text-center">
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-4 rounded-full">
            <Lock className="h-3 w-3" />
            <span className="text-xs">Messages are end-to-end encrypted</span>
          </div>
        </div>

        <div className="min-h-full p-4 flex flex-col space-y-3">
          {Object.keys(data?.conversation?.messages).map((date) => (
            <div key={date} className="flex flex-col space-y-4">
              <div className="text-center flex justify-center items-center ">
                <p className="bg-gray-100  px-4 py-2 rounded-xl dark:bg-gray-800">
                  {date}
                </p>
              </div>
              {data?.conversation?.messages[date].map(
                (msg: any, index: number) => {
                  const isOwnMessage = msg.senderId._id === user?.user.id;

                  return (
                    <MessageBody
                      isOwnMessage={isOwnMessage}
                      index={index}
                      msg={msg}
                    />
                  );
                }
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <InputText sendMessage={sendMessage} />
    </div>
  );
};

export default PrivateChat;
