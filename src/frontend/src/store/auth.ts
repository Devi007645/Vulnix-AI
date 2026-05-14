import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  userEmail: string;
  openAIKey: string;
  login: (email: string) => void;
  logout: () => void;
  setOpenAIKey: (key: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userEmail: "",
      openAIKey: "",
      login: (email: string) => set({ isLoggedIn: true, userEmail: email }),
      logout: () => set({ isLoggedIn: false, userEmail: "", openAIKey: "" }),
      setOpenAIKey: (key: string) => set({ openAIKey: key }),
    }),
    {
      name: "vulnix-auth",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userEmail: state.userEmail,
      }),
    },
  ),
);
