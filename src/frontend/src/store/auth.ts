import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  userEmail: string;
  geminiKey: string;
  login: (email: string) => void;
  logout: () => void;
  setGeminiKey: (key: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userEmail: "",
      geminiKey: "",
      login: (email: string) => set({ isLoggedIn: true, userEmail: email }),
      logout: () => set({ isLoggedIn: false, userEmail: "", geminiKey: "" }),
      setGeminiKey: (key: string) => set({ geminiKey: key }),
    }),
    {
      name: "vulnix-auth",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userEmail: state.userEmail,
        geminiKey: state.geminiKey,
      }),
    },
  ),
);
