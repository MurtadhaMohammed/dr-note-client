import { jwtDecode } from "jwt-decode";
import create from "zustand";

export const useAppStore = create((set) => ({
  isLogin: false,
  user: null,
  querySearch: {},
  selectedName: null,
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
