import { create } from "zustand";

// Define the interface for the state
interface FeaturesState {
    onlineUsers: string[];
    setOnlineUsers: (value: string | string[]) => void;
}

const useFeatures = create<FeaturesState>()((set) => ({
    onlineUsers: [],
    setOnlineUsers: (value) =>
        set((state) => ({
            onlineUsers: Array.isArray(value) ? value : [...state.onlineUsers, value],
        })),
}));

export default useFeatures;
