"use client"
import React, { useState } from 'react';
import {
    UserPlus, UserCheck, UserX, X, Plus, Check
} from 'lucide-react';
import { fetchSuggestedUser } from '@/actions/request';
import { useQuery } from '@tanstack/react-query';
import { User } from '@/types/next-auth';
import Image from 'next/image';



const ChatInterface = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const { data: suggestedUsers, error, isError, isLoading } = useQuery({ queryKey: ["suggestion"], queryFn: fetchSuggestedUser })


    if (isLoading) {
        return <>
            <div>Loading...</div>
        </>
    }

    if (isError) {
        return <>
            <div>{error.message}</div>
        </>
    }

    let friendRequests = {
        users: suggestedUsers?.users
    }

    return (
        <div className="flex w-full h-screen bg-gray-50">
            <div className="w-1/3 bg-gray-50 overflow-y-auto p-4">

                {/* Friends List */}


                {/* {friendRequest.users.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
                            Friend Requests ({suggestedUsers.users.length})
                        </h2>
                        <div className="space-y-4">
                            {suggestedUsers.users.map((user: User) => (
                                <div
                                    key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <Image src={user.profilePic} alt={user.fullName} width={50} height={50} className="w-12 h-12 rounded-full" />
                                        <div className="ml-4">
                                            <h3 className="font-medium text-gray-900">{user.fullName}</h3>
                                            <p className="text-sm text-gray-500">{user.userName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button

                                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            <UserCheck className="h-5 w-5" />
                                        </button>
                                        <button

                                            className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                                        >
                                            <UserX className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )} */}

                {friendRequests.users.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
                            Friend Requests ({friendRequests.users.length})
                        </h2>
                        <div className="space-y-4">
                            {friendRequests.users.map((user: User) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={user.profilePic}
                                            alt={user.fullName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="ml-4">
                                            <h3 className="font-medium text-gray-900">{user.fullName}</h3>
                                            <p className="text-sm text-gray-500">{user.userName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">

                                        <button
                                            onClick={() => onRejectRequest(user._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => onAcceptRequest(user._id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        >
                                            <Check className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {suggestedUsers.users.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
                            Suggestions
                        </h2>
                        <div className="space-y-4">
                            {suggestedUsers.users.map((user: User) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={user.profilePic}
                                            alt={user.fullName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="ml-4">
                                            <h3 className="font-medium text-gray-900">{user.fullName}</h3>
                                            <p className="text-sm text-gray-500">{user.userName}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onAddFriend(user._id)}
                                        className="w-8 h-8 bg-blue-500 rounded-full text-white justify-center hover:bg-blue-600 flex items-center space-x-2 transition-colors"
                                    >
                                        <Plus className="h-4 w-4" />
                                      
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* User Info Panel */}
            {/* {selectedUser && (
                <div className="w-2/3 bg-white p-8 shadow-lg flex flex-col items-center">
                    <div className="flex flex-col items-center text-center">
                        <img src={selectedUser.image} alt={selectedUser.name} className="w-24 h-24 rounded-full shadow-md border-4 border-gray-200" />
                        <h2 className="text-2xl font-semibold mt-4">{selectedUser.name}</h2>
                        <p className="text-gray-500">{selectedUser.email}</p>
                        <p className="text-gray-500 mt-2">{selectedUser.status} - {selectedUser.lastSeen}</p>
                    </div>
                    <div className="mt-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-3">Mutual Friends</h3>
                        <ul className="bg-gray-100 rounded-lg p-4 shadow-md">
                            {selectedUser.mutualFriends.length > 0 ? (
                                selectedUser.mutualFriends.map((friend, index) => (
                                    <li key={index} className="text-gray-700 py-1 border-b last:border-none">• {friend}</li>
                                ))
                            ) : (
                                <p className="text-gray-500">No mutual friends</p>
                            )}
                        </ul>
                    </div>
                </div>
            )} */}

        </div>
    );
};

export default ChatInterface;