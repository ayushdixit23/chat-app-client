import axios from "axios";
import { toast } from "react-toastify";
import crypto from "crypto"

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