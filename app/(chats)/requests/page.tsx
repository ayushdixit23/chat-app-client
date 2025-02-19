"use client"
import React, { useState } from 'react';
import {
    Search, UserPlus, UserCheck, UserX,
} from 'lucide-react';

const ChatInterface = () => {
    const [selectedUser, setSelectedUser] = useState(null);

    // Sample data for friend requests and friends list
    const [friendRequests, setFriendRequests] = useState([
        {
            id: 1,
            name: 'Emma Wilson',
            email: 'emma.w@example.com',
            mutualFriends: 5,
            image: '/api/placeholder/48/48',
            status: 'pending'
        },
        {
            id: 2,
            name: 'Michael Brown',
            email: 'michael.b@example.com',
            mutualFriends: 3,
            image: '/api/placeholder/48/48',
            status: 'pending'
        }
    ]);

    const handleRequest = (id, action) => {
        if (action === 'accept') {
            const acceptedRequest = friendRequests.find(req => req.id === id);
            setFriendRequests(prev => [...prev, {
                ...acceptedRequest,
                status: 'online',
                lastSeen: 'Active now',
                mutualFriends: []
            }]);
        }
        setFriendRequests(prev => prev.filter(req => req.id !== id));
    };

    return (
        <div className="flex w-full h-screen bg-gray-50">
            <div className="w-1/3 bg-gray-50 overflow-y-auto p-6">
                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search friends..."
                            className="w-full p-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
                        />
                        <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    </div>
                </div>

                {/* Friends List */}


                {friendRequests.length > 0 && (
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
                            Friend Requests ({friendRequests.length})
                        </h2>
                        <div className="space-y-4">
                            {friendRequests.map(request => (
                                <div
                                    onClick={() => setSelectedUser(request)}
                                    key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <img src={request.image} alt={request.name} className="w-12 h-12 rounded-full" />
                                        <div className="ml-4">
                                            <h3 className="font-medium text-gray-900">{request.name}</h3>
                                            <p className="text-sm text-gray-500">{request.mutualFriends} mutual friends</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleRequest(request.id, 'accept')}
                                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                        >
                                            <UserCheck className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleRequest(request.id, 'reject')}
                                            className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
                                        >
                                            <UserX className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* User Info Panel */}
            {selectedUser && (
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
            )}

        </div>
    );
};

export default ChatInterface;