import useFeatures from '@/app/zustand/stores/feature';
import { X } from 'lucide-react';
import React, { useState } from 'react'


const ReplyMessage = () => {
    const { isReplyOpen, setIsReplyOpen, setReplyMessage,replyMessage } = useFeatures((state) => state)

    if (!isReplyOpen) return null

    return (
        <div className=" p-3 border-y flex items-center">
            <div className="flex-1">
                <div className="flex items-center">
                    <div className="w-1 h-4 bg-blue-500 mr-2 rounded-full"></div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {(replyMessage.type === "text" || replyMessage.type === "reply") && replyMessage.text }
                        {replyMessage.type === "image" && "Image" }
                        {replyMessage.type === "video" && "Video" }
                        {replyMessage.type === "document" && "Document" }
                    </p>
                </div>

            </div>
            <button
                onClick={() => {
                    setIsReplyOpen(false);
                    setReplyMessage(null)
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
                <X size={18} />
            </button>
        </div>
    );
};


export default ReplyMessage