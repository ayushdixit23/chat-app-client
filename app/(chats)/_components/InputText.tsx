import { Send, Lock, Smile, X } from "lucide-react";
import React, { useState } from "react";
import { Socket } from "socket.io-client";
import DropdownButton from "./DropdownButton";
import { motion, AnimatePresence } from "framer-motion";
import ReplyMessage from "./ReplyMessage";
import { useTheme } from "next-themes";
import EmojiPicker from "emoji-picker-react";

const InputText = ({
  handleMessage,
  socket,
  roomId,
  conversationId,
  isGroup,
  userFullName,
  senderId,
  isBlockedByYou,
  isBlockedByUser,
}: {
  handleMessage: (
    message: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>
  ) => void;
  socket: Socket | null;
  roomId: string;
  conversationId: string;
  isGroup: boolean;
  userFullName: string;
  senderId: string;
  isBlockedByYou: boolean;
  isBlockedByUser: boolean;
}) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  let typingTimeout: NodeJS.Timeout;
  const { theme } = useTheme();
  const [isEmojiOpened, setIsEmojiOpened] = useState(false);

  // Function to handle typing event with debounce
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket?.emit("typing", {
        roomId,
        conversationId,
        isGroup,
        fullName: userFullName,
        senderId,
      });
    }

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      setIsTyping(false);
      socket?.emit("not-typing", {
        roomId,
        conversationId,
        isGroup,
        fullName: userFullName,
        senderId,
      });
    }, 2500);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    handleTyping();
  };

  const handleMessageWithTyping = () => {
    if (isEmojiOpened) {
      setIsEmojiOpened(false)
    }
    socket?.emit("not-typing", {
      roomId,
      conversationId,
      isGroup,
      fullName: userFullName,
      senderId,
    });
    handleMessage(message, setMessage);
  };

  // Check if any blocking is happening
  const isBlocked = isBlockedByYou || isBlockedByUser;

  // Determine blocking message
  const getBlockMessage = () => {
    if (isBlockedByYou && isBlockedByUser) {
      return "You both have blocked each other";
    } else if (isBlockedByYou) {
      return "You have blocked this user";
    } else if (isBlockedByUser) {
      return "You have been blocked by this user";
    }
    return "";
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage((prev) => prev + emoji.emoji); // Append emoji to input field
  };

  // return (
  //   <>
  //     <AnimatePresence>
  //       {isEmojiOpened && (
  //         <motion.div
  //           initial={{ opacity: 0, y: 10 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           exit={{ opacity: 0, y: 10 }}
  //           className="w-full"
  //         >
  //           <EmojiPicker
  //             width="100%"
  //             height={400}
  //             searchDisabled={false}
  //             emojiSize={28}
  //             emojiButtonSize={36}
  //             previewConfig={{ showPreview: false }}
  //             // @ts-ignore
  //             categories={["smileys_people", "animals_nature", "food_drink", "activities", "travel_places", "objects", "symbols"]} // Keep essential categories
  //             autoFocusSearch={false}
  //             // @ts-ignore
  //             theme={theme}
  //             onEmojiClick={handleEmojiSelect}
  //           />
  //         </motion.div>
  //       )}
  //     </AnimatePresence>
  //     <div className="bg-white relative dark:bg-[#0d0d0d] dark:text-white border-t light:border-gray-200">
  //       <ReplyMessage />

  //       <AnimatePresence>
  //         {isBlocked ? (
  //           <motion.div
  //             initial={{ opacity: 0, y: 10 }}
  //             animate={{ opacity: 1, y: 0 }}
  //             exit={{ opacity: 0, y: 10 }}
  //             className="p-4 flex items-center justify-center"
  //           >
  //             <div className="flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-3 rounded-lg w-full">
  //               <Lock className="h-5 w-5 mr-2" />
  //               <span className="font-medium">{getBlockMessage()}</span>
  //             </div>
  //           </motion.div>
  //         ) : (
  //           <motion.div
  //             initial={{ opacity: 0, y: 10 }}
  //             animate={{ opacity: 1, y: 0 }}
  //             exit={{ opacity: 0, y: 10 }}
  //             className="p-3 flex items-center gap-2"
  //           >
  //             {isEmojiOpened ? (
  //               <X
  //                 onClick={() => setIsEmojiOpened(false)}
  //                 size={22}
  //                 className="ml-2 text-black dark:text-white"
  //               />
  //             ) : (
  //               <Smile
  //                 onClick={() => setIsEmojiOpened(true)}
  //                 size={22}
  //                 className="ml-2 text-black dark:text-white"
  //               />
  //             )}

  //             <DropdownButton />

  //             <div className="flex flex-1 items-center space-x-2">
  //               <input
  //                 type="text"
  //                 value={message}
  //                 onChange={handleMessageChange}
  //                 placeholder="Type a message..."
  //                 onKeyDown={(e) => {
  //                   if (e.key === "Enter") {
  //                     handleMessageWithTyping();
  //                   }
  //                 }}
  //                 className="flex-1 p-3 border light:border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-transparent bg-gray-50"
  //               />
  //               <motion.button
  //                 className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
  //                 onClick={handleMessageWithTyping}
  //                 whileHover={{ scale: 1.05 }}
  //                 whileTap={{ scale: 0.95 }}
  //                 disabled={message.trim() === ""}
  //                 initial={{ opacity: 0.9 }}
  //                 animate={{
  //                   opacity: message.trim() === "" ? 0.7 : 1,
  //                   backgroundColor:
  //                     message.trim() === "" ? "#60a5fa" : "#3b82f6",
  //                 }}
  //               >
  //                 <Send className="h-5 w-5" />
  //               </motion.button>
  //             </div>
  //           </motion.div>
  //         )}
  //       </AnimatePresence>
  //     </div>
  //   </>
  // );

  return (
    <>
      <AnimatePresence>
        {isEmojiOpened && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full"
          >
            <EmojiPicker
              width="100%"
              height={300} // Reduced height for mobile
              searchDisabled={false}
              emojiSize={24} // Smaller emojis
              emojiButtonSize={32} // Smaller buttons
              previewConfig={{ showPreview: false }}
              // @ts-ignore
              categories={["smileys_people", "animals_nature", "food_drink", "travel_places", "symbols"]} // Reduced categories
              autoFocusSearch={false}
              // @ts-ignore
              theme={theme}
              onEmojiClick={handleEmojiSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white relative dark:bg-[#0d0d0d] dark:text-white border-t light:border-gray-200">
        <ReplyMessage />

        <AnimatePresence>
          {isBlocked ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-2 sm:p-4 flex items-center justify-center"
            >
              <div className="flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-2 sm:p-3 rounded-lg w-full text-sm sm:text-base">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="font-medium">{getBlockMessage()}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-2 sm:p-3 flex items-center gap-1 sm:gap-2"
            >
              {/* Action Buttons */}
              <div className="flex items-center">
                {isEmojiOpened ? (
                  <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <X
                      onClick={() => setIsEmojiOpened(false)}
                      size={20}
                      className="text-black dark:text-white"
                    />
                  </button>
                ) : (
                  <button className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Smile
                      onClick={() => setIsEmojiOpened(true)}
                      size={20}
                      className="text-black dark:text-white"
                    />
                  </button>
                )}

                {/* Place dropdown in a container to control sizing */}
                <div>
                  <DropdownButton />
                </div>
              </div>

              {/* Message Input and Send Button */}
              <div className="flex flex-1 items-center space-x-1 sm:space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Type a message..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleMessageWithTyping();
                    }
                  }}
                  className="flex-1 p-2 sm:p-3 text-sm sm:text-base border light:border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-transparent bg-gray-50"
                />

                <motion.button
                  className="p-2 sm:p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                  onClick={handleMessageWithTyping}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={message.trim() === ""}
                  initial={{ opacity: 0.9 }}
                  animate={{
                    opacity: message.trim() === "" ? 0.7 : 1,
                    backgroundColor: message.trim() === "" ? "#60a5fa" : "#3b82f6",
                  }}
                >
                  <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.button>
              </div>

              {/* Mobile dropdown button - shown only on small screens */}
            
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
};

export default InputText;
