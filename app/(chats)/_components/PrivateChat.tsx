// "use client";
// import { getPrivateChat } from "@/actions/chats";
// import {
//   errorHandler,
//   formatDate,
//   generateRandomChatId,
// } from "@/app/utils/helper";
// import { useSocketContext } from "@/components/providers/socket";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { FileText, Lock, X } from "lucide-react";
// import { useSession } from "next-auth/react";
// import React, { useEffect, useState } from "react";
// import InputText from "./InputText";
// import MessageBody from "./MessageBody";
// import MessageHeader from "./MessageHeader";
// import useMessageStore from "@/app/zustand/stores/message";
// import axios, { AxiosProgressEvent } from "axios";
// import { API, CHAT_MESSAGE_URL } from "@/app/utils/constants";

// const PrivateChat = ({ id }: { id: string }) => {
//   const { data: user } = useSession();
//   const { data, error, isError, isLoading } = useQuery({
//     queryKey: ["getChat", id],
//     queryFn: ({ queryKey }) => getPrivateChat(queryKey[1]),
//     enabled: !!id,
//   });
//   const queryClient = useQueryClient();
//   const { socket } = useSocketContext();
//   const { messageType, media, setMedia, setMessageType } = useMessageStore(
//     (state) => state
//   );
//   const [uploadProgress, setUploadProgress] = useState(0);

//   useEffect(() => {
//     // console.log(`Rendered`)
//     socket?.on("message", (socketData) => {
//       console.log(
//         socketData?.conversationId === id,
//         id,
//         socketData.conversationId,
//         socketData
//       );
//       if (socketData?.conversationId === id) {
//         queryClient.setQueryData(["getChat", id], (oldData: any) => {
//           if (!oldData) return oldData;
//           const formattedDate = formatDate(socketData.createdAt);
//           return {
//             ...oldData,
//             conversation: {
//               ...oldData.conversation,
//               messages: {
//                 ...oldData.conversation.messages,
//                 [formattedDate]: [
//                   ...(oldData?.conversation?.messages?.[formattedDate] || []),
//                   socketData,
//                 ],
//               },
//             },
//           };
//         });
//       }
//     });
//   }, [socket, id]);

//   const sendTextMessage = (
//     message: string,
//     setMessage: React.Dispatch<React.SetStateAction<string>>
//   ) => {
//     if (!message) return;
//     try {
//       const messageToSend = {
//         mesId: generateRandomChatId(),
//         senderId: {
//           _id: user?.user.id,
//           fullName: user?.user.fullName,
//           profilePic: user?.user.profilePic,
//         },
//         conversationId: id,
//         text: message,
//         roomId: data?.conversation.otherUser._id,
//         createdAt: new Date(Date.now()),
//       };

//       // Function to format date as "DD/MM/YYYY"

//       queryClient.setQueryData(["getChat", id], (oldData: any) => {
//         if (!oldData) return oldData;

//         const formattedDate = formatDate(messageToSend.createdAt);

//         return {
//           ...oldData,
//           conversation: {
//             ...oldData.conversation,
//             messages: {
//               ...oldData.conversation.messages,
//               [formattedDate]: [
//                 ...(oldData?.conversation?.messages?.[formattedDate] || []),
//                 messageToSend,
//               ],
//             },
//           },
//         };
//       });

//       socket?.emit(`message`, messageToSend);
//       setMessage("");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleMessage = (
//     message: string,
//     setMessage: React.Dispatch<React.SetStateAction<string>>
//   ) => {
//     if (messageType === "text") {
//       sendTextMessage(message, setMessage);
//     } else if (messageType === "image" || messageType === "video") {
//       sendMediaMessage();
//     }
//   };
//   const uploadMediaToAws = async (
//     media: File,
//     signedUrl: string,
//     onProgress: (progress: number) => void
//   ): Promise<boolean> => {
//     try {
//       const result = await axios.put(signedUrl, media, {
//         headers: {
//           "Content-Type": media.type,
//         },
//         onUploadProgress: (progressEvent: AxiosProgressEvent) => {
//           if (progressEvent.total) {
//             const percentCompleted = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             onProgress(percentCompleted);
//           }
//         },
//       });
//       if (result.status === 200) {
//         return true;
//       } else {
//         return false;
//       }
//     } catch (error) {
//       console.error("Upload failed:", error);
//       return false; // Upload failed
//     }
//   };

//   const sendMediaMessage = async () => {
//     if (!media) {
//       return;
//     }

//     setMessageType("text");

//     try {
//       const response = await axios.post(
//         `${API}/chats/generate-presignedurl`,
//         {
//           key: media?.name,
//           contentType: media?.type,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.user.accessToken}`,
//           },
//         }
//       );

//       const { signedUrl, key } = response.data;

//       // Start upload
//       const success = await uploadMediaToAws(
//         media,
//         signedUrl,
//         setUploadProgress
//       );

//       if (success) {
//         let messageToSend = {
//           mesId: generateRandomChatId(),
//           senderId: {
//             _id: user?.user.id,
//             fullName: user?.user.fullName,
//             profilePic: user?.user.profilePic,
//           },
//           type: messageType,
//           conversationId: id,
//           roomId: data?.conversation.otherUser._id,
//           createdAt: new Date(Date.now()),
//         };

//         const actualUrl = `${CHAT_MESSAGE_URL}${key}`

//         if (messageType === "image") {
//           messageToSend.imageUrl = actualUrl;
//         } else {
//           messageToSend.videoUrl = actualUrl;
//         }

//         // Function to format date as "DD/MM/YYYY"

//         queryClient.setQueryData(["getChat", id], (oldData: any) => {
//           if (!oldData) return oldData;

//           const formattedDate = formatDate(messageToSend.createdAt);

//           return {
//             ...oldData,
//             conversation: {
//               ...oldData.conversation,
//               messages: {
//                 ...oldData.conversation.messages,
//                 [formattedDate]: [
//                   ...(oldData?.conversation?.messages?.[formattedDate] || []),
//                   messageToSend,
//                 ],
//               },
//             },
//           };
//         });

//         socket?.emit(`message`, messageToSend);

//         console.log("Upload completed!");
//       } else {
//         console.log("Upload failed!");
//       }
//       setMedia(null);
//     } catch (error) {
//       errorHandler(error);
//       console.log(error);
//     }
//   };

//   console.log(uploadProgress, "uploadProgress")

//   const clearPreview = () => {
//     setMedia(null);
//     setMessageType("text");
//   };

//   const formatFileSize = (bytes: number) => {
//     if (bytes < 1024) return bytes + " B";
//     else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
//     else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
//   };

//   // Helper to get file extension
//   const getFileExtension = (filename: string): string => {
//     return filename?.split(".").pop()?.toUpperCase() || "";
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (isError) return <div>{error.message}</div>;

//   return (
//     <div className="flex flex-col flex-1 h-full">
//       {/* Header */}
//       <MessageHeader data={data} />

//       {/* Messages */}
//       <div className="flex-1 w-full overflow-y-auto">
//         {messageType === "text" && (
//           <>
//             <div className="flex items-center justify-center p-4 text-center">
//               <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-4 rounded-full">
//                 <Lock className="h-3 w-3" />
//                 <span className="text-xs">
//                   Messages are end-to-end encrypted
//                 </span>
//               </div>
//             </div>

//             <div className="min-h-full p-4 flex flex-col space-y-3">
//               {Object.keys(data?.conversation?.messages).map(
//                 (date, dateIndex) => (
//                   <div key={dateIndex} className="flex flex-col space-y-4">
//                     <div className="text-center flex justify-center items-center ">
//                       <p className="bg-gray-100  px-4 py-2 text-sm font-medium rounded-xl dark:bg-gray-800">
//                         {date}
//                       </p>
//                     </div>
//                     {data?.conversation?.messages[date].map(
//                       (msg: any, index: number) => {
//                         const isOwnMessage = msg.senderId._id === user?.user.id;

//                         return (
//                           <MessageBody
//                             key={index}
//                             isOwnMessage={isOwnMessage}
//                             msg={msg}
//                           />
//                         );
//                       }
//                     )}
//                   </div>
//                 )
//               )}
//             </div>
//           </>
//         )}

//         {media && messageType !== "text" && (
//           <div className=" border-t h-full ">
//             <div className="container h-full mx-auto p-4">
//               <div className="relative rounded-lg h-full overflow-hidden p-4">
//                 <button
//                   onClick={clearPreview}
//                   className="absolute top-2 right-2 p-1.5 rounded-full dark:text-white transition-colors"
//                 >
//                   <X className="h-6 w-6" />
//                 </button>

//                 {messageType === "image" && (
//                   <div className="flex flex-col justify-center h-full items-center">
//                     <img
//                       src={URL.createObjectURL(media)}
//                       alt="Preview"
//                       className="max-h-[450px] rounded-lg object-cover shadow-lg"
//                     />
//                     <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
//                       {media.name}
//                     </p>
//                   </div>
//                 )}

//                 {messageType === "video" && (
//                   <div className="flex flex-col justify-center h-full items-center">
//                     <video
//                       src={URL.createObjectURL(media)}
//                       controls
//                       className="max-h-[450px] rounded-lg shadow-lg"
//                     />
//                     <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
//                       {media.name}
//                     </p>
//                   </div>
//                 )}

//                 {messageType === "document" && (
//                   <div className="flex justify-center items-center h-full">
//                     <div className="flex flex-col max-w-md w-full rounded-lg border overflow-hidden">
//                       {/* Document Header */}
//                       <div className="flex items-center gap-3 p-3 ">
//                         <div className="w-12 h-12 flex items-center justify-center border rounded-full">
//                           <span className="text-xs font-medium  ">
//                             {getFileExtension(media.name)}
//                           </span>
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium truncate ">
//                             {media.name}
//                           </p>
//                           <p className="text-xs  ">
//                             {formatFileSize(media.size)}
//                           </p>
//                         </div>
//                       </div>

