"use client";
import React from "react";
import { UserPlus, X, Plus, Check } from "lucide-react";
import { fetchSuggestedUser, getFriendRequests, getSendFriendRequests } from "@/actions/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/types/next-auth";
import { errorHandler } from "@/app/utils/helper";
import axios from "axios";
import { API } from "@/app/utils/constants";
import { useSession } from "next-auth/react";
import Loader from "../_components/Loader";
import { toast } from "react-toastify";

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
    const queryClient = useQueryClient();
    const { data: userData } = useSession();

    // Run all queries in parallel
    const [
        suggestedUsersQuery,
        sentFriendRequestsQuery,
        friendRequestsQuery
    ] = [
            useQuery({
                queryKey: ["suggestion"],
                queryFn: fetchSuggestedUser
            }),
            useQuery({
                queryKey: ["sentfriendRequest"],
                queryFn: getSendFriendRequests,
            }),
            useQuery({
                queryKey: ["friendRequest"],
                queryFn: getFriendRequests,
            })
        ];

    const suggestedUsers = suggestedUsersQuery.data;
    const sentFriendRequests = sentFriendRequestsQuery.data;
    const friendRequests = friendRequestsQuery.data;

    // Create friend request with optimistic updates
    const createFriendRequestMutation = useMutation({
        mutationFn: async (friendId: string) => {
            const res = await axios.post(
                `${API}/chats/create-friend-request/${friendId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${userData?.user.accessToken}`,
                    },
                }
            );
            return { friendId, response: res.data };
        },
        onMutate: async (friendId) => {
            await queryClient.cancelQueries({ queryKey: ["suggestion"] });
            await queryClient.cancelQueries({ queryKey: ["sentfriendRequest"] });

            // Get current data
            const previousSuggestions = queryClient.getQueryData(["suggestion"]);
            const previousSentRequests = queryClient.getQueryData(["sentfriendRequest"]);

            // Optimistically update the suggestions list
            queryClient.setQueryData(["suggestion"], (old: any) => ({
                ...old,
                users: old.users.filter((user: User) => user._id.toString() !== friendId)
            }));

            // Optimistically update sent requests
            queryClient.setQueryData(["sentfriendRequest"], (old: any) => {
                // Find the user from suggestions to add to sent requests
                const user = suggestedUsers?.users.find((u: User) => u._id.toString() === friendId);

                if (!old || !user) return old;

                return {
                    ...old,
                    requests: [
                        ...old.requests,
                        {
                            _id: `temp-${Date.now()}`,
                            isSentTo: user,
                            status: "pending"
                        }
                    ]
                };
            });

            // Return previous values for rollback
            return { previousSuggestions, previousSentRequests };
        },
        onError: (err, friendId, context) => {
            // Rollback on error
            if (context) {
                queryClient.setQueryData(["suggestion"], context.previousSuggestions);
                queryClient.setQueryData(["sentfriendRequest"], context.previousSentRequests);
            }
            errorHandler(err);
        },
        onSuccess: () => {
            toast.success("Friend Request Sent!");
            queryClient.invalidateQueries({ queryKey: ["suggestion"] });
            queryClient.invalidateQueries({ queryKey: ["sentfriendRequest"] });
        }
    });

    // Respond to friend request with optimistic updates
    const respondFriendRequestMutation = useMutation({
        mutationFn: async ({
            friendRequestId,
            action
        }: { friendRequestId: string, action: string }) => {
            const res = await axios.post(
                `${API}/chats/responsed-friend-request/${friendRequestId}`,
                { action },
                {
                    headers: {
                        Authorization: `Bearer ${userData?.user.accessToken}`,
                    },
                }
            );
            return { friendRequestId, action, response: res.data };
        },
        onMutate: async ({ friendRequestId, action }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ["friendRequest"] });
            await queryClient.cancelQueries({ queryKey: ["allChats"] });

            // Snapshot the current value
            const previousFriendRequests = queryClient.getQueryData(["friendRequest"]);

            // Optimistically update friend requests
            queryClient.setQueryData(["friendRequest"], (old: any) => {
                if (!old) return old;

                return {
                    ...old,
                    requests: old.requests.filter((request: RequestProps) => request._id !== friendRequestId)
                };
            });

            // Return previous value for rollback
            return { previousFriendRequests };
        },
        onError: (err, variables, context) => {
            // Rollback
            if (context) {
                queryClient.setQueryData(["friendRequest"], context.previousFriendRequests);
            }
            errorHandler(err);
            toast.error(`Failed to ${variables.action} friend request`);
        },
        onSuccess: (data, variables) => {
            toast.success(`Friend Request ${variables.action}`);
            queryClient.invalidateQueries({ queryKey: ["friendRequest"] });
            queryClient.invalidateQueries({ queryKey: ["allChats"] });
        }
    });

    const cancelFriendRequest = async (requestId: string) => {
        try {
            console.log(requestId)
            const res = await axios.post(`${API}/chats/cancel-request-user-itself/${requestId}`, {}, {
                headers: {
                    Authorization: `Bearer ${userData?.user.accessToken}`
                }
            })
            if (res.data.success) {
                toast.success(res.data.message)
                queryClient.invalidateQueries({ queryKey: ["sentfriendRequest"] });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const isLoading = suggestedUsersQuery.isLoading ||
        sentFriendRequestsQuery.isLoading ||
        friendRequestsQuery.isLoading;

    if (isLoading) {
        return <Loader />;
    }

    if (suggestedUsersQuery.isError) {
        return <div>{suggestedUsersQuery.error.message}</div>;
    }

    return (
        <div className="flex w-full h-screen bg-gray-50 dark:bg-black">
            <div className="w-full bg-gray-50 dark:bg-black overflow-y-auto p-4">

                <div className="bg-white dark:bg-[#0d0d0d] dark:text-white rounded-lg shadow-sm p-4 mb-6">
                    <h2 className="text-lg font-semibold dark:text-white text-gray-900 mb-4 flex items-center">
                        <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
                        Friend Requests ({friendRequests?.requests.length || 0})
                    </h2>
                    {friendRequests?.requests.length > 0 ? (
                        <div className="space-y-4">
                            {friendRequests.requests.map((request: RequestProps) => (
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
                                            onClick={() => respondFriendRequestMutation.mutate({
                                                friendRequestId: request._id,
                                                action: "rejected"
                                            })}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            disabled={respondFriendRequestMutation.isPending}
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => respondFriendRequestMutation.mutate({
                                                friendRequestId: request._id,
                                                action: "accepted"
                                            })}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            disabled={respondFriendRequestMutation.isPending}
                                        >
                                            <Check className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex text-xl font-semibold justify-center h-[350px] items-center w-full">
                            No Friend Request Currently!
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-[#0d0d0d] dark:text-white rounded-lg shadow-sm p-4 mb-6">
                    <h2 className="text-lg font-semibold dark:text-white text-gray-900 mb-4 flex items-center">
                        <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
                        Your Sent Friend Requests
                    </h2>
                    {sentFriendRequests?.requests.length > 0 ? (
                        <div className="space-y-4">
                            {sentFriendRequests.requests.map((request: any) => (
                                <div
                                    key={request._id}
                                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-transparent rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <img
                                            src={request?.isSentTo.profilePic}
                                            alt={request?.isSentTo.fullName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div className="ml-4">
                                            <h3 className="font-medium dark:text-white text-gray-900">
                                                {request?.isSentTo.fullName}
                                            </h3>
                                            <p className="text-sm dark:text-white text-gray-500">
                                                {request?.isSentTo.userName}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex justify-center text-xs  items-center gap-2">
                                        {request?.status === "pending" && <div onClick={() => cancelFriendRequest(request._id)} className="border p-2 px-5 rounded-xl cursor-pointer">Cancel Request</div>}
                                        <div className={`p-2 px-5 text-white rounded-xl ${request?.status === "rejected" ? "bg-red-700" :
                                            request?.status === "accepted" ? "bg-green-500" :
                                                "bg-yellow-500"
                                            }`}>
                                            {request?.status}
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex text-xl font-semibold justify-center h-[350px] items-center w-full">
                            No Sent Friend Requests!
                        </div>
                    )}
                </div>

                <div className="bg-white dark:bg-[#0d0d0d] dark:text-white rounded-lg shadow-sm p-4 mb-6">
                    <h2 className="text-lg font-semibold dark:text-white text-gray-900 mb-4 flex items-center">
                        <UserPlus className="h-5 w-5 mr-2 text-blue-500" />
                        Suggestions
                    </h2>
                    {suggestedUsers?.users.length > 0 ? (
                        <div className="space-y-4">
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
                                        onClick={() => createFriendRequestMutation.mutate(user._id.toString())}
                                        className="w-8 h-8 bg-blue-500 rounded-full text-white justify-center hover:bg-blue-600 flex items-center transition-colors"
                                        disabled={createFriendRequestMutation.isPending}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex text-xl font-semibold justify-center h-[350px] items-center w-full">
                            No Suggestion Available now!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;