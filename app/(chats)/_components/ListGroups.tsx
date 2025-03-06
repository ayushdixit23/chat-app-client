"use client"
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import ShimmerListChats from './ShimmerListChats';
import ErrorPage from './ErrorPage';
import { getAllGroups } from '@/actions/chats';
import ListAllGroups from './ListAllGroups';
import { useSession } from 'next-auth/react';

const ListGroups = () => {
  const {
    data: chatData,
    isError,
    isLoading,
    error,
  } = useQuery({ queryKey: ["getGroups"], queryFn: getAllGroups });
  const {data} = useSession()

  if (isLoading) {
    return <ShimmerListChats />;
  }

  if (isError) {
    return <ErrorPage message={error.message} />;
  }

  return (
    <div className="overflow-y-auto flex-1" id="listChatDiv">
        {chatData?.groups.map((group: any,index:number) => (
          <ListAllGroups key={index} group={group} data={data}/>
        ))}
    </div>

  )
}

export default ListGroups