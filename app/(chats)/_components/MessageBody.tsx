import {
  File,
  Download,
  Check,
  Loader,
  MoreVertical,
  Reply,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import CircularProgress from "./CircularProgress";
import axios from "axios";
import { API } from "@/app/utils/constants";
import { useSession } from "next-auth/react";
import Video from "@/components/Video";
import { motion, AnimatePresence } from "framer-motion";
import DeleteMessageModal from "./DeleteMessageModal";

const MessageOptions = ({
  isOwnMessage,
  msg,
  // onReply,
  id,
  allMessages,
  setIsReplyOpen,
  setReplyMessage
}: {
  isOwnMessage: boolean;
  msg: any;
  // onReply: (message: any) => void;
  id: string
  allMessages: any,
  setIsReplyOpen: (value: boolean) => void
  setReplyMessage: (value: any) => void
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)


  const toggleOptions = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setShowOptions(!showOptions);
  };

  const handleReply = (e: React.MouseEvent) => {
    e.stopPropagation();
    // onReply(msg);
    setIsReplyOpen(true)
    setReplyMessage(msg)
    setShowOptions(false);
  };

  const openDeleteModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteModalOpen(true)
    setShowOptions(false);
  };

  const closeDeleteModal = () => setIsDeleteModalOpen(false)

  return (
    <>
      <div onClick={() => setShowOptions(false)} className={`fixed inset-0 w-full h-full ${showOptions ? "z-10" : "-z-10"} `}>

      </div>
      <div className="relative w-full flex justify-end items-end">
        <button
          onClick={toggleOptions}
          className={`p-1 rounded-full transition-all duration-200 ${isOwnMessage
            ? "text-white "
            : "text-gray-600 dark:text-gray-400"
            }`}
        >
          <MoreVertical size={16} />
        </button>

        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`absolute z-10 ${isOwnMessage ? "right-0" : "left-0"
                } mt-1 w-32 bg-white dark:bg-[#0d0d0d] rounded-md shadow-lg py-1 border  `}
            >
              <motion.button
                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReply}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <Reply size={14} />
                Reply
              </motion.button>
              <motion.button
                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={openDeleteModal}
                className="w-full text-left px-3 py-2 text-sm text-red-600 flex items-center gap-2"
              >
                <Trash2 size={14} />
                Delete
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        <DeleteMessageModal
          isOpen={isDeleteModalOpen}
          allMessages={allMessages}
          onClose={closeDeleteModal}
          message={msg}
          id={id}
        />

      </div>
    </>

  );
};

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
    return <Check size={14} className="dark:text-white" />;
  } else {
    // Double tick for seen messages
    return (
      <div className="flex">
        <Check size={14} className="dark:text-white" />
        <Check size={14} className="dark:text-white -ml-1" />
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

// ManageReply component to handle reply-type messages
const ManageReply = ({ msg, isOwnMessage }: { msg: any, isOwnMessage: any }) => {
  const originalMessage = msg.replyMessage;

  // Check if we have valid reply data
  if (!originalMessage) {
    return (
      <div className="text-sm whitespace-pre-wrap break-words">
        {msg.text}
      </div>
    );
  }

  const originalSenderName = originalMessage.senderId?.fullName || "Unknown user";


  // Determine the display text for the original message
  const originalText = originalMessage.text
 
    // Scroll to the original message
    const handleScrollToOriginal = () => {
      const originalMsgElement = document.getElementById(`message-${originalMessage.mesId}`);
     
      if (originalMsgElement) {
        originalMsgElement.scrollIntoView({ behavior: "smooth", block: "center" });

        originalMsgElement.classList.add("highlight");
  
        // Remove highlight after 1.5 seconds
        setTimeout(() => {
          originalMsgElement.classList.remove("highlight");
        }, 1500);
      }
      }
  

  return (
    <div className="flex flex-col space-y-2">

      <div
        className={`rounded-md ${isOwnMessage
            ? 'bg-blue-600/40 text-white/90'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
      >
        <div onClick={handleScrollToOriginal} className="flex cursor-pointer p-2">
          <div className="w-1 h-5 bg-gray-400 dark:bg-gray-500 rounded-full flex-shrink-0 mr-2"></div>
          <div className="flex flex-col">
            <span className="font-medium text-xs">
              {originalSenderName.length > 20 ? `${originalSenderName.slice(0, 20)}...` : originalSenderName}
            </span>
            <p className={`text-xs mt-0.5 line-clamp-2`}>
              {originalText}
            </p>
          </div>
        </div>
      </div>

      {/* Reply message */}
      <div className="text-sm whitespace-pre-wrap break-words">
        {msg.text}
      </div>
    </div>
  );
};

const MessageBody = ({
  isOwnMessage,
  msg,
  setIsReplyOpen,
  id,
  allMessages,
  setReplyMessage
}: {
  isOwnMessage: boolean;
  msg: any;
  id: string
  allMessages: any,
  setIsReplyOpen: (value: boolean) => void
  setReplyMessage: (value: any) => void
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
        id={`message-${msg.mesId}`}
          className={`relative flex justify-between items-center w-full max-w-[280px] md:max-w-[420px] ${isOwnMessage
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-transparent dark:text-white dark:border"
            }  rounded-xl shadow-sm`}
        >
          <div className="w-[90%] px-4 py-3 ">

            {msg.status === "deleted" ? (
              <p className="text-sm italic whitespace-pre-wrap break-words">
                This message is deleted
              </p>
            ) : (
              <>
                {msg.type === "text" && (
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.text}</p>
                )}
                {msg.type === "image" && <ManageImage msg={msg} />}
                {msg.type === "video" && <ManageVideo msg={msg} />}
                {msg.type === "document" && (
                  <ManageDocument msg={msg} isOwnMessage={isOwnMessage} />
                )}
                {msg.type === "reply" && (
                  <ManageReply msg={msg} isOwnMessage={isOwnMessage} />
                )}

              </>
            )}
          </div>

          <div className="pr-1">
            <MessageOptions
              isOwnMessage={isOwnMessage}
              msg={msg}
              id={id}
              setReplyMessage={setReplyMessage}
              // onReply={onReply}
              setIsReplyOpen={setIsReplyOpen}
              allMessages={allMessages}
            />
          </div>
        </div>

        <div className="flex items-center mt-1 px-1 space-x-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isOwnMessage && msg.status !== "deleted" && <ReadStatus isSeen={msg.isSeen} />}
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
