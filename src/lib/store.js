import { jwtDecode } from "jwt-decode";
import create from "zustand";

export const useAppStore = create((set) => ({
  isLogin: false,
  user: null,
  querySearch: {},
  racheta: {
    open: false,
    data: null,
  },
  selectedName: null,
  isScroll: false,
  setIsScroll: (isScroll) => set({ isScroll }),
  setRacheta: (racheta) => set({ racheta }),
  setQuerySearch: (querySearch) => set({ querySearch }),
  setSelectedName: (selectedName) => set({ selectedName }),
  setIsLogin: (isLogin) => {
    if (isLogin)
      return set({
        isLogin,
        user: jwtDecode(localStorage.getItem("drNote_token")),
      });
    else return set({ isLogin, user: null });
  },
}));
