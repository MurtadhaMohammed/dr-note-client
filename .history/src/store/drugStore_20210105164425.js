import create from "zustand";

export const DrugStore = create((set) => ({
    name: null,
    color: null,
    setName: (name) => set({ name }),
    setColor: (color) => set({ color })
}));
