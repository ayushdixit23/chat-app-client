"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import ShimmerListChats from "./ShimmerListChats";
import ErrorPage from "./ErrorPage";
import { getAllGroups } from "@/actions/chats";
import ListAllGroups from "./ListIndividualGroups";
import { useSession } from "next-auth/react";
import { useSocketContext } from "@/components/providers/socket";
import useFeatures from "@/app/zustand/stores/feature";
import { escapeRegExp, formatDate, updateChats } from "@/app/utils/helper";
import { useSearchParams } from "next/navigation";
import useSearchStore from "@/app/zustand/stores/search";

const ListGroups = () => {
  const {
    data: chatData,
    isError,
    isLoading,
    error,
  } = useQuery({ queryKey: ["getGroups"], queryFn: getAllGroups });
  const { data: userData } = useSession();
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const searchParamsId = searchParams.get("id");
  const { setOnlineUsers } = useFeatures((state) => state);
  const { searchText } = useSearchStore((state) => state);

  useEffect(() => {
    socket?.on("online-users", (data) => {
      setOnlineUsers(data);
    });

    socket?.on("user-messages", (data) => {
      if (data?.isGroup) {
        queryClient.setQueryData(["getGroups"], (oldData: any) =>
          updateChats(
            oldData,
            data,
            "groups",
            userData,
            data.conversationId === searchParamsId
          )
        );
      }

      // Update individual chats (DMs)
      queryClient.setQueryData(["allChats"], (oldData: any) =>
        updateChats(
          oldData,
          data,
          "users",
          userData,
          data.conversationId === searchParamsId
        )
      );

      if (searchParamsId !== data?.conversationId) {
        queryClient.setQueryData(
          ["getChat", data?.conversationId],
          (oldData: any) => {
            if (!oldData) return oldData;
            const formattedDate = formatDate(data.createdAt);
            return {
              ...oldData,
              conversation: {
                ...oldData.conversation,
                messages: {
                  ...oldData.conversation.messages,
                  [formattedDate]: [
                    ...(oldData?.conversation?.messages?.[formattedDate] || []),
                    data,
                  ],
                },
              },
            };
          }
        );
      }
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
      {searchText ? (
        <>
          {chatData?.groups?.filter((group: any) => {
            const escapedSearchText = escapeRegExp(searchText);
            const regex = new RegExp(escapedSearchText, "i");
            return regex.test(group.groupName); // Filter groups by name
          }).length > 0 ? (
            chatData?.groups?.filter((group: any) => {
              const escapedSearchText = escapeRegExp(searchText);
              const regex = new RegExp(escapedSearchText, "i");
              return regex.test(group.groupName); // Filter with regex
            }).map((group: any, index: number) => (
              <ListAllGroups
                queryClient={queryClient}
                key={index}
                group={group}
                data={userData}
              />
            ))
          ) : (
            <div className="w-full h-full flex justify-center items-center font-semibold text-xl">
              No results found
            </div>
          )}
        </>
      ) : (
        <>
          {chatData?.groups?.length > 0 ? (
            chatData?.groups?.map((group: any, index: number) => (
              <ListAllGroups
                queryClient={queryClient}
                key={index}
                group={group}
                data={userData}
              />
            ))
          ) : (
            <div className="w-full h-full flex justify-center items-center font-semibold text-xl">
              No Groups found
            </div>
          )}
        </>
      )}
    </div>


  );
};

export default ListGroups;
