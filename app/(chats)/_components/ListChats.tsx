"use client";
import { getAllChats } from "@/actions/chats";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import ShimmerListChats from "./ShimmerListChats";
import ErrorPage from "./ErrorPage";
import ListMiniComponent from "./ListMiniComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import axios from "axios";
import { API } from "@/app/utils/constants";
import { useSession } from "next-auth/react";
import InfiniteLoader from "./InfiniteLoader";
import { useSocketContext } from "@/components/providers/socket";
import useFeatures from "@/app/zustand/stores/feature";
import { escapeRegExp, formatDate, updateChats } from "@/app/utils/helper";
import useSearchStore from "@/app/zustand/stores/search";
import Loader from "./Loader";

const ListChats = ({ searchParamsId }: { searchParamsId: string }) => {
  const {
    data: chatData,
    isError,
    isLoading,
    error,
  } = useQuery({ queryKey: ["allChats"], queryFn: getAllChats });
  const { data: userData } = useSession();
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const { onlineUsers, setOnlineUsers } = useFeatures((state) => state);
  const { searchText } = useSearchStore((state) => state);
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [loading, setLoading] = useState(false)
  const [tempUsers, setTempUsers] = useState([])

  useEffect(() => {
    setLoading(true)
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    if (!searchText.trim()) {
      if (tempUsers.length > 0) {
        setTempUsers([]);

        queryClient.setQueryData(["allChats"], (oldData: any) => ({
          ...oldData,
          users: oldData?.users?.filter((user: any) => !tempUsers.some((tempUser: any) => tempUser._id === user._id)) || [],
        }));
      }
    }
  }, [searchText]);

  useEffect(() => {
    if (debouncedSearch) {
      fetchResults(debouncedSearch);
    }
  }, [debouncedSearch]);

  const fetchResults = async (query: string) => {
    try {
      const res = await axios.get(`${API}/chats/getChatsByQuery?query=${query}`, {
        headers: {
          Authorization: `Bearer ${userData?.user.accessToken}`
        }
      }
      )


      queryClient.setQueryData(["allChats"], (oldData: any) => {
        const existingUsers = new Set(oldData?.users?.map((user: any) => user._id) || []);

        // Filter out users that are already in the list
        const newUsers = res.data.users.filter((user: any) => !existingUsers.has(user._id));
        setTempUsers(newUsers)
        return {
          ...oldData,
          users: [...(oldData?.users || []), ...newUsers],
        };
      });


    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false)
    }
  };


  useEffect(() => {
    socket?.on("online-users", (data) => {
      setOnlineUsers(data);
    });

    socket?.on("user-messages", (data) => {
      console.log(data?.isGroup);
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
  }, [socket, queryClient, searchParamsId]);

  const fetchMoreChats = async () => {
    try {
      const res = await axios.get(
        `${API}/chats/getMoreChats?conversationIds=${JSON.stringify(
          chatData.conversationIds
        )}`,
        {
          headers: {
            Authorization: `Bearer ${userData?.user.accessToken}`,
          },
        }
      );
      const newUsers = res.data.users;

      queryClient.setQueryData(["allChats"], (oldData: any) => ({
        ...oldData,
        users: [...(oldData?.users || []), ...newUsers],
        hasMore: res.data.hasMore,
        conversationIds: res.data.conversationIds,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <ShimmerListChats />;
  }

  if (isError) {
    return <ErrorPage message={error.message} />;
  }
  

  return (
    <div className={`overflow-y-auto flex-1 `} id="listChatDiv">
      {searchText ? (
        <>
          {chatData?.users?.filter((user: any) => {
            // Ensure we escape special characters in the search text for regex
            const escapedSearchText = escapeRegExp(searchText);
            const regex = new RegExp(escapedSearchText, "i");
            return regex.test(user.chatName); // Correct filtering with regex
          }).length > 0 ? (
            chatData?.users?.filter((user: any) => {
              const escapedSearchText = escapeRegExp(searchText);
              const regex = new RegExp(escapedSearchText, "i");
              return regex.test(user.chatName); // Filter with regex
            }).map((user: any) => (
              <ListMiniComponent
                user={user}
                key={user._id}
                data={userData}
                onlineUsers={onlineUsers}
                queryClient={queryClient}
              />
            ))
          ) : (
            <>
              {
                loading ?
                  <div className="flex justify-center items-center h-full">
                    <Loader />
                  </div>
                  :
                  <div className="w-full h-full flex justify-center items-center font-semibold text-xl">
                    No results found
                  </div>
              }

            </>

          )}
        </>
      ) : (
        <InfiniteScroll
          dataLength={chatData?.users?.length || 0}
          next={fetchMoreChats}
          hasMore={chatData?.hasMore}
          loader={<InfiniteLoader />}
          className="h-[100%] w-full"
          scrollableTarget="listChatDiv"
          style={{ display: "flex", flexDirection: "column" }}
        >
          {chatData?.users?.length > 0 ? (
            chatData?.users?.map((user: any) => (
              <ListMiniComponent
                user={user}
                key={user._id}
                data={userData}
                onlineUsers={onlineUsers}
                queryClient={queryClient}
              />
            ))
          ) : (
            <div className="w-full flex justify-center items-center h-[80vh] font-semibold text-xl">
              No Chats found
            </div>
          )}
        </InfiniteScroll>
      )}
    </div>

  );
};

export default ListChats;
