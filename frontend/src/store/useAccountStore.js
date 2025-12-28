import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useAccountStore = create((set, get) => ({
    userData: null,
    originalData: null,
    securityData: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        currentEmail: "",
        newEmail: "",
        verificationCode: "",
        toggles: {
            twoFactor: false,
            qrLogin: false,
        }
    },
    hasChanges: false,
    isSaving: false,
    isSendingCode: false,
    errors: {},
    activeSetting: null,

    setActiveSetting: (setting) => set({ activeSetting: setting }),
    
    setUserData: (data) => {
        set({ 
            userData: data,
            originalData: JSON.parse(JSON.stringify(data)),
            securityData: {
                ...get().securityData,
                toggles: {
                    twoFactor: data.twoFactorEnabled || false,
                    qrLogin: data.qrLoginEnabled || false
                }
            }
        });
    },
    
    updateField: (field, value) => {
        set(state => ({
            userData: { ...state.userData, [field]: value },
            hasChanges: true
        }));
    },
    
    updateProfilePicture: (base64String) => {
        set(state => ({
            userData: { ...state.userData, profilePic: base64String },
            hasChanges: true
        }));
    },
    
    updateSecurityField: (field, value) => {
        set(state => ({
            securityData: { 
                ...state.securityData, 
                [field]: value 
            },
            hasChanges: true
        }));
    },
    
    updateSecurityToggle: (toggleName, value) => {
        set(state => ({
            securityData: {
                ...state.securityData,
                toggles: {
                    ...state.securityData.toggles,
                    [toggleName]: value
                }
            },
            hasChanges: true
        }));
    },
    
    setErrors: (errors) => set({ errors }),
    
    sendVerificationCode: async (email) => {
        set({ isSendingCode: true });
        try {
            const res = await axiosInstance.post("/auth/send-verification-code", { email });
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send code");
        } finally {
            set({ isSendingCode: false });
        }
    },
    
    saveChanges: async (type) => {
        set({ isSaving: true, errors: {} });
        
        try {
            let dataToSend = {};
            const { userData, securityData } = get();
            
            switch (type) {
                case "general":
                    dataToSend = {
                        nickname: userData.nickname,
                        tag: userData.tag,
                        profilePic: userData.profilePic
                    };
                    break;
                    
                case "password":
                    dataToSend = {
                        currentPassword: securityData.currentPassword,
                        newPassword: securityData.newPassword
                    };
                    break;
                    
                case "email":
                    dataToSend = {
                        newEmail: securityData.newEmail,
                        verificationCode: securityData.verificationCode
                    };
                    break;
                    
                case "security_toggles":
                    dataToSend = {
                        securitySettings: securityData.toggles
                    };
                    break;
            }
            
            const res = await axiosInstance.put("/auth/update-profile", dataToSend);

            const authStore = useAuthStore.getState();
            if (type === "general" || type === "email" || type === "security_toggles") {
                authStore.authUser = res.data;
            }

            if (type === "password") {
                set(state => ({
                    hasChanges: false,
                    securityData: {
                        ...state.securityData,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: ""
                    }
                }));
            } else if (type === "email") {
                set(state => ({
                    hasChanges: false,
                    securityData: {
                        ...state.securityData,
                        currentEmail: "",
                        newEmail: "",
                        verificationCode: ""
                    }
                }));
            } else {
                set({ hasChanges: false });
            }
            
            toast.success("Settings updated successfully!");
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update settings";
            set({ errors: { general: errorMessage } });
            toast.error(errorMessage);
        } finally {
            set({ isSaving: false });
        }
    },
    
    resetChanges: () => {
        const { originalData } = get();
        set({
            userData: JSON.parse(JSON.stringify(originalData)),
            securityData: {
                ...get().securityData,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
                currentEmail: "",
                newEmail: "",
                verificationCode: ""
            },
            hasChanges: false,
            errors: {}
        });
    },
    activeRecovery: null,
    recoveryData: {
        email: "",
        recoveryCode: "",
        newEmail: "",
        newEmailVerificationCode: "",
        newPassword: "",
        confirmNewPassword: "",
        resetCode: "",
    },
    isRecovering: false,
    isSendingRecoveryCode: false,
    recoveryStep: {
        email: 1,
        password: 1,
    },
    recoveryErrors: {},
    setActiveRecovery: (recovery) => set({ activeRecovery: recovery }),
    updateRecoveryData: (field, value) => {
        set(state => ({
            recoveryData: {
                ...state.recoveryData,
                [field]: value
            }
        }));
    },
    setRecoveryStep: (type, step) => {
        set(state => ({
            recoveryStep: {
                ...state.recoveryStep,
                [type]: step
            }
        }));
    },
    setRecoveryErrors: (errors) => set({ recoveryErrors: errors }),
    sendRecoveryCode: async (email) => {
        set({ isSendingRecoveryCode: true, recoveryErrors: {} });
        try {
            const res = await axiosInstance.post("/auth/send-recovery-code", { email });
            toast.success("Recovery code sent.");
            set(state => ({
                recoveryStep: { ...state.recoveryStep, email: 2}
            }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to send recovery code.";
            set({ recoveryErrors: { general: errorMessage } });
            toast.error(errorMessage);
        } finally {
            set({ isSendingRecoveryCode: false });
        }
    },
    verifyRecoveryCode: async (email, recoveryCode) => {
        set({ isRecovering: true, recoveryErrors: {} });
        try {
            await axiosInstance.post("/auth/verify-recovery-code", { email, recoveryCode });
            toast.success("Recovery code verified.");
            set(state => ({
                recoveryStep: { ...state.recoveryStep, email: 3 }
            }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Invalid recovery code.";
        } finally {
            set({ isRecovering: false });
        }
    },
    sendEmailVerification: async (newEmail) => {
        set({ isSendingRecoveryCode: true, recoveryErrors: {} });
        try {
            await axiosInstance.post("/auth/send-verification-code", { email: newEmail, isRecovering: true });
            toast.success("Verification code sent to new email.");
            set(state => ({ 
                recoveryStep: { ...state.recoveryStep, email: 4 }
            }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to send verification code.";
            set({ recoveryErrors: { newEmail: errorMessage } });
            toast.error(errorMessage);
        } finally {
            set({ isSendingRecoveryCode: false });
        }
    },
    updateEmailViaRecovery: async (email, newEmail, verificationCode) => {
        set({ isRecovering: true, recoveryErrors: {} });
        try {
            await axiosInstance.post("/auth/recover-email", { 
                email, 
                newEmail, 
                verificationCode 
            });
            toast.success("Email updated successfully.");
            return true; // Success
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update email.";
            set({ recoveryErrors: { general: errorMessage } });
            toast.error(errorMessage);
            return false;
        } finally {
            set({ isRecovering: false });
        }
    },
    sendPasswordResetCode: async (email) => {
        set({ isSendingRecoveryCode: true, recoveryErrors: {} });
        try {
            await axiosInstance.post("/auth/send-password-reset-code", { email });
            toast.success("Password reset code sent to your email!");
            set(state => ({ 
                recoveryStep: { ...state.recoveryStep, password: 2 }
            }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to send reset code.";
            set({ recoveryErrors: { email: errorMessage } });
            toast.error(errorMessage);
        } finally {
            set({ isSendingRecoveryCode: false });
        }
    },
    resetPassword: async (email, resetCode, newPassword) => {
        set({ isRecovering: true, recoveryErrors: {} });
        try {
            await axiosInstance.post("/auth/reset-password", { 
                email, 
                resetCode, 
                newPassword 
            });
            toast.success("Password reset successfully!");
            return true;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to reset password";
            set({ recoveryErrors: { general: errorMessage } });
            toast.error(errorMessage);
            return false;
        } finally {
            set({ isRecovering: false });
        }
    },
    resetRecovery: () => {
        set({
            recoveryData: {
                email: "",
                recoveryCode: "",
                newEmail: "",
                newEmailVerificationCode: "",
                newPassword: "",
                confirmNewPassword: "",
                resetCode: "",
            },
            recoveryStep: {
                email: 1,
                password: 1
            },
            isRecovering: false,
            isSendingRecoveryCode: false,
            recoveryErrors: {}
        });
    },
}));