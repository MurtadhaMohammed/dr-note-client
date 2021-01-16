import create from "zustand";

export const FileStore = create((set) => ({
    name: null,
    setName: (name) => set({ name }),
}));
