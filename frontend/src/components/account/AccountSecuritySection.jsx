import React, { useState } from "react";
import { 
  LockIcon, 
  ShieldIcon, 
  QrCodeIcon, 
  MailIcon, 
  EyeIcon, 
  EyeOffIcon,
  SaveIcon,
  LoaderIcon,
  RefreshCwIcon
} from "lucide-react";
import { useAccountStore } from "../store/useAccountStore";

function AccountSecuritySection() {
  const { 
    securityData,
    updateSecurityField,
    updateSecurityToggle,
    saveChanges,
    resetChanges,
    isSaving,
    hasChanges,
    errors,
    setErrors,
    sendVerificationCode,
    isSendingCode
  } = useAccountStore();
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [activeTab, setActiveTab] = useState("password");

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    updateSecurityField(name, value);
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    updateSecurityField(name, value);
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleToggle = (toggleName) => {
    updateSecurityToggle(toggleName, !securityData.toggles[toggleName]);
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!securityData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    
    if (!securityData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (securityData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    
    if (securityData.newPassword !== securityData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (securityData.currentPassword === securityData.newPassword) {
      newErrors.newPassword = "New password must be different from current";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmailForm = () => {
    const newErrors = {};
    
    if (!securityData.currentEmail) {
      newErrors.currentEmail = "Current email is required";
    } else if (!/\S+@\S+\.\S+/.test(securityData.currentEmail)) {
      newErrors.currentEmail = "Invalid email format";
    }
    
    if (!securityData.newEmail) {
      newErrors.newEmail = "New email is required";
    } else if (!/\S+@\S+\.\S+/.test(securityData.newEmail)) {
      newErrors.newEmail = "Invalid email format";
    } else if (securityData.currentEmail === securityData.newEmail) {
      newErrors.newEmail = "New email must be different";
    }
    
    if (!securityData.verificationCode) {
      newErrors.verificationCode = "Verification code is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendVerificationCode = async () => {
    if (!securityData.newEmail || !/\S+@\S+\.\S+/.test(securityData.newEmail)) {
      setErrors({ ...errors, newEmail: "Please enter a valid email" });
      return;
    }

    await sendVerificationCode(securityData.newEmail);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    await saveChanges("password");
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmailForm()) return;
    
    await saveChanges("email");
  };

  const handleTogglesSubmit = async (e) => {
    e.preventDefault();
    
    await saveChanges("security_toggles");
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleCancel = () => {
    resetChanges();
    setActiveTab("password");
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-slate-200 mb-2">Security Settings</h3>
        <p className="text-slate-400">Manage your account security and authentication</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-700/40">
        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "password"
              ? "text-cyan-400 border-b-2 border-cyan-400"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Password
        </button>
        <button
          onClick={() => setActiveTab("email")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "email"
              ? "text-cyan-400 border-b-2 border-cyan-400"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Email
        </button>
        <button
          onClick={() => setActiveTab("authentication")}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === "authentication"
              ? "text-cyan-400 border-b-2 border-cyan-400"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          Authentication
        </button>
      </div>

      {activeTab === "password" && (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/40">
            <h4 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
              <LockIcon className="w-5 h-5 text-cyan-400" />
              Change Password
            </h4>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="auth-input-label mb-2 block">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={securityData.currentPassword || ""}
                    onChange={handlePasswordChange}
                    className="input pr-12"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPasswords.current ? (
                      <EyeOffIcon className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-400 mt-1">{errors.currentPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="newPassword" className="auth-input-label mb-2 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={securityData.newPassword || ""}
                    onChange={handlePasswordChange}
                    className="input pr-12"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPasswords.new ? (
                      <EyeOffIcon className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-400 mt-1">{errors.newPassword}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="auth-input-label mb-2 block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={securityData.confirmPassword || ""}
                    onChange={handlePasswordChange}
                    className="input pr-12"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPasswords.confirm ? (
                      <EyeOffIcon className="size-5" />
                    ) : (
                      <EyeIcon className="size-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700/40 flex justify-between">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving || !hasChanges}
                className="px-6 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !hasChanges}
                className="px-6 py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <>
                    <LoaderIcon className="size-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <LockIcon className="size-5" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {activeTab === "email" && (
        <form onSubmit={handleEmailSubmit} className="space-y-6">
          <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/40">
            <h4 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
              <MailIcon className="w-5 h-5 text-cyan-400" />
              Change Email Address
            </h4>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="currentEmail" className="auth-input-label mb-2 block">
                  Current Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="currentEmail"
                    name="currentEmail"
                    value={securityData.currentEmail || ""}
                    onChange={handleEmailChange}
                    className="input"
                    placeholder="Enter your current email"
                  />
                </div>
                {errors.currentEmail && (
                  <p className="text-sm text-red-400 mt-1">{errors.currentEmail}</p>
                )}
              </div>

              <div>
                <label htmlFor="newEmail" className="auth-input-label mb-2 block">
                  New Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="newEmail"
                    name="newEmail"
                    value={securityData.newEmail || ""}
                    onChange={handleEmailChange}
                    className="input"
                    placeholder="Enter new email address"
                  />
                </div>
                {errors.newEmail && (
                  <p className="text-sm text-red-400 mt-1">{errors.newEmail}</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="verificationCode" className="auth-input-label">
                    Verification Code
                  </label>
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isSendingCode || !securityData.newEmail}
                    className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingCode ? (
                      <>
                        <LoaderIcon className="size-3 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCwIcon className="size-3" />
                        Send Code
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="verificationCode"
                    name="verificationCode"
                    value={securityData.verificationCode || ""}
                    onChange={handleEmailChange}
                    className="input"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                  />
                </div>
                {errors.verificationCode && (
                  <p className="text-sm text-red-400 mt-1">{errors.verificationCode}</p>
                )}
                <p className="text-sm text-slate-400 mt-2">
                  We'll send a verification code to your new email
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700/40 flex justify-between">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving || !hasChanges}
                className="px-6 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !securityData.verificationCode}
                className="px-6 py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <>
                    <LoaderIcon className="size-5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <MailIcon className="size-5" />
                    Update Email
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
      {activeTab === "authentication" && (
        <form onSubmit={handleTogglesSubmit} className="space-y-6">
          <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/40">
            <h4 className="text-lg font-medium text-slate-200 mb-6 flex items-center gap-2">
              <ShieldIcon className="w-5 h-5 text-cyan-400" />
              Authentication Methods
            </h4>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-slate-700/40 text-slate-400">
                    <ShieldIcon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-medium text-slate-200">Two-Factor Authentication</h5>
                    <p className="text-sm text-slate-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("twoFactor")}
                  role="switch"
                  aria-checked={securityData.toggles?.twoFactor}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securityData.toggles?.twoFactor ? "bg-cyan-500" : "bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securityData.toggles?.twoFactor ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/30 border border-slate-700/40">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-slate-700/40 text-slate-400">
                    <QrCodeIcon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-medium text-slate-200">QR Code Login</h5>
                    <p className="text-sm text-slate-400">
                      Allow login via QR code scanning
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggle("qrLogin")}
                  role="switch"
                  aria-checked={securityData.toggles?.qrLogin}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    securityData.toggles?.qrLogin ? "bg-cyan-500" : "bg-slate-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      securityData.toggles?.qrLogin ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700/40 flex justify-between">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving || !hasChanges}
                className="px-6 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !hasChanges}
                className="px-6 py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <>
                    <LoaderIcon className="size-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon className="size-5" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

export default AccountSecuritySection;