import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    socket: null,
    onlineUsers: [],
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser: res.data});
            get().connectSocket();
        } catch (error) {
            console.log("Error in authCheck:", error);
            set({authUser: null});
        } finally {
            set({isCheckingAuth: false});
        }
    },
    signup: async (data) => {
        set({isSigningUp:true});
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({authUser: res.data});
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isSigningUp: false});
        }
    },
    login: async (data) => {
        set({isLoggingIn:true});
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});
            get().connectSocket();
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed");
        } finally {
            set({isLoggingIn: false});
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Error logging out");
            console.log("Logout error:", logout);
        }
    },
    updateProfile: async(data) => {
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in update profile:", error);
            toast.error(error.response.data.message);
        }
    },  
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, { withCredentials: true  });
        socket.connect();
        set({ socket });
        socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
        });
    },
    isconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
    updateEmail: async (newEmail) => {
        try {
            await axiosInstance.put("/auth/update-email", { newEmail });
            toast.success("Email updated");
        } catch (e) {
            toast.error(e.response?.data?.message || "Error updating email");
        }
    },
    updatePassword: async (passwords) => {
        try {
            await axiosInstance.put("/auth/update-password", passwords);
            toast.success("Password updated");
        } catch (e) {
            toast.error(e.response?.data?.message || "Error updating password");
        }
    },
    updateProfileGeneral: async (data) => {
        try {
            const res = await axiosInstance.put("/auth/update-general", data);
            toast.success("Profile updated");
        } catch (e) {
            toast.error("Error updating profile");
        }
    },
    updateAvatar: async (file) => {
        const fd = new FormData();
        fd.append("avatar", file);
        try {
            await axiosInstance.put("/auth/update-avatar", fd);
            toast.success("Avatar updated");
        } catch (e) {
            toast.error("Error updating avatar");
        }
    },
    toggle2FA: async () => {
        try {
            await axiosInstance.post("/auth/toggle-2fa");
            toast.success("2FA updated");
        } catch (e) {
            toast.error("Error toggling 2FA");
        }
    },
    toggleQRLogin: async () => {
        try {
            await axiosInstance.post("/auth/toggle-qr");
            toast.success("QR Login toggled");
        } catch (e) {
            toast.error("Error toggling QR login");
        }
    },
    updatePrivacy: async (settings) => {
        try {
            await axiosInstance.put("/auth/update-privacy", settings);
            toast.success("Privacy updated");
        } catch (e) {
            toast.error("Error updating privacy");
        }
    },
    recoverAccount: async (data) => {
        try {
            await axiosInstance.post("/auth/recover", data);
            toast.success("Recovery email sent!");
        } catch (e) {
            toast.error("Could not send recovery email");
        }
    },
}));