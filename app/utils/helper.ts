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


export const updateChats = (oldData: any, data: any, key: string, user?: any, isUserinChat?: boolean) => {

  if (!oldData) return oldData;

  console.log(oldData, "oldData", data, "data")

  const lastMessage = {
    type: data?.type,
    text: data?.text,
    sender: data?.senderId,
    createdAt: data?.createdAt,
  };

  const isSeen = data.seenBy.includes(user?.user.id);

  // Find existing chat
  const existingChat = oldData[key]?.find((d: any) => d._id === data?.conversationId);

  let updatedChats;

  if (existingChat) {
    updatedChats = oldData[key].map((d: any) =>
      d._id === data?.conversationId ? { ...d, lastMessage, unreadMessages: isSeen ? 0 : isUserinChat ? 0 : d.unreadMessages + 1 } : d
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

    updatedChats = [newChat, ...oldData[key]];
  }
  return { ...oldData, [key]: updatedChats };
};