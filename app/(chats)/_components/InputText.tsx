import { Send } from "lucide-react";
import React, { useState } from "react";
import DropdownButton from "./DropdownButton";

const InputText = ({
    handleMessage,
}: {
    handleMessage: (
        message: string,
        setMessage: React.Dispatch<React.SetStateAction<string>>
    ) => void;
}) => {
    const [message, setMessage] = useState("");
    return (
        <div className="p-3 flex items-center gap-2 bg-white dark:bg-[#0d0d0d] dark:text-white border-t light:border-gray-200">
            <DropdownButton />
            <div className="flex flex-1 items-center space-x-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleMessage(message, setMessage);
                        }
                    }}
                    className="flex-1 p-3 border light:border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-transparent bg-gray-50"
                />
                <button
                    className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                    onClick={() =>handleMessage(message, setMessage)}
                >
                    <Send className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};

export default InputText;
