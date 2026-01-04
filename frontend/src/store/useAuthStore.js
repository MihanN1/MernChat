import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
    authUser: {
    _id: "",
    fullName: "",
    email: "",
    nickname: "",
    tag: "",
    profilePic: "",
    twoFactorEnabled: false,
    qrLoginEnabled: false
    },
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isVerifying2FA: false,
    twoFactorData: null,
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
            if (res.data.twoFactorRequired) {
                set({ 
                    twoFactorData: {
                        email: res.data.email
                    }
                });
                return { twoFactorRequired: true };
            } else {
                set({ authUser: res.data });
                get().connectSocket();
                toast.success("Logged in successfully");
                return { twoFactorRequired: false };
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Login failed");
            throw error;
        } finally {
            set({isLoggingIn: false});
        }
    },
    resendTwoFactor: async () => {
        try {
            const res = await axiosInstance.post("/auth/resend-2fa");
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to resend code");
        }
    },
    verifyTwoFactor: async (twoFactorCode) => {
        set({ isVerifying2FA: true });
        try {
            const res = await axiosInstance.post("/auth/verify-2fa", {
                twoFactorCode: twoFactorCode
            });
            set({ 
                authUser: res.data,
                twoFactorData: null
            });
            get().connectSocket();
            toast.success("Logged in successfully");
            return true;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Invalid verification code");
            return false;
        } finally {
            set({ isVerifying2FA: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ 
                authUser: null,
                twoFactorData: null
            });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            toast.error("Error logging out");
            console.log("Logout error:", error);
        }
    },
    updateProfile: async(data) => {
        try {
            const res = await axiosInstance.put("/auth/update-profile", data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in update profile:", error);
            toast.error(error.response.data.message);
        }
    },  
    clearTwoFactorData: () => {
        set({ twoFactorData: null });
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
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },
}));