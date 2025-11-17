// src/store/useAuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const userState = (set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
    }),

    logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
    })
});

export const useAuthStore = create(
    persist(userState, {
        name: "auth-storage",
        partialize: (state) => ({
            user: state.user,
            token: state.token,
            isAuthenticated: state.isAuthenticated,
        }),
    })
);
