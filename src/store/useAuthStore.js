// src/store/useAuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const userState = (set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: (user, token) => set({
        user,
        token,
        isAuthenticated: true,
        error: null
    }),

    logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: null
    }),

    setLoading: (isLoading) => set({ isLoading }),

    setError: (error) => set({ error }),

    clearError: () => set({ error: null }),
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
