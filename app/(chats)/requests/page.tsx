"use client";
import React from "react";
import { UserPlus, X, Plus, Check } from "lucide-react";
import { fetchSuggestedUser, getFriendRequests } from "@/actions/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/next-auth";
import { errorHandler } from "@/app/utils/helper";
import axios from "axios";
import { API } from "@/app/utils/constants";
import { useSession } from "next-auth/react";
import Loader from "../_components/Loader";

interface RequestProps {
    _id: string
    sentBy: {
        _id: string,
        userName: string
        fullName: string
        profilePic: string
    },
    isSentTo: string,
    status: string,
}

const ChatInterface = () => {
    // const [selectedUser, setSelectedUser] = useState(null);
    const queryClient = useQueryClient();
    const { data: userData } = useSession();
    const {
        data: suggestedUsers,
        error,
        isError,
        isLoading,
    } = useQuery({ queryKey: ["suggestion"], queryFn: fetchSuggestedUser });
    const { data } = useQuery({
        queryKey: ["friendRequest"],
        queryFn: getFriendRequests,
    });

    const createFriendRequest = async (friendId: string) => {
        try {
            const res = await axios.post(
                `${API}/chats/create-friend-request/${friendId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${userData?.user.accessToken}`,
                    },
                }
            );
            console.log(res.data);
        } catch (error) {
            console.log(error);
            errorHandler(error);
        }
    };

    const respondFriendRequest = async ({
        friendRequestId,
        action
    }: { friendRequestId: string, action: string }) => {
        try {
            const res = await axios.post(
                `${API}/chats/responsed-friend-request/${friendRequestId}`,
                { action },
                {
                    headers: {
                        Authorization: `Bearer ${userData?.user.accessToken}`,
                    },
                }
            );
            console.log(res.data)
        } catch (error) {
            errorHandler(error);
            console.log(error);
        }
    };

    const mutation = useMutation({
        mutationFn: createFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["suggestion"] });
        },
    });

    const mutation2 = useMutation({
        mutationFn: respondFriendRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friendRequest"] });
        },
    });

    if (isLoading) {
        return (
           <Loader/>
        );
    }

    if (isError) {
        return (
            <>
                <div>{error.message}</div>
            </>
        );
    }

    console.log(data, "datat");

    return (
        <div className="flex w-full h-screen bg-gray-50 dark:bg-black">
            <div className="w-full bg-gray-50 dark:bg-black overflow-y-auto p-4">

                <div className="bg-white dark:bg-[#0d0d0d] dark:text-white rounded-lg shadow-sm p-4 mb-6">
                    <h2 className="text-lg font-semibold dark:text-white text-gray-900 mb-4 flex items-center">
                        <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
                        Friend Requests ({data?.requests.length})
                    </h2>
                    {data?.requests.length > 0 ? <div className="space-y-4">
                        {data?.requests.map((request: RequestProps) => (
                            <div
                                key={request._id}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-transparent rounded-lg"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={request.sentBy.profilePic}
                                        alt={request.sentBy.fullName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="ml-4">
                                        <h3 className="font-medium dark:text-white text-gray-900">
                                            {request.sentBy.fullName}
                                        </h3>
                                        <p className="text-sm dark:text-white text-gray-500">
                                            {request.sentBy.userName}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => mutation2.mutate({ friendRequestId: request._id, action: "rejected" })}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => mutation2.mutate({ friendRequestId: request._id, action: "accepted" })}
                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    >
                                        <Check className="h-5 w-5" />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                        :
                        <div className="flex text-xl font-semibold justify-center h-[350px] items-center w-full">
                            No Friend Request Currently!
                        </div>
                    }
                </div>


                <div className="bg-white dark:bg-[#0d0d0d] dark:text-white rounded-lg shadow-sm p-4 mb-6">
                    <h2 className="text-lg font-semibold dark:text-white text-gray-900 mb-4 flex items-center">
                        <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
                        Suggestions
                    </h2>
                    {suggestedUsers.users.length > 0 ? <div className="space-y-4">
                        {suggestedUsers.users.map((user: User) => (
                            <div
                                key={user._id}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-transparent rounded-lg"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={user.profilePic}
                                        alt={user.fullName}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="ml-4">
                                        <h3 className="font-medium dark:text-white text-gray-900">
                                            {user.fullName}
                                        </h3>
                                        <p className="text-sm dark:text-white text-gray-500">
                                            {user.userName}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => mutation.mutate(user._id.toString())}
                                    className="w-8 h-8 bg-blue-500 rounded-full text-white justify-center hover:bg-blue-600 flex items-center space-x-2 transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div> :

                        <div className="flex text-xl font-semibold justify-center h-[350px] items-center w-full">
                            No Suggestion Available now!
                        </div>
                    }
                </div>

            </div >

        </div >
    );
};

export default ChatInterface;
