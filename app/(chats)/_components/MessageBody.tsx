import { File, Download, Check, Loader } from "lucide-react";
import React, { useState } from "react";
import CircularProgress from "./CircularProgress";
import axios from "axios";
import { API } from "@/app/utils/constants";
import { useSession } from "next-auth/react";
import Video from "@/components/Video";

const ManageImage = ({ msg }: { msg: any }) => (
  <div className="space-y-2 w-full max-w-[350px]">
    {msg.uploadProgress !== undefined && msg.uploadProgress < 100 ? (
      <div className="relative rounded-md w-full aspect-video flex items-center justify-center">
        {/* Image Preview */}
        {msg.imageUrl && (
          <img
            src={msg.imageUrl}
            alt="Uploading..."
            className="w-full h-full object-cover rounded-md opacity-40 blur-sm"
          />
        )}
        {/* Upload Progress */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <CircularProgress progress={msg.uploadProgress} />
        </div>
      </div>
    ) : (
      // Display final uploaded image
      <div className="relative">
        <img src={msg.imageUrl} alt="Uploaded" className="w-full rounded-md" />
      </div>
    )}
  </div>
);

const ReadStatus = ({ isSeen }: { isSeen: boolean }) => {
  if (!isSeen) {
    // Single tick for sent but not seen
    return <Check size={14} className="text-white" />;
  } else {
    // Double tick for seen messages
    return (
      <div className="flex">
        <Check size={14} className="text-white" />
        <Check size={14} className="text-white -ml-1" />
      </div>
    );
  }
};

const ManageDocument = ({
  msg,
  isOwnMessage,
}: {
  msg: any;
  isOwnMessage: boolean;
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { data } = useSession();

  const handleDownload = async () => {
    if (isDownloading || isDownloaded) return;

    setIsDownloading(true);

    try {
      const res = await axios.post(
        `${API}/chats/generateDowloadUrl`,
        {
          url: msg.document.url,
        },
        {
          headers: {
            Authorization: `Bearer ${data?.user.accessToken}`,
          },
        }
      );
      const link = document.createElement("a");
      link.href = res.data.url;
      link.download = msg.document.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloaded(true);
    } catch (error) {
      console.error("Download failed", error);
    } finally {
      setIsDownloading(false);
    }
  };
  return (
    <div className="flex items-center gap-6 p-2 border border-gray-200 rounded-md">
      <div className="flex items-center gap-2">
        <File
          className={`${isOwnMessage ? "text-white" : "text-blue-500"}`}
          size={30}
        />
        <div>
          <p className="text-sm font-medium whitespace-pre-wrap break-words">
            {msg.document.name}
          </p>
          <p className="text-xs text-gray-500">{msg.document.size}</p>

          {/* Upload Progress UI */}
        </div>
      </div>

      {/* View Button */}

      {msg.uploadProgress !== undefined && msg.uploadProgress < 100 ? (
        <div className="mt-2 flex items-center space-x-2">
          <CircularProgress progress={msg.uploadProgress} />
        </div>
      ) : (
        <button
          className={`px-2 py-1 rounded-ful1 flex items-center gap-2 ${isOwnMessage
              ? "bg-blue-400 text-white"
              : "bg-gray-100 dark:bg-transparent dark:border dark:text-white text-gray-700"
            } 
        text-sm rounded-md hover:opacity-90 transition-all duration-200 
        ${isDownloading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader className="animate-spin" size={18} />
          ) : isDownloaded ? (
            <Check size={18} />
          ) : (
            <Download size={18} />
          )}
        </button>
      )}
    </div>
  );
};

const ManageVideo = ({ msg }: { msg: any }) => (
  <div className="space-y-2 w-full max-w-[350px]">
    {msg.uploadProgress !== undefined && msg.uploadProgress < 100 ? (
      <div className="relative rounded-md w-full aspect-video flex items-center justify-center">
        {/* Video Preview */}
        {msg.videoUrl && (
          <div className="w-[300px] h-[200px]">
            <Video url={msg.videoUrl} />
          </div>
        )}
        {/* Upload Progress */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <CircularProgress progress={msg.uploadProgress} />
        </div>
      </div>
    ) : (
      // Display final uploaded video
      <div className="relative w-full">
        <div className="w-[350px] h-full">
          <Video url={msg.videoUrl} />
        </div>
      </div>
    )}
  </div>
);

const MessageBody = ({
  isOwnMessage,
  msg,
}: {
  isOwnMessage: boolean;
  msg: any;
}) => {
  return (
    <div
      className={`flex items-end ${isOwnMessage ? "justify-end" : "justify-start"
        } space-x-2`}
    >
      {!isOwnMessage && (
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img
              src={msg.senderId.profilePic}
              alt={msg.senderId.fullName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div
        className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"
          }`}
      >
        <div
          className={`relative inline-block max-w-[280px] md:max-w-[420px] ${isOwnMessage
              ? "bg-blue-500 text-white"
              : "bg-white dark:bg-transparent dark:text-white dark:border"
            } px-4 py-3 rounded-xl shadow-sm`}
        >
          {msg.type === "text" && (
            <p className="text-sm whitespace-pre-wrap break-words ">
              {msg.text}
            </p>
          )}


          {msg.type === "image" && <ManageImage msg={msg} />}
          {msg.type === "video" && <ManageVideo msg={msg} />}
          {msg.type === "document" && (
            <ManageDocument msg={msg} isOwnMessage={isOwnMessage} />
          )}
        </div>
        {/* <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span> */}

<div className="flex items-center mt-1 px-1 space-x-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          
          {isOwnMessage && (
            <ReadStatus isSeen={msg.isSeen} />
          )}
        </div>
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
