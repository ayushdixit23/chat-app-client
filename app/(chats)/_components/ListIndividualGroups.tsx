import { clearUnReadMessages, extractHourMinutes } from '@/app/utils/helper';
import Link from 'next/link';
import React from 'react';

const ListAllGroups = ({ group, data, queryClient }: { group: any, data: any, queryClient: any }) => {
    const { _id, groupPic, groupName, lastMessage, unreadMessages } = group;

    // Function to format last message preview
    const renderLastMessage = () => {
        if (!lastMessage) return `Start Conversation in ${groupName.slice(0, 5)}...`;

        const senderPrefix = lastMessage.sender?._id === data?.user.id ? "You: " : `${lastMessage?.sender?.fullName?.split(" ")[0]}: `;

        switch (lastMessage.type) {
            case "text":
                return lastMessage.text
                    ? `${senderPrefix}${lastMessage.text.length > 20 ? `${lastMessage.text.slice(0, 20)}...` : lastMessage.text}`
                    : `Start Conversation with ${groupName.slice(0, 5)}...`;
            case "image":
                return `${senderPrefix}sent an image`;
            case "video":
                return `${senderPrefix}sent a video`;
            case "document":
                return `${senderPrefix}sent a document`;
            default:
                return `Start Conversation in ${groupName.slice(0, 5)}...`;
        }
    };

    return (
        <Link onClick={() => clearUnReadMessages(queryClient, _id,true)} href={`?id=${_id}`} className="flex items-center p-4 light:hover:bg-gray-50 cursor-pointer border-b light:border-gray-100">
            {/* Group Profile Picture */}
            <div className="w-10 h-10 rounded-full overflow-hidden relative">
                <img src={groupPic} alt={groupName} className="w-full h-full object-cover" />
            </div>

            {/* Group Details */}
            <div className="ml-3 flex-1">
                <div className="flex justify-between">
                    <h3 className="font-semibold dark:text-white text-sm text-gray-900">
                        {groupName?.length > 20 ? `${groupName?.slice(0, 20)}...` : groupName}
                    </h3>
                    <span className="text-xs dark:text-white text-gray-500">
                        {lastMessage?.createdAt ? extractHourMinutes(lastMessage.createdAt) : ""}
                    </span>
                </div>

                <div className="flex justify-between">
                    <p className="text-xs mt-[4px] dark:text-white text-gray-500 truncate">
                        {renderLastMessage()}
                    </p>
                    {unreadMessages > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadMessages}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ListAllGroups;