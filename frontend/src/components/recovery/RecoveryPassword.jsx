import React, { useState } from "react";
import { LockIcon, ShieldIcon, ArrowRightIcon, LoaderIcon, CheckCircleIcon, ArrowLeftIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useAccountStore } from "../../store/useAccountStore";
import { useNavigate } from "react-router-dom";

function RecoveryPassword() {
    const { recoveryData, recoveryStep, isRecovering, isSendingRecoveryCode, recoveryErrors, 
            updateRecoveryData, sendPasswordResetCode, resetPassword, setRecoveryStep, resetRecovery } = useAccountStore();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        await sendPasswordResetCode(recoveryData.email);
    };
    const handleResetCodeSubmit = async (e) => {
        e.preventDefault();
        // Move to password step
        setRecoveryStep("password", 3);
    };
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        
        if (recoveryData.newPassword !== recoveryData.confirmNewPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        const success = await resetPassword(
            recoveryData.email,
            recoveryData.resetCode,
            recoveryData.newPassword
        );
        
        if (success) {
            setSuccess(true);
            setTimeout(() => {
                resetRecovery();
                navigate("/login");
            }, 3000);
        }
    };
    const handleBack = () => {
        if (recoveryStep.password === 2) {
            setRecoveryStep("password", 1);
        } else if (recoveryStep.password === 3) {
            setRecoveryStep("password", 2);
        }
    };
    if (success) {
        return (
            <div className="space-y-6">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                    <div className="flex flex-col items-center justify-center text-center">
                        <CheckCircleIcon className="w-16 h-16 text-emerald-500 mb-4" />
                        <h3 className="text-xl font-semibold text-emerald-400 mb-2">
                            Password Reset Successful!
                        </h3>
                        <p className="text-slate-300">
                            Your password has been reset. You will be redirected to login page in a few seconds.
                        </p>
                        <p className="text-sm text-slate-400 mt-4">
                            You can now login with your new password.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-200 mb-2 flex items-center gap-2">
                    <LockIcon className="w-5 h-5 text-cyan-400" />
                    Recover Password
                </h3>
                <p className="text-slate-400">
                    {recoveryStep.password === 1 && "Enter your email to receive a reset code"}
                    {recoveryStep.password === 2 && "Enter the reset code sent to your email"}
                    {recoveryStep.password === 3 && "Enter your new password"}
                </p>
            </div>

            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                            <div className={`size-8 rounded-full flex items-center justify-center ${
                                recoveryStep.password >= step 
                                    ? "bg-cyan-500 text-white" 
                                    : "bg-slate-700 text-slate-400"
                            }`}>
                                {step}
                            </div>
                            {step < 3 && (
                                <div className={`h-1 w-12 ${
                                    recoveryStep.password > step 
                                        ? "bg-cyan-500" 
                                        : "bg-slate-700"
                                }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {recoveryErrors.general && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400">{recoveryErrors.general}</p>
                </div>
            )}

            {recoveryStep.password === 1 && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/40">
                        <div>
                            <label className="auth-input-label mb-2 block">
                                Email Address
                            </label>
                            <div className="relative">
                                <MailIcon className="auth-input-icon" />
                                <input
                                    type="email"
                                    value={recoveryData.email}
                                    onChange={(e) => updateRecoveryData("email", e.target.value)}
                                    className="input"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                            {recoveryErrors.email && (
                                <p className="text-sm text-red-400 mt-1">{recoveryErrors.email}</p>
                            )}
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-slate-700/40">
                            <button
                                type="submit"
                                disabled={isSendingRecoveryCode || !recoveryData.email}
                                className="w-full px-6 py-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSendingRecoveryCode ? (
                                    <>
                                        <LoaderIcon className="size-5 animate-spin" />
                                        Sending Code...
                                    </>
                                ) : (
                                    <>
                                        Send Reset Code
                                        <ArrowRightIcon className="size-5" />
                                    </>
                                )}
                            </button>
                            <p className="text-sm text-slate-400 mt-4 text-center">
                                You'll receive a 6-digit reset code via email.
                            </p>
                        </div>
                    </div>
                </form>
            )}

            {recoveryStep.password === 2 && (
                <form onSubmit={handleResetCodeSubmit} className="space-y-4">
                    <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/40">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="mb-4 text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
                        >
                            <ArrowLeftIcon className="size-4" />
                            Back
                        </button>
                        
                        <div>
                            <label className="auth-input-label mb-2 block">
                                Reset Code
                            </label>
                            <div className="relative">
                                <ShieldIcon className="auth-input-icon" />
                                <input
                                    type="text"
                                    value={recoveryData.resetCode}
                                    onChange={(e) => updateRecoveryData("resetCode", e.target.value)}
                                    className="input text-center text-lg tracking-widest"
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    required
                                />
                            </div>
                            {recoveryErrors.resetCode && (
                                <p className="text-sm text-red-400 mt-1">{recoveryErrors.resetCode}</p>
                            )}
                            <p className="text-sm text-slate-400 mt-2">
                                Enter the 6-digit reset code sent to {recoveryData.email}
                            </p>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-slate-700/40">
                            <button
                                type="submit"
                                disabled={!recoveryData.resetCode}
                                className="w-full px-6 py-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Verify Code
                                <ArrowRightIcon className="size-5" />
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {recoveryStep.password === 3 && (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/40">
                        <button
                            type="button"
                            onClick={handleBack}
                            className="mb-4 text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
                        >
                            <ArrowLeftIcon className="size-4" />
                            Back
                        </button>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="auth-input-label mb-2 block">
                                    New Password
                                </label>
                                <div className="relative">
                                    <LockIcon className="auth-input-icon" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={recoveryData.newPassword}
                                        onChange={(e) => updateRecoveryData("newPassword", e.target.value)}
                                        className="input pr-12"
                                        placeholder="Enter new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                    >
                                        {showPassword ? (
                                            <EyeOffIcon className="size-5" />
                                        ) : (
                                            <EyeIcon className="size-5" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-sm text-slate-400 mt-2">
                                    Must be at least 8 characters long
                                </p>
                            </div>

                            <div>
                                <label className="auth-input-label mb-2 block">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <LockIcon className="auth-input-icon" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={recoveryData.confirmNewPassword}
                                        onChange={(e) => updateRecoveryData("confirmNewPassword", e.target.value)}
                                        className="input pr-12"
                                        placeholder="Confirm new password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOffIcon className="size-5" />
                                        ) : (
                                            <EyeIcon className="size-5" />
                                        )}
                                    </button>
                                </div>
                                {recoveryData.newPassword !== recoveryData.confirmNewPassword && (
                                    <p className="text-sm text-red-400 mt-1">Passwords do not match</p>
                                )}
                            </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-slate-700/40">
                            <button
                                type="submit"
                                disabled={isRecovering || !recoveryData.newPassword || !recoveryData.confirmNewPassword}
                                className="w-full px-6 py-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isRecovering ? (
                                    <>
                                        <LoaderIcon className="size-5 animate-spin" />
                                        Resetting Password...
                                    </>
                                ) : (
                                    <>
                                        Reset Password
                                        <ArrowRightIcon className="size-5" />
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

export default RecoveryPassword;