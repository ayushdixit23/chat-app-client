"use client"
import useSearchStore from '@/app/zustand/stores/search'
import { Search } from 'lucide-react'
import React from 'react'

const ChatSearch = () => {
    const { searchText, setSearchText } = useSearchStore((state) => state)
    return (
        <div className="relative">
            <input
                type="text"
                value={searchText}
                onChange={(e)=>setSearchText(e.target.value)}
                placeholder="Search chats..."
                className="w-full p-2 pl-8 rounded-lg border light:border-gray-300 focus:outline-none light:focus:border-blue-500 dark:bg-transparent bg-gray-50"
            />
            <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
        </div>

    )
}

export default ChatSearch