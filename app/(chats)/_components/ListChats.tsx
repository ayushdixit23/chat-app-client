"use client"
import { getAllChats } from '@/actions/chats';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import ShimmerListChats from './ShimmerListChats';
import ErrorPage from './ErrorPage';
import ListMiniComponent from './ListMiniComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { API } from '@/app/utils/constants';
import { useSession } from 'next-auth/react';
import InfiniteLoader from './InfiniteLoader';
import { useSocketContext } from '@/components/providers/socket';

const ListChats = () => {
  const {
    data: chatData,
    isError,
    isLoading,
    error,
  } = useQuery({ queryKey: ["allChats"], queryFn: getAllChats });
  const { data } = useSession()
  const { socket } = useSocketContext()
  const queryClient = useQueryClient();
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    socket?.on("online-users", (data) => {
      setOnlineUsers(data);
    });

    socket?.on("user-messages", (data) => {
      queryClient.setQueryData(["allChats"], (oldData: any) => {
        if (!oldData) return oldData;

        const lastMessage = {
          type: data?.type,
          text: data?.text,
          sender: data?.senderId,
          createdAt: data?.createdAt,
        };

        // Check if the conversation exists
        const existingChat = oldData?.users.find(
          (d: any) => d._id === data?.conversationId
        );

        let updatedUsers;

        if (existingChat) {
          // Update last message and move chat to the top
          updatedUsers = oldData?.users.map((d: any) =>
            d._id === data?.conversationId
              ? { ...d, lastMessage: lastMessage }
              : d
          );

          // Filter out the updated chat and move it to the top
          const updatedChat = updatedUsers.find(
            (d: any) => d._id === data?.conversationId
          );
          const filteredUsers = updatedUsers.filter(
            (d: any) => d._id !== data?.conversationId
          );

          updatedUsers = updatedChat ? [updatedChat, ...filteredUsers] : updatedUsers;
        } else {
          const newChat = {
            _id: data?.conversationId,
            chatName: data?.isGroup ? data?.chatData.chatName : data?.senderId.fullName,
            profilePic: data?.isGroup ? data?.chatData.profilePic : data?.senderId.profilePic,
            lastMessage: lastMessage,
            users: data?.users
          };

          updatedUsers = [newChat, ...oldData.users];
        }

        return {
          ...oldData,
          users: updatedUsers,
        };
      });

    });

    return () => {
      socket?.off("online-users");
      socket?.off("user-messages");
    };
  }, [socket, queryClient]);

  const fetchMoreChats = async () => {
    try {
      const res = await axios.get(`${API}/chats/getMoreChats?conversationIds=${JSON.stringify(chatData.conversationIds)}`, {
        headers: {
          Authorization: `Bearer ${data?.user.accessToken}`
        }
      })
      const newUsers = res.data.users

      queryClient.setQueryData(["allChats"], (oldData: any) => ({
        ...oldData,
        users: [...(oldData?.users || []), ...newUsers],
        hasMore: res.data.hasMore,
        conversationIds: res.data.conversationIds
      }));
    } catch (error) {
      console.log(error)
    }
  }

  if (isLoading) {
    return <ShimmerListChats />;
  }

  if (isError) {
    return <ErrorPage message={error.message} />;
  }

  return (
    <div className="overflow-y-auto flex-1" id="listChatDiv">
      <InfiniteScroll
        dataLength={chatData?.users.length || 0}
        next={fetchMoreChats}
        hasMore={chatData?.hasMore}
        loader={<InfiniteLoader />}
        scrollableTarget="listChatDiv"

        style={{ display: "flex", flexDirection: "column" }} // Keeps the scroll behavior correct
      >
        {chatData?.users.map((user: any) => (
          <ListMiniComponent user={user} key={user._id} data={data} onlineUsers={onlineUsers} />
        ))}
      </InfiniteScroll>
    </div>

  )
}

export default ListChats