import { User } from "@/types/types";
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  loading: true,
  user: null,
  setUser: (user: User | null) => {
    // Perform authentication logic here
    // For example, make an API call to validate the credentials
    // If the credentials are valid, set isAuthenticated to true and user to the authenticated user's data
    set({ isAuthenticated: user ? true : false, user: user, loading: false });
  },
  logout: () => {
    set({ isAuthenticated: false, user: null, loading: false });
  },
}));

export default useAuthStore;
