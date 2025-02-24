"use client";
import { getPrivateChat } from "@/actions/chats";
import { formatDate, generateRandomChatId } from "@/app/utils/helper";
import { useSocketContext } from "@/components/providers/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Lock, X } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import InputText from "./InputText";
import MessageBody from "./MessageBody";
import MessageHeader from "./MessageHeader";
import useMessageStore from "@/app/zustand/stores/message";

const PrivateChat = ({ id }: { id: string }) => {
  const { data: user } = useSession();
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["getChat", id],
    queryFn: ({ queryKey }) => getPrivateChat(queryKey[1]),
    enabled: !!id,
  });
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  const { messageType, media, setMedia, setMessageType } = useMessageStore(
    (state) => state
  );

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

  const clearPreview = () => {
    setMedia(null);
    setMessageType("text");
  };

  useEffect(() => {
    console.log(media, "media");
  }, [media]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Helper to get file extension
  const getFileExtension = (filename: string): string => {
    return filename?.split(".").pop()?.toUpperCase() || "";
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col flex-1 h-full">
      {/* Header */}
      <MessageHeader data={data} />

      {/* Messages */}
      <div className="flex-1 w-full overflow-y-auto">
        {messageType === "text" && (
          <>
            <div className="flex items-center justify-center p-4 text-center">
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-4 rounded-full">
                <Lock className="h-3 w-3" />
                <span className="text-xs">
                  Messages are end-to-end encrypted
                </span>
              </div>
            </div>

            <div className="min-h-full p-4 flex flex-col space-y-3">
              {Object.keys(data?.conversation?.messages).map(
                (date, dateIndex) => (
                  <div key={dateIndex} className="flex flex-col space-y-4">
                    <div className="text-center flex justify-center items-center ">
                      <p className="bg-gray-100  px-4 py-2 text-sm font-medium rounded-xl dark:bg-gray-800">
                        {date}
                      </p>
                    </div>
                    {data?.conversation?.messages[date].map(
                      (msg: any, index: number) => {
                        const isOwnMessage = msg.senderId._id === user?.user.id;

                        return (
                          <MessageBody
                            key={index}
                            isOwnMessage={isOwnMessage}
                            msg={msg}
                          />
                        );
                      }
                    )}
                  </div>
                )
              )}
            </div>
          </>
        )}

        {media && (
          <div className=" border-t h-full ">
            <div className="container h-full mx-auto p-4">
              <div className="relative rounded-lg h-full overflow-hidden p-4">
                <button
                  onClick={clearPreview}
                  className="absolute top-2 right-2 p-1.5 rounded-full dark:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>

                {messageType === "image" && (
                  <div className="flex flex-col justify-center h-full items-center">
                    <img
                      src={URL.createObjectURL(media)}
                      alt="Preview"
                      className="max-h-[450px] rounded-lg object-cover shadow-lg"
                    />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {media.name}
                    </p>
                  </div>
                )}

                {messageType === "video" && (
                  <div className="flex flex-col justify-center h-full items-center">
                    <video
                      src={URL.createObjectURL(media)}
                      controls
                      className="max-h-[450px] rounded-lg shadow-lg"
                    />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                      {media.name}
                    </p>
                  </div>
                )}

                {messageType === "document" && (
                  <div className="flex justify-center items-center h-full">
                    <div className="flex flex-col max-w-md w-full rounded-lg border overflow-hidden">
                      {/* Document Header */}
                      <div className="flex items-center gap-3 p-3 ">
                        <div className="w-12 h-12 flex items-center justify-center border rounded-full">
                          <span className="text-xs font-medium  ">
                            {getFileExtension(media.name)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate ">
                            {media.name}
                          </p>
                          <p className="text-xs  ">
                            {formatFileSize(media.size)}
                          </p>
                        </div>
                      </div>

                      {/* Document Footer */}
                      <div className="flex items-center justify-between px-3 py-3 border-t dark:border-gray-700">
                        <span className="text-xs  ">
                          {media.type.split("/")[1].toUpperCase()}
                        </span>
                        <FileText className="h-4 w-4 " />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <InputText sendMessage={sendMessage} />
    </div>
  );
};

export default PrivateChat;
