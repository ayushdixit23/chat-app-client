import { create } from "zustand";

interface FeaturesState {
    onlineUsers: string[];
    isReplyOpen: boolean,
    replyMessage: any,
    setReplyMessage: (value: any) => void;
    setOnlineUsers: (value: string | string[]) => void;
    setIsReplyOpen: (value: boolean) => void;
}

const useFeatures = create<FeaturesState>()((set) => ({
    onlineUsers: [],
    setOnlineUsers: (value) =>
        set((state) => ({
            onlineUsers: Array.isArray(value)
                ? value
                : [...state.onlineUsers, value],
        })),

    isReplyOpen: false,
    setIsReplyOpen: (value) =>
        set((state) => ({
            isReplyOpen: value
        })),
    replyMessage: null,
    setReplyMessage: (value) =>
        set((state) => ({
            replyMessage: value
        })),
}));

export default useFeatures;
