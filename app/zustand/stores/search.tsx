import { create } from "zustand";

interface SearchType {
    searchText: string;
    setSearchText: (value: string) => void;
}

const useSearchStore = create<SearchType>((set) => ({
    searchText: "",
    setSearchText: (value) => set({ searchText: value })
}));

export default useSearchStore;
