import React from 'react'

const NoChats = () => {
    return (
        <div className="hidden text-center sm:flex flex-1 justify-center items-center flex-col gap-4">
            <h2 className="text-2xl font-bold dark:text-white text-gray-700">
                Select a conversation
            </h2>
            <p className="dark:text-white text-gray-500">
                Choose a chat from the list to start messaging.
            </p>
        </div>
    )
}

export default NoChats