import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSocketContext } from "@/components/providers/socket";

interface DeleteMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: any;
  id: string;
  allMessages: any;
}

const DeleteMessageModal: React.FC<DeleteMessageModalProps> = ({
  isOpen,
  onClose,
  message,
  id,
  allMessages,
}) => {
  const [mounted, setMounted] = useState(false);
  const queryClient = useQueryClient();
  const { data: userData } = useSession();
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!isOpen) return;

    setMounted(true);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const onDeleteForEveryone = () => {
    queryClient.setQueryData(["getChat", id], (oldData: any) => {
      if (!oldData) return oldData;

      const updatedMessages = { ...oldData.conversation.messages };

      Object.keys(updatedMessages).forEach((date) => {
        updatedMessages[date] = updatedMessages[date].map((msg: any) =>
          msg.mesId === message.mesId ? { ...msg, status: "deleted" } : msg
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
      if (!oldData || !oldData.users) return oldData; 

      const updatedChat = oldData.users.map((d: any) =>
        d._id === id
          ? {
              ...d,
              lastMessage:
                d.lastMessage.mesId === message.mesId
                  ? { ...d.lastMessage, status: "deleted" } 
                  : { ...d.lastMessage },
            }
          : d
      );

      return { ...oldData, users: updatedChat };
    });

    socket?.emit("message:deleted", {
      roomId: id,
      userId: userData?.user.id,
      mesId: message.mesId,
      action: "deleteForEveryOne",
    });
    onClose();
  };
  
  const onDeleteForMe = () => {
    queryClient.setQueryData(["getChat", id], (oldData: any) => {
      if (!oldData || !oldData.conversation?.messages) return oldData;
  
      let lastMessage: any = null;
      const updatedMessages = { ...oldData.conversation.messages };
  
      Object.keys(updatedMessages).forEach((date, dateIndex, keys) => {
        let messages = updatedMessages[date];
  
        messages = messages.filter((msg: any, index: number) => {
          if (msg.mesId === message.mesId) {
            return false;
          }
          return true;
        });
  
        if (messages.length === 0) {
          delete updatedMessages[date];
  
          // Find last non-empty key
          for (let i = dateIndex - 1; i >= 0; i--) {
            const prevDate = keys[i];
            if (updatedMessages[prevDate] && updatedMessages[prevDate].length > 0) {
              lastMessage = updatedMessages[prevDate][updatedMessages[prevDate].length - 1];
              break;
            }
          }
        } else {
          updatedMessages[date] = messages;
          lastMessage = messages[messages.length - 1]; // Update lastMessage from current key
        }
      });
  
      if (lastMessage) {
        lastMessage.sender = lastMessage.senderId;
      }
  

      queryClient.setQueryData(["allChats"], (allChatsData: any) => {
        if (!allChatsData || !allChatsData.users) return allChatsData;
  
        const updatedChats = allChatsData.users.map((d: any) =>
          d._id === id ? { ...d, lastMessage } : d
        );
  
        return { ...allChatsData, users: updatedChats };
      });
  
      return {
        ...oldData,
        conversation: {
          ...oldData.conversation,
          messages: updatedMessages,
        },
      };
    });
  
    socket?.emit("message:deleted", {
      roomId: id,
      userId: userData?.user.id,
      mesId: message.mesId,
      action: "deleteForMe",
    });
  
    onClose();
  };
  
  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm z-50"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ scale: 1.1, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white dark:bg-black border w-[90%] z-50 rounded-xl shadow-2xl sm:w-[400px] overflow-hidden"
          >
            {/* Header */}
            <div className="py-4 px-5  flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete message?
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Actions */}
            <div className="p-3 gap-3 mt-2 flex text-sm items-end flex-col">
              {userData?.user.id === message.senderId._id && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onDeleteForEveryone}
                  className="w-[40%] min-w-[200px] py-2 rounded-md bg-red-500 text-white font-medium transition-colors duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
                >
                  Delete for everyone
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onDeleteForMe}
                className="w-[30%] min-w-[170px] py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white font-medium transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
              >
                Delete for me
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-[20%] min-w-[145px] py-2 text-black dark:text-white rounded-md bg-transparent font-medium  border border-gray-200 dark:border-gray-700 transition-colors duration-200 "
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteMessageModal;
