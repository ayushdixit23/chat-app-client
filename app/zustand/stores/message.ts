import { create } from "zustand";

export type value = "image" | "video" | "gif" | "document" | "text" | "reply";

interface MessageType {
    messageType: value;
    media: File | null;
    setMessageType: (value: value) => void,
    setMedia: (media: File | null) => void
}

const useMessageStore = create<MessageType>()((set) => ({
    messageType: "text",
    media: null,
    setMessageType: (value: value) => set(() => ({ messageType: value })),
    setMedia: (file) => set({ media: file }),
}));

export default useMessageStore;
