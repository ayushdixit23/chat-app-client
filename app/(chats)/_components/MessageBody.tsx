import { File } from "lucide-react";
import React from "react";
import CircularProgress from "./CircularProgress";

const UploadImage = ({ msg }: { msg: any }) => (
  <div className="space-y-2 container w-[300px] h-[250px]">
    {msg.uploadProgress !== undefined && msg.uploadProgress < 100 ? (
      <div className="relative rounded-md w-full h-[250px] flex items-center justify-center">
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
        <img
          src={msg.imageUrl}
          alt="Uploaded"
          className="w-full max-w-sm rounded-md"
        />
      </div>
    )}
  </div>
);

const UploadDocument = ({ msg, isOwnMessage }: { msg: any, isOwnMessage: boolean }) => {
  return (
    <div className="flex items-center p-2 border border-gray-200 rounded-md">
      <File
        className={`${isOwnMessage ? "text-blue-300" : "text-blue-500"} mr-3`}
        size={36}
      />
      <div className="flex-1">
        <p className="text-sm font-medium whitespace-pre-wrap break-words">
          {msg.text}
        </p>
        <p className="text-xs text-gray-500">{msg.fileSize}</p>

        {/* Upload Progress UI */}

      </div>

      {/* View Button */}

      {msg.uploadProgress !== undefined && msg.uploadProgress < 100 ? (
        <div className="mt-2 flex items-center space-x-2">
          <CircularProgress progress={msg.uploadProgress} />

        </div>
      ) : <button
        className={`px-3 py-1 ${isOwnMessage ? "bg-blue-400 text-white" : "bg-gray-100 text-gray-700"
          } text-sm rounded-md hover:opacity-90 ${msg.uploadProgress !== undefined && msg.uploadProgress < 100
            ? "opacity-50 cursor-not-allowed"
            : ""
          }`}
        disabled={msg.uploadProgress !== undefined && msg.uploadProgress < 100}
      >
        View
      </button>}

    </div>
  );
};


const UploadVideo = ({ msg }: { msg: any }) => (
  <div className="space-y-2 w-[300px] h-[250px]">
    {msg.uploadProgress !== undefined && msg.uploadProgress < 100 ? (
      <div className="relative rounded-md w-full h-full flex items-center justify-center backdrop:blur-sm">
        {/* Video Preview */}
        {msg.videoUrl && (
          <video
            src={msg.videoUrl}
            poster={msg.videoUrl}
            className="w-full h-full object-cover rounded-md "
            muted
            loop
          />
        )}
        {/* Upload Progress */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <CircularProgress progress={msg.uploadProgress} />
        </div>
      </div>
    ) : (
      // Display final uploaded video
      <div className="relative w-full h-full">
        <video
          src={msg.videoUrl}
          poster={msg.videoUrl}
          className="w-full h-full object-cover rounded-md"
          controls
        />
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
  console.log(msg);

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
            <p className="text-sm whitespace-pre-wrap break-words">
              {msg.text}
            </p>
          )}

          {msg.type === "image" && <UploadImage msg={msg} />}
          {msg.type === "video" && <UploadVideo msg={msg} />}
          {msg.type === "document" && <UploadDocument msg={msg} isOwnMessage={isOwnMessage} />}
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
