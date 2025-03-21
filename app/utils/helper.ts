import axios from "axios";
import { toast } from "react-toastify";

export const errorHandler = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      toast.error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      toast.error("Network error. Please try again later.");
    } else {
      toast.error("An error occurred. Please try again.");
    }
  } else {
    toast.error("Unexpected error occurred.");
  }
};

export const generateRandomChatId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomId = "";
  for (let i = 0; i < 16; i++) {
    randomId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return randomId;
};


export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};

export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export const extractHourMinutes = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isYesterday =
    date.getDate() === now.getDate() - 1 &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  if (isToday) {
    return `${hours}:${minutes}`;
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-GB"); // Formats as DD/MM/YYYY
  }
};

export const updateChats = (
  oldData: any,
  data: any,
  key: string,
  user?: any,
  isUserinChat?: boolean
) => {
  if (!oldData) return oldData;

  const lastMessage = {
    type: data?.type,
    text: data?.text,
    sender: data?.senderId,
    createdAt: data?.createdAt,
  };

  const isSeen = data.seenBy.includes(user?.user.id);

  // Ensure oldData[key] is an array
  const chats = Array.isArray(oldData[key]) ? oldData[key] : [];

  // Find existing chat
  const existingChat = chats.find((d: any) => d._id === data?.conversationId);

  let updatedChats;

  if (existingChat) {
    updatedChats = chats.map((d: any) =>
      d._id === data?.conversationId
        ? {
            ...d,
            lastMessage,
            unreadMessages: isSeen ? 0 : isUserinChat ? 0 : d.unreadMessages + 1,
          }
        : d
    );

    // Move updated chat to the top
    const updatedChat = updatedChats.find((d: any) => d._id === data?.conversationId);
    updatedChats = updatedChat
      ? [updatedChat, ...updatedChats.filter((d: any) => d._id !== data?.conversationId)]
      : updatedChats;
  } else {
    const newChat = {
      _id: data?.conversationId,
      chatName: data?.isGroup ? data?.chatData.chatName : data?.senderId.fullName,
      profilePic: data?.isGroup ? data?.chatData.profilePic : data?.senderId.profilePic,
      lastMessage,
      unreadMessages: 1,
      users: data?.users,
    };

    updatedChats = [newChat, ...chats];
  }

  return { ...oldData, [key]: updatedChats };
};


export const clearUnReadMessages = async (
  queryClient: any,
  id: string,
  isGroup: boolean = false 
) => {
  queryClient.setQueryData(["allChats"], (oldData: any) => {
    const dataChange = oldData?.users?.map((d: any) => {
      if (d._id === id) {
        return {
          ...d,
          unreadMessages: 0
        }
      } else {
        return { ...d }
      }
    })
    return {
      ...oldData,
      users: dataChange
    }
  });
  if (isGroup) {
    queryClient.setQueryData(["getGroups"], (oldData: any) => {
      const dataChange = oldData?.groups?.map((d: any) => {
        if (d._id === id) {
          return {
            ...d,
            unreadMessages: 0
          }
        } else {
          return { ...d }
        }
      })
      return {
        ...oldData,
        groups: dataChange
      }
    });
  }



}

export const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, '\\$&'); // Escape special characters
};

export const formatDateTime = (dateString: string | Date) => {
  const date = new Date(dateString);

  const formattedDate = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
  }).format(date);

  return `${formattedDate} at ${formattedTime}`;
};
