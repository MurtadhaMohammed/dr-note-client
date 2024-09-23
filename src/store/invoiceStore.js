import create from "zustand";

export const useInvoiceStore = create((set) => ({
    _data: [],
    setData: (data) => set({ _data: data }),
}));