//                       {/* Document Footer */}
//                       <div className="flex items-center justify-between px-3 py-3 border-t dark:border-gray-700">
//                         <span className="text-xs  ">
//                           {media.type.split("/")[1].toUpperCase()}
//                         </span>
//                         <FileText className="h-4 w-4 " />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Input */}
//       <InputText handleMessage={handleMessage} />
//     </div>
//   );
// };

// export default PrivateChat;


"use client";
import { getPrivateChat } from "@/actions/chats";
import {
  errorHandler,
  formatDate,
  generateRandomChatId,
} from "@/app/utils/helper";
import { useSocketContext } from "@/components/providers/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FileText, Lock, X } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import InputText from "./InputText";
import MessageBody from "./MessageBody";
import MessageHeader from "./MessageHeader";
import useMessageStore from "@/app/zustand/stores/message";
import axios, { AxiosProgressEvent } from "axios";
import { API, CHAT_MESSAGE_URL } from "@/app/utils/constants";

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
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    socket?.on("message", (socketData) => {
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
    
    // Cleanup listener on unmount
    return () => {
      socket?.off("message");
    };
  }, [socket, id, queryClient]);

  const sendTextMessage = (
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
        type: "text", // Explicitly set type for consistency
        conversationId: id,
        text: message,
        roomId: data?.conversation.otherUser._id,
        createdAt: new Date(Date.now()),
      };

      updateMessageCache(messageToSend);
      socket?.emit(`message`, messageToSend);
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
    } else if (messageType === "image" || messageType === "video" || messageType === "document") {
      sendMediaMessage();
    }
  };

  // const handleMessage = (
  //   message: string,
  //   setMessage: React.Dispatch<React.SetStateAction<string>>
  // ) => {
  //   const data = {
  //     "mesId": "temp12345",
  //     "senderId": {
  //       "_id": "user123",
  //       "fullName": "John Doe",
  //       "profilePic": "https://example.com/profile.jpg"
  //     },
  //     "type": "video",
  //     "conversationId": "conv789",
  //     "roomId": "room567",
  //     "createdAt": "2025-02-24T12:00:00Z",
  //     "imageUrl": "blob:http://localhost/image123",
  //     "uploadProgress": 45
  //   }
  //   queryClient.setQueryData(["getChat", id], (oldData: any) => {
  //     if (!oldData) return oldData;

  //     const formattedDate = formatDate(data?.createdAt);

  //     return {
  //       ...oldData,
  //       conversation: {
  //         ...oldData.conversation,
  //         messages: {
  //           ...oldData.conversation.messages,
  //           [formattedDate]: [
  //             ...(oldData?.conversation?.messages?.[formattedDate] || []),
  //             data,
  //           ],
  //         },
  //       },
  //     };
  //   });
  // };

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

  // Helper function to update message cache
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
  };

  const sendMediaMessage = async () => {
    if (!media) return;

    setMessageType("text");

    try {
      // Create a temporary message to show upload progress
      const tempMessageId = generateRandomChatId();
      const tempMessage = {
        mesId: tempMessageId,
        senderId: {
          _id: user?.user.id,
          fullName: user?.user.fullName,
          profilePic: user?.user.profilePic,
        },
        type: messageType,
        conversationId: id,
        roomId: data?.conversation.otherUser._id,
        createdAt: new Date(Date.now()),
        // For image/video preview during upload
        ...(messageType === "image" && { 
          imageUrl: URL.createObjectURL(media),
          uploadProgress: 0 
        }),
        ...(messageType === "video" && { 
          videoUrl: URL.createObjectURL(media),
          uploadProgress: 0 
        }),
        ...(messageType === "document" && {
          text: media.name,
          fileSize: formatFileSize(media.size),
          uploadProgress: 0
        })
      };

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
      const success = await uploadMediaToAws(
        media,
        signedUrl,
        (progress) => {
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
        }
      );

      if (success) {
        const actualUrl = `${CHAT_MESSAGE_URL}${key}`;
        
        // Create final message
        const finalMessage = {
          mesId: tempMessageId, 
          senderId: {
            _id: user?.user.id,
            fullName: user?.user.fullName,
            profilePic: user?.user.profilePic,
          },
          type: messageType,
          conversationId: id,
          roomId: data?.conversation.otherUser._id,
          createdAt: new Date(Date.now()),
          ...(messageType === "image" && { imageUrl: actualUrl }),
          ...(messageType === "video" && { videoUrl: actualUrl }),
       
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

  const clearPreview = () => {
    setMedia(null);
    setMessageType("text");
  };



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

        {media && messageType !== "text" && (
          <div className="border-t h-full">
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
                          <span className="text-xs font-medium">
                            {getFileExtension(media.name)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {media.name}
                          </p>
                          <p className="text-xs">
                            {formatFileSize(media.size)}
                          </p>
                        </div>
                      </div>

                      {/* Document Footer */}
                      <div className="flex items-center justify-between px-3 py-3 border-t dark:border-gray-700">
                        <span className="text-xs">
                          {media.type.split("/")[1].toUpperCase()}
                        </span>
                        <FileText className="h-4 w-4" />
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
      <InputText handleMessage={handleMessage} />
    </div>
  );
};

export default PrivateChat;