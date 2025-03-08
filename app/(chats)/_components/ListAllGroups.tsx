import { extractHourMinutes } from '@/app/utils/helper'
import Link from 'next/link'
import React from 'react'

const ListAllGroups = ({ group, data }: { group: any, data: any }) => {
    // console.log(group,"grou")
    return (
        <Link
            href={`?id=${group._id}`}
            className="flex items-center p-4 light:hover:bg-gray-50 cursor-pointer border-b light:border-gray-100"
        >
            <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                    src={group.groupPic}
                    alt={group.groupName}
                    className="w-full h-full object-cover"
                />

                <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${group?.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}
                />
            </div>

            <div className="ml-3 flex-1">
                <div className="flex justify-between">
                    <h3 className="font-semibold dark:text-white text-sm text-gray-900">
                        {group.groupName.length > 20 ? `${group.groupName.slice(0, 20)}...` : group.groupName}
                    </h3>
                    <span className="text-xs dark:text-white text-gray-500">
                        {group?.lastMessage.createdAt ? extractHourMinutes(group?.lastMessage.createdAt) : ""}
                    </span>
                </div>
                <div className="flex justify-between">
                    <p className="text-xs mt-[4px] dark:text-white text-gray-500 truncate">
                        {group.lastMessage && group.lastMessage?.type === "text" && (
                            <>
                                {group.lastMessage?.text
                                    ? `${group.lastMessage?.sender?._id === data?.user.id
                                        ? "You: "
                                        : `${group.lastMessage.sender.fullName}: `
                                    }${group.lastMessage?.text.length > 20 ? `${group.lastMessage?.text.slice(0, 20)}...` : group.lastMessage?.text}`
                                    : `Start Conversation with ${group.groupName?.slice(0, 5)}...`}
                            </>
                        )}

                        {!group.lastMessage?.type && (
                            <>Start Conversation with {group.chatName?.slice(0, 5)}...</>
                        )}

                        {group.lastMessage && group.lastMessage?.type === "image" && (
                            <>
                                {group.lastMessage?.sender?._id === data.group.id ? "You: " : ""}
                                sent an image
                            </>
                        )}

                        {group.lastMessage && group.lastMessage?.type === "video" && (
                            <>
                                {group.lastMessage?.sender?._id === data.group.id ? "You: " : ""}
                                sent a video
                            </>
                        )}

                        {group.lastMessage && group.lastMessage?.type === "document" && (
                            <>
                                {group.lastMessage?.sender?._id === data.group.id ? "You: " : ""}
                                sent a document
                            </>
                        )}
                    </p>
                    {group?.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {group?.unread}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default ListAllGroups