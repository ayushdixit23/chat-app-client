"use client";
import { getPrivateChat } from "@/actions/chats";
import {
  errorHandler,
  formatDate,
  formatFileSize,
  generateRandomChatId,
} from "@/app/utils/helper";
import { useSocketContext } from "@/components/providers/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import InputText from "./InputText";
import MessageBody from "./MessageBody";
import MessageHeader from "./MessageHeader";
import useMessageStore, { value } from "@/app/zustand/stores/message";
import axios, { AxiosProgressEvent } from "axios";
import { API, CHAT_MESSAGE_URL } from "@/app/utils/constants";
import Loader from "./Loader";
import ErrorPage from "./ErrorPage";
import InfiniteScroll from "react-infinite-scroll-component";
import Preview from "./Preview";
import InfiniteLoader from "./InfiniteLoader";
import useFeatures from "@/app/zustand/stores/feature";

const PrivateChat = ({ id }: { id: string }) => {
  const queryClient = useQueryClient();
  const { data: user } = useSession();
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["getChat", id],
    queryFn: ({ queryKey }) => getPrivateChat(queryKey[1]),
    enabled: !!id,
  });
  const { socket } = useSocketContext();
  const { messageType, media, setMedia, setMessageType } = useMessageStore(
    (state) => state
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [isUserInChat, setIsUserInChat] = useState(false);
  const { setIsReplyOpen, setReplyMessage, replyMessage, isReplyOpen } = useFeatures((state) => state)
  const groupUsers = data?.conversation.isGroup ? data.conversation.groupUsers?.filter((d: any) => d?._id !== user?.user.id).map((f: any) => f._id) : null
  const [activeUsers, setActiveUsers] = useState([])

  const getLastMessageId = (messages: any) => {
    let oldestMessage: any = null;

    Object.values(messages).forEach((messagesArray: any) => {
      if (
        !oldestMessage ||
        messagesArray[0].createdAt < oldestMessage.createdAt
      ) {
        oldestMessage = messagesArray[0];
      }
    });

    return oldestMessage ? oldestMessage._id : null;
  };

  const fetchOlderMessages = async () => {
    if (!data?.conversation?.messages || isFetching) return;

    try {
      setIsFetching(true);
      const lastMessageId = getLastMessageId(data.conversation.messages);
      const res = await axios.get(
        `${API}/chats/getOlderMessages/${id}?lastMessageId=${lastMessageId}`,
        {
          headers: {
            Authorization: `Bearer ${user?.user.accessToken}`,
          },
        }
      );

      const newMessages = res.data.messages;
      const hasMore = res.data.hasMore;

      queryClient.setQueryData(["getChat", id], (oldData: any) => {
        if (!oldData) return oldData;

        const mergedMessages = { ...oldData.conversation.messages };

        // Merge new messages by date
        Object.keys(newMessages).forEach((date) => {
          mergedMessages[date] = [
            ...(newMessages[date] || []),
            ...(mergedMessages[date] || []),
          ]; // Sort messages by createdAt
        });

        // Sort the dates in ascending order
        const sortedMessages = Object.keys(mergedMessages)
          .sort((a, b) => {
            const [dayA, monthA, yearA] = a.split("/").map(Number);
            const [dayB, monthB, yearB] = b.split("/").map(Number);
            // @ts-ignore
            return (new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB));
          })
          .reduce((acc, date) => {
            acc[date] = mergedMessages[date];
            return acc;
          }, {} as Record<string, any[]>);

        return {
          ...oldData,
          conversation: {
            ...oldData.conversation,
            messages: sortedMessages,
            hasMore,
          },
        };
      });
    } catch (error) {
      console.error("Error fetching older messages:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const createMessage = (
    messageType: value,
    media?: File | null,
    message?: string
  ) => {
    const tempMessageId = generateRandomChatId();
    const isGroup = data?.conversation.isGroup;
    const otherUser = data?.conversation.otherUser;

    const tempMessage = {
      mesId: tempMessageId,
      senderId: {
        _id: user?.user.id,
        fullName: user?.user.fullName,
        profilePic: user?.user.profilePic,
      },
      seenBy: isGroup
        ? [...new Set([...(activeUsers ?? []), user?.user.id])]
        : isUserInChat
          ? [otherUser._id, user?.user.id]
          : [user?.user.id],
      isSeen: isGroup
        ? [...groupUsers, user?.user.id].sort().join(",") === [...activeUsers, user?.user.id].sort().join(",")
        : isUserInChat,
      type: replyMessage ? "reply" : messageType,
      conversationId: id,
      ...(isGroup && {
        chatData: {
          chatName: data?.conversation.groupName,
          profilePic: data?.conversation.groupPic,
        },
      }),
      isGroup,
      users: isGroup
        ? data?.conversation.groupUsers
        : [
          {
            _id: otherUser._id,
            fullName: otherUser.fullName,
            profilePic: otherUser.profilePic,
          },
          {
            _id: user?.user.id,
            fullName: user?.user.fullName,
            profilePic: user?.user.profilePic,
          },
        ],
      roomId: id,
      createdAt: new Date(),
      receiverId: isGroup ? groupUsers : otherUser._id,
      text: message,
      ...(messageType === "image" &&
        media && {
        imageUrl: URL.createObjectURL(media),
        uploadProgress: 0,
      }),
      ...(messageType === "video" &&
        media && {
        videoUrl: URL.createObjectURL(media),
        uploadProgress: 0,
      }),
      ...(replyMessage && {
        replyMessage: {
          senderId: replyMessage.senderId,
          mesId: replyMessage.mesId,
          type: replyMessage.type,
          text: replyMessage.text,
        },
      }),
      ...(messageType === "document" &&
        media && {
        document: {
          url: URL.createObjectURL(media),
          name: media.name,
          size: formatFileSize(media.size),
        },
      }),
    };

    return { tempMessage, tempMessageId };
  };

  const getUnSeenMessage = (messages: any) => {
    const unseenMessages = Object.values(messages)
      .flat()
      .filter((msg: any) => !msg.seenBy.includes(user?.user.id));

    return unseenMessages;
  };

  useEffect(() => {
    if (!id || !socket || !data || !data?.conversation.messages) return;

    socket?.on("message", (socketData) => {
      if (
        socketData?.conversationId === id &&
        socketData.senderId._id !== user?.user.id
      ) {
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

    socket.on("mark-message-seen", (data) => {
      const mesIdsToUpdate = JSON.parse(data)

      queryClient.setQueryData(["getChat", id], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          conversation: {
            ...oldData.conversation,
            messages: Object.keys(oldData.conversation.messages).reduce((acc: any, date) => {

              acc[date] = oldData.conversation.messages[date].map((msg: any) => {

                if (mesIdsToUpdate.includes(msg.mesId)) {
                  const updatedSeenBy = oldData?.conversation.isGroup
                    ? [...new Set([...msg.seenBy, ...(activeUsers ?? []), user?.user.id])]
                    : [...new Set([...msg.seenBy, user?.user.id])];

                  const isSeen = oldData?.conversation.isGroup
                    ? updatedSeenBy.map(String).sort().join(",") ===
                    (oldData?.conversation.groupUsers ?? []).map((f: any) => String(f._id)).sort().join(",")
                    : true;


                  if (isSeen && msg.senderId._id !== user?.user.id) {
                    socket.emit("messageSeenForGroup", {
                      senderId: msg.senderId._id,
                      messageId: msg.mesId,
                      roomId: id,
                      seenBy: updatedSeenBy,
                    });
                  }


                  return {
                    ...msg,
                    isSeen,
                    seenBy: updatedSeenBy,
                  };
                }

                return msg;
              });

              return acc;
            }, {}),
          },
        };
      });

    })

    socket.on("message:deleted-update", (data) => {
      queryClient.setQueryData(["getChat", id], (oldData: any) => {
        if (!oldData) return oldData;

        const updatedMessages = { ...oldData.conversation.messages };

        // Iterate through all messages and mark the specific one as deleted
        Object.keys(updatedMessages).forEach((date) => {
          updatedMessages[date] = updatedMessages[date].map((msg: any) =>
            msg.mesId === data.mesId ? { ...msg, status: "deleted" } : msg
          );
        });

        return {
          ...oldData,
          conversation: {
            ...oldData.conversation,
            messages: updatedMessages,
          },
        };
      });

      queryClient.setQueryData(["allChats"], (oldData: any) => {
        if (!oldData || !oldData.users) return oldData; // Ensure oldData exists

        const updatedChat = oldData.users.map((d: any) =>
          d._id === id
            ? {
              ...d,
              lastMessage:
                d.lastMessage.mesId === data.mesId
                  ? { ...d.lastMessage, status: "deleted" } // Update status correctly
                  : { ...d.lastMessage },
            }
            : d
        );

        return { ...oldData, users: updatedChat };
      });


    })

    if (!data.conversation.isGroup) {
      socket.on("is-present-in-chat", (data) => {
        if (data.roomId === id) {
          setIsUserInChat(data?.isPresent);
        }
      });
    }

    if (data.conversation.isGroup) {
      socket.on(`get-users-for-group-without-me`, (data) => {
        if (data?.userId === user?.user.id) {
          setActiveUsers(data.users)
        }
      })
    }

    if (data.conversation.isGroup) {
      socket.on("get-groupusers-update", (data) => {
        if (data?.roomId === id) {
          const otherUsers = data.users.filter((d: string) => d !== user?.user.id)
          setActiveUsers(otherUsers)
        }
      })
    }

    socket.on("messageSeenForGroupUpdate", (data) => {
      if (data.senderId === user?.user.id) {
        queryClient.setQueryData(["getChat", data.roomId], (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            conversation: {
              ...oldData.conversation,
              messages: Object.keys(oldData.conversation.messages).reduce((acc: any, date) => {
                acc[date] = oldData.conversation.messages[date].map((msg: any) =>
                  msg.mesId === data.messageId
                    ? { ...msg, isSeen: true, seenBy: data.seenBy }
                    : msg
                );
                return acc;
              }, {}),
            },
          };
        });
      }
    });

    socket.on("block-user-update", (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["getChat", data?.roomId] });
    });

    socket?.emit("join-room", id);

    const unseenMessages = getUnSeenMessage(data.conversation.messages);

    if (unseenMessages.length > 0) {
      const payload = {
        messages: unseenMessages,
        messageToSeenForUserId: user?.user.id,
        isGroup: data?.conversation.isGroup,
        roomId: id,
        actionType: "messageSeen"
      };

      const messageData = JSON.stringify(payload);
      socket.emit("messageToSeen", messageData);
    }

    if (!data.conversation.isGroup) {
      socket.emit("check-user-in-chat", { roomId: id, ...(!data?.conversation.isGroup && { userId: data?.conversation.otherUser._id, fullName: data?.conversation.otherUser.fullName }) })
    }

    if (data.conversation.isGroup) {
      socket.emit("check-users-for-group", {
        roomId: id, userId: user?.user.id,
      })
    }

    // Cleanup listener on unmount
    return () => {
      socket?.off("message");
      socket.off("is-present-in-chat");
      socket?.emit("leave-room", id);
      socket.off("join-room")
      socket.off("messageSeenForGroupUpdate")
      socket.off("messageSeenForGroup")
      socket.off("mark-message-seen")
    };
  }, [socket, id, queryClient, data]);

  const sendTextMessage = (
    message: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!message) return;
    try {
      const { tempMessage } = createMessage("text", null, message);
      updateMessageCache(tempMessage);
      socket?.emit(`message`, tempMessage);
      setMessage("");
    } catch (error) {
      console.error("Error sending text message:", error);
    }
  };


  const handleMessage = (
    message: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (messageType === "text") {
      sendTextMessage(message, setMessage);
    } else if (["image", "video"].includes(messageType)) {
      sendMediaMessage(message);
    } else if (messageType === "document") {
      sendDocumentMessage();
    }

    if (replyMessage) {
      setReplyMessage(null)
    }

    if (isReplyOpen) {
      setIsReplyOpen(false)
    }
  };

  const uploadMediaToAws = async (
    media: File,
    signedUrl: string,
    onProgress: (progress: number) => void
  ): Promise<boolean> => {
    try {
      // Start with 0% to show immediate feedback
      onProgress(0);

      const result = await axios.put(signedUrl, media, {
        headers: {
          "Content-Type": media.type,
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        },
      });

      return result.status === 200;
    } catch (error) {
      console.error("Upload failed:", error);
      return false;
    }
  };

  const updateMessageCache = (messageToSend: any) => {
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

    queryClient.setQueryData(["allChats"], (oldData: any) => {
      if (!oldData) return oldData;

      const lastMessage = {
        type: messageToSend?.type,
        text: messageToSend?.text,
        sender: messageToSend?.senderId,
        createdAt: messageToSend?.createdAt,
      };

      let updatedUsers = oldData?.users.map((d: any) =>
        d._id === messageToSend?.conversationId
          ? { ...d, lastMessage: lastMessage }
          : d
      );

      // Filter out the updated chat and move it to the top
      const updatedChat = updatedUsers.find(
        (d: any) => d._id === messageToSend?.conversationId
      );
      const filteredUsers = updatedUsers.filter(
        (d: any) => d._id !== messageToSend?.conversationId
      );

      updatedUsers = updatedChat
        ? [updatedChat, ...filteredUsers]
        : updatedUsers;
      return {
        ...oldData,
        users: updatedUsers,
      };
    });

    queryClient.setQueryData(["getGroups"], (oldData: any) => {
      if (!oldData) return oldData;

      const lastMessage = {
        type: messageToSend?.type,
        text: messageToSend?.text,
        sender: messageToSend?.senderId,
        createdAt: messageToSend?.createdAt,
      };

      let updatedUsers = oldData?.groups?.map((d: any) =>
        d._id === messageToSend?.conversationId
          ? { ...d, lastMessage: lastMessage }
          : d
      );

      // Filter out the updated chat and move it to the top
      const updatedChat = updatedUsers?.find(
        (d: any) => d._id === messageToSend?.conversationId
      );
      const filteredUsers = updatedUsers?.filter(
        (d: any) => d._id !== messageToSend?.conversationId
      );

      updatedUsers = updatedChat
        ? [updatedChat, ...filteredUsers]
        : updatedUsers;
      return {
        ...oldData,
        groups: updatedUsers,
      };
    });

  };

  const sendMediaMessage = async (message: string) => {
    if (!media) return;
    setMessageType("text");
    try {
      const { tempMessage, tempMessageId } = createMessage(messageType, media, message);

      // Add temp message to UI
      updateMessageCache(tempMessage);

      // Generate presigned URL for upload
      const response = await axios.post(
        `${API}/chats/generate-presignedurl`,
        {
          key: media.name,
          contentType: media.type,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.user.accessToken}`,
          },
        }
      );

      const { signedUrl, key } = response.data;

      // Start upload and track progress
      const success = await uploadMediaToAws(media, signedUrl, (progress) => {
        setUploadProgress(progress);

        // Update the temporary message with current progress
        queryClient.setQueryData(["getChat", id], (oldData: any) => {
          if (!oldData) return oldData;

          // Find and update the temp message with current progress
          const updatedMessages = { ...oldData.conversation.messages };

          for (const date in updatedMessages) {
            updatedMessages[date] = updatedMessages[date].map((msg: any) => {
              if (msg.mesId === tempMessageId) {
                return { ...msg, uploadProgress: progress };
              }
              return msg;
            });
          }

          return {
            ...oldData,
            conversation: {
              ...oldData.conversation,
              messages: updatedMessages,
            },
          };
        });
      });

      if (success) {
        const actualUrl = `${CHAT_MESSAGE_URL}${key}`;

        // Create final message
        const finalMessage = {
          ...tempMessage,
          ...(messageType === "image" && { imageUrl: actualUrl }),
          ...(messageType === "video" && { videoUrl: actualUrl }),
          uploadProgress: undefined,
        };

        // Replace the temporary message with the final one
        queryClient.setQueryData(["getChat", id], (oldData: any) => {
          if (!oldData) return oldData;

          // Find and update the temp message
          const updatedMessages = { ...oldData.conversation.messages };

          for (const date in updatedMessages) {
            updatedMessages[date] = updatedMessages[date].map((msg: any) => {
              if (msg.mesId === tempMessageId) {
                return finalMessage;
              }
              return msg;
            });
          }

          return {
            ...oldData,
            conversation: {
              ...oldData.conversation,
              messages: updatedMessages,
            },
          };
        });

        // Send the message via socket
        socket?.emit(`message`, finalMessage);
      } else {
        // Handle failed upload - remove the temporary message
        queryClient.setQueryData(["getChat", id], (oldData: any) => {
          if (!oldData) return oldData;

          // Remove the failed message
          const updatedMessages = { ...oldData.conversation.messages };

          for (const date in updatedMessages) {
            updatedMessages[date] = updatedMessages[date].filter(
              (msg: any) => msg.mesId !== tempMessageId
            );

            // If the date has no messages, remove the date
            if (updatedMessages[date].length === 0) {
              delete updatedMessages[date];
            }
          }

          return {
            ...oldData,
            conversation: {
              ...oldData.conversation,
              messages: updatedMessages,
            },
          };
        });

        console.error("Upload failed");
      }

      setMedia(null);

      setUploadProgress(0);
    } catch (error) {
      errorHandler(error);
      console.error("Error in media upload:", error);
      setMedia(null);
      setMessageType("text");
    }
  };

  const sendDocumentMessage = async () => {
    if (!media) return;

    setMessageType("text");

    try {
      const { tempMessage, tempMessageId } = createMessage(messageType, media);

      // Add temp message to UI
      updateMessageCache(tempMessage);

      // Generate presigned URL for upload
      const response = await axios.post(
        `${API}/chats/generate-presignedurl`,
        {
          key: media.name,
          contentType: media.type,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.user.accessToken}`,
          },
        }
      );

      const { signedUrl, key } = response.data;

      // Start upload and track progress
      const success = await uploadMediaToAws(media, signedUrl, (progress) => {
        setUploadProgress(progress);

        // Update the temporary message with current progress
        queryClient.setQueryData(["getChat", id], (oldData: any) => {
          if (!oldData) return oldData;

          // Find and update the temp message with current progress
          const updatedMessages = { ...oldData.conversation.messages };

          for (const date in updatedMessages) {
            updatedMessages[date] = updatedMessages[date].map((msg: any) => {
              if (msg.mesId === tempMessageId) {
                return { ...msg, uploadProgress: progress };
              }
              return msg;
            });
          }

          return {
            ...oldData,
            conversation: {
              ...oldData.conversation,
              messages: updatedMessages,
            },
          };
        });
      });

      if (success) {
        const actualUrl = `${CHAT_MESSAGE_URL}${key}`;

        // Create final message
        const finalMessage = {
          ...tempMessage,
          document: {
            url: actualUrl,
            name: media.name,
            size: formatFileSize(media.size),
          },
          uploadProgress: undefined,
        };

        // Replace the temporary message with the final one
        queryClient.setQueryData(["getChat", id], (oldData: any) => {
          if (!oldData) return oldData;

          // Find and update the temp message
          const updatedMessages = { ...oldData.conversation.messages };

          for (const date in updatedMessages) {
            updatedMessages[date] = updatedMessages[date].map((msg: any) => {
              if (msg.mesId === tempMessageId) {
                return finalMessage;
              }
              return msg;
            });
          }

          return {
            ...oldData,
            conversation: {
              ...oldData.conversation,
              messages: updatedMessages,
            },
          };
        });

        // Send the message via socket
        socket?.emit(`message`, finalMessage);
      } else {
        // Handle failed upload - remove the temporary message
        queryClient.setQueryData(["getChat", id], (oldData: any) => {
          if (!oldData) return oldData;

          // Remove the failed message
          const updatedMessages = { ...oldData.conversation.messages };

          for (const date in updatedMessages) {
            updatedMessages[date] = updatedMessages[date].filter(
              (msg: any) => msg.mesId !== tempMessageId
            );

            // If the date has no messages, remove the date
            if (updatedMessages[date].length === 0) {
              delete updatedMessages[date];
            }
          }

          return {
            ...oldData,
            conversation: {
              ...oldData.conversation,
              messages: updatedMessages,
            },
          };
        });

        console.error("Upload failed");
      }

      setMedia(null);

      setUploadProgress(0);
    } catch (error) {
      errorHandler(error);
      console.error("Error in media upload:", error);
      setMedia(null);
      setMessageType("text");
    }
  };

  const clearChats = () => {

    const messages = Object.values(data.conversation.messages)
      .flat()
      .map((msg: any) => msg.mesId);

    const payload = {
      messages,
      userId: user?.user.id,
      actionType: "clearChat"
    }
    socket?.emit("clear:chat", JSON.stringify(payload))

    queryClient.setQueryData(["getChat", id], (oldData: any) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        conversation: {
          ...oldData.conversation,
          messages: [],
        },
      };
    });

    queryClient.setQueryData(["allChats"], (allChatsData: any) => {
      if (!allChatsData || !allChatsData.users) return allChatsData;

      const updatedChats = allChatsData.users.map((d: any) =>
        d._id === id ? { ...d, lastMessage: null } : d
      );

      return { ...allChatsData, users: updatedChats };
    });


  }

  const blockOrUnBlockUser = () => {
    const isBlockedByYou = data?.conversation.isBlockedByYou
    queryClient.setQueryData(["getChat", id], (oldData: any) => {
      if (!oldData) return oldData;

      const newIsBlockedByYou = !oldData.conversation.isBlockedByYou;

      return {
        ...oldData,
        conversation: {
          ...oldData.conversation,
          isBlockedByYou: newIsBlockedByYou,
        },
      };
    });
    socket?.emit("block:user", { action: isBlockedByYou ? "unblock" : "block", roomId: id, userId: user?.user.id, actionType: "blockOrUnblock" });
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorPage message={error.message} />;

  return (
    <div className="flex flex-col w-full h-dvh sm:h-auo flex-1">
      {/* Header */}
      <MessageHeader
        id={id}
        clearChats={clearChats}
        blockOrUnBlockUser={blockOrUnBlockUser}
        data={data}
        queryClient={queryClient}
        socket={socket}
        accessToken={user?.user.accessToken as string}
        userId={user?.user.id as string}
      />

      <div className="flex-1 w-full h-full flex flex-col overflow-y-auto">
        {messageType === "text" && (
          <div
            id="individualChats"
            style={{
              height: "100%",
              overflow: "auto",
              display: "flex",
              flexDirection: "column-reverse",
            }}
          >
            <InfiniteScroll
              // @ts-ignore
              dataLength={Object.values(data?.conversation?.messages || {}).reduce((total: number, messages: any[]) => total + messages.length, 0)}
              next={fetchOlderMessages}
              style={{ display: "flex", flexDirection: "column-reverse" }} //To put endMessage and loader to the top.
              inverse={true}
              scrollThreshold={"300px"}
              initialScrollY={300}
              hasMore={data?.conversation.hasMore}
              loader={<InfiniteLoader />}
              scrollableTarget="individualChats"
            >
              <div style={{ height: 20 }}></div>
              <div className="p-2 sm:p-4 flex flex-col space-y-3">
                {Object.keys(data?.conversation?.messages || {}).map(
                  (date, dateIndex) => (
                    <div key={dateIndex} className="flex flex-col space-y-4">
                      <div className="text-center flex justify-center items-center ">
                        <p className="bg-gray-100 px-4 py-2 text-sm font-medium rounded-xl dark:bg-gray-800">
                          {date}
                        </p>
                      </div>
                      {data?.conversation?.messages[date].map(
                        (msg: any, index: number) => {
                          const isOwnMessage =
                            msg.senderId._id === user?.user.id;

                          return (
                            <MessageBody
                              setIsReplyOpen={setIsReplyOpen}
                              setReplyMessage={setReplyMessage}

                              key={index}
                              allMessages={data?.conversation.data?.conversation?.messages}

                              isOwnMessage={isOwnMessage}
                              msg={msg}
                              id={id}
                            />
                          );
                        }
                      )}
                    </div>
                  )
                )}
              </div>
            </InfiniteScroll>
          </div>
        )}
        <Preview
          media={media}
          messageType={messageType}
          setMedia={setMedia}
          setMessageType={setMessageType}
        />

      </div>

      {/* Input */}
      <InputText
        handleMessage={handleMessage}
        socket={socket}
        roomId={
          data?.conversation.isGroup
            ? data?.conversation.conversationId
            : data?.conversation.otherUser._id
        }
        isBlockedByYou={data?.conversation.isBlockedByYou}
        isBlockedByUser={data?.conversation.isBlockedByUser}
        conversationId={id}
        isGroup={data?.conversation.isGroup}
        userFullName={user?.user.fullName as string}
        senderId={user?.user.id as string}

      />
    </div>
  );
};

export default PrivateChat;
