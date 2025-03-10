"use client"
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect } from 'react'
import ShimmerListChats from './ShimmerListChats';
import ErrorPage from './ErrorPage';
import { getAllGroups } from '@/actions/chats';
import ListAllGroups from './ListIndividualGroups';
import { useSession } from 'next-auth/react';
import { useSocketContext } from '@/components/providers/socket';
import useFeatures from '@/app/zustand/stores/feature';
import { updateChats } from '@/app/utils/helper';

const ListGroups = () => {
  const {
    data: chatData,
    isError,
    isLoading,
    error,
  } = useQuery({ queryKey: ["getGroups"], queryFn: getAllGroups });
  const { data } = useSession()
  const { socket } = useSocketContext()
  const queryClient = useQueryClient();
  const { setOnlineUsers } = useFeatures((state) => state)

  useEffect(() => {
    socket?.on("online-users", (data) => {
      setOnlineUsers(data);
    });

    socket?.on("user-messages", (data) => {
      if (data?.isGroup) {
        queryClient.setQueryData(["getGroups"], (oldData: any) =>
          updateChats(oldData, data, "groups")
        );
      }
    
      // Update individual chats (DMs)
      queryClient.setQueryData(["allChats"], (oldData: any) =>
        updateChats(oldData, data, "users")
      );
    });
    

    return () => {
      socket?.off("online-users");
      socket?.off("user-messages");
    };
  }, [socket, queryClient]);

  if (isLoading) {
    return <ShimmerListChats />;
  }

  if (isError) {
    return <ErrorPage message={error.message} />;
  }

  return (
    <div className="overflow-y-auto flex-1" id="listChatDiv">
      {chatData?.groups.map((group: any, index: number) => (
        <ListAllGroups key={index} group={group} data={data} />
      ))}
    </div>

  )
}

export default ListGroups