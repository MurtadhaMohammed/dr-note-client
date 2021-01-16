import create from "zustand";

export const FileStore = create((set) => ({
    name: null,
    color: null,
    setName: (name) => set({ name }),
    setColor: (color) => set({ color })
}));
