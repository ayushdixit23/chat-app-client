import { Send } from "lucide-react";
import React, { useState } from "react";
import DropdownButton from "./DropdownButton";
import { Socket } from "socket.io-client";

const InputText = ({
  handleMessage,
  socket,
  roomId,
  conversationId
}: {
  handleMessage: (
    message: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>
  ) => void;
  socket: Socket | null;
  roomId: string;
  conversationId: string;
}) => {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  let typingTimeout: NodeJS.Timeout;

  // Function to handle typing event with debounce
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket?.emit("typing", {roomId,conversationId });
    }

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      setIsTyping(false);
      socket?.emit("not-typing", { roomId, conversationId});
    }, 2500);
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    handleTyping();
  };

  const handleMessageWithTyping = () => {
    socket?.emit("not-typing", { roomId,conversationId });
    handleMessage(message, setMessage);
  };

  return (
    <div className="p-3 flex items-center gap-2 bg-white dark:bg-[#0d0d0d] dark:text-white border-t light:border-gray-200">
      <DropdownButton />
      <div className="flex flex-1 items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
                handleMessageWithTyping()
            }
          }}
          className="flex-1 p-3 border light:border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-transparent bg-gray-50"
        />
        <button
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          onClick={handleMessageWithTyping}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default InputText;
