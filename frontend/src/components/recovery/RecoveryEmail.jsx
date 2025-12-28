import React, { useState } from "react";
import { MailIcon, ShieldIcon, ArrowRightIcon, LoaderIcon, CheckCircleIcon, ArrowLeftIcon } from "lucide-react";
import { useAccountStore } from "../../store/useAccountStore";
import { useNavigate } from "react-router-dom";

function RecoveryEmail() {
    const { recoveryData, recoveryStep, isRecovering, isSendingRecoveryCode, recoveryErrors, 
            updateRecoveryData, sendRecoveryCode, verifyRecoveryCode, 
            sendNewEmailVerification, updateEmailViaRecovery, setRecoveryStep, resetRecovery } = useAccountStore();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        await sendRecoveryCode(recoveryData.email);
    };
    const handleRecoveryCodeSubmit = async (e) => {
        e.preventDefault();
        await verifyRecoveryCode(recoveryData.email, recoveryData.recoveryCode);
    };
    const handleNewEmailSubmit = async (e) => {
        e.preventDefault();
        await sendNewEmailVerification(recoveryData.newEmail);
    };
    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        const success = await updateEmailViaRecovery(
            recoveryData.email,
            recoveryData.newEmail,
            recoveryData.newEmailVerificationCode
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
        if (recoveryStep.email === 2) {
            setRecoveryStep("email", 1);
        } else if (recoveryStep.email === 3) {
            setRecoveryStep("email", 2);
        } else if (recoveryStep.email === 4) {
            setRecoveryStep("email", 3);
        }
    };
    if (success) {
        return (
            <div className="space-y-6">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6">
                    <div className="flex flex-col items-center justify-center text-center">
                        <CheckCircleIcon className="w-16 h-16 text-emerald-500 mb-4" />
                        <h3 className="text-xl font-semibold text-emerald-400 mb-2">
                            Email Recovered Successfully!
                        </h3>
                        <p className="text-slate-300">
                            Your email has been updated. You will be redirected to login page in a few seconds.
                        </p>
                        <p className="text-sm text-slate-400 mt-4">
                            You can now login with your new email address.
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
                    <MailIcon className="w-5 h-5 text-cyan-400" />
                    Recover Email Address
                </h3>
                <p className="text-slate-400">
                    {recoveryStep.email === 1 && "Enter your current email to receive a recovery code"}
                    {recoveryStep.email === 2 && "Enter the recovery code you received"}
                    {recoveryStep.email === 3 && "Enter your new email address"}
                    {recoveryStep.email === 4 && "Enter the verification code sent to your new email"}
                </p>
            </div>

            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center">
                    {[1, 2, 3, 4].map((step) => (
                        <div key={step} className="flex items-center">
                            <div className={`size-8 rounded-full flex items-center justify-center ${
                                recoveryStep.email >= step 
                                    ? "bg-cyan-500 text-white" 
                                    : "bg-slate-700 text-slate-400"
                            }`}>
                                {step}
                            </div>
                            {step < 4 && (
                                <div className={`h-1 w-12 ${
                                    recoveryStep.email > step 
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

            {recoveryStep.email === 1 && (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/40">
                        <div>
                            <label className="auth-input-label mb-2 block">
                                Current Email Address
                            </label>
                            <div className="relative">
                                <MailIcon className="auth-input-icon" />
                                <input
                                    type="email"
                                    value={recoveryData.email}
                                    onChange={(e) => updateRecoveryData("email", e.target.value)}
                                    className="input"
                                    placeholder="Enter your current email"
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
                                        Send Recovery Code
                                        <ArrowRightIcon className="size-5" />
                                    </>
                                )}
                            </button>
                            <p className="text-sm text-slate-400 mt-4 text-center">
                                You'll receive a recovery code that was shown once during registration.
                            </p>
                        </div>
                    </div>
                </form>
            )}

            {recoveryStep.email === 2 && (
                <form onSubmit={handleRecoveryCodeSubmit} className="space-y-4">
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
                                Recovery Code
                            </label>
                            <div className="relative">
                                <ShieldIcon className="auth-input-icon" />
                                <input
                                    type="text"
                                    value={recoveryData.recoveryCode}
                                    onChange={(e) => updateRecoveryData("recoveryCode", e.target.value.toUpperCase())}
                                    className="input font-mono text-center text-lg tracking-widest"
                                    placeholder="Enter 12-character code"
                                    maxLength={12}
                                    required
                                />
                            </div>
                            {recoveryErrors.recoveryCode && (
                                <p className="text-sm text-red-400 mt-1">{recoveryErrors.recoveryCode}</p>
                            )}
                            <p className="text-sm text-slate-400 mt-2">
                                Enter the 12-character recovery code that was displayed during registration.
                            </p>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-slate-700/40">
                            <button
                                type="submit"
                                disabled={isRecovering || !recoveryData.recoveryCode}
                                className="w-full px-6 py-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isRecovering ? (
                                    <>
                                        <LoaderIcon className="size-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        Verify Code
                                        <ArrowRightIcon className="size-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {recoveryStep.email === 3 && (
                <form onSubmit={handleNewEmailSubmit} className="space-y-4">
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
                                New Email Address
                            </label>
                            <div className="relative">
                                <MailIcon className="auth-input-icon" />
                                <input
                                    type="email"
                                    value={recoveryData.newEmail}
                                    onChange={(e) => updateRecoveryData("newEmail", e.target.value)}
                                    className="input"
                                    placeholder="Enter your new email address"
                                    required
                                />
                            </div>
                            {recoveryErrors.newEmail && (
                                <p className="text-sm text-red-400 mt-1">{recoveryErrors.newEmail}</p>
                            )}
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-slate-700/40">
                            <button
                                type="submit"
                                disabled={isSendingRecoveryCode || !recoveryData.newEmail}
                                className="w-full px-6 py-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSendingRecoveryCode ? (
                                    <>
                                        <LoaderIcon className="size-5 animate-spin" />
                                        Sending Verification...
                                    </>
                                ) : (
                                    <>
                                        Send Verification Code
                                        <ArrowRightIcon className="size-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {recoveryStep.email === 4 && (
                <form onSubmit={handleVerificationSubmit} className="space-y-4">
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
                                Verification Code
                            </label>
                            <div className="relative">
                                <ShieldIcon className="auth-input-icon" />
                                <input
                                    type="text"
                                    value={recoveryData.newEmailVerificationCode}
                                    onChange={(e) => updateRecoveryData("newEmailVerificationCode", e.target.value)}
                                    className="input text-center text-lg tracking-widest"
                                    placeholder="Enter 6-digit code"
                                    maxLength={6}
                                    required
                                />
                            </div>
                            {recoveryErrors.verificationCode && (
                                <p className="text-sm text-red-400 mt-1">{recoveryErrors.verificationCode}</p>
                            )}
                            <p className="text-sm text-slate-400 mt-2">
                                Enter the 6-digit verification code sent to {recoveryData.newEmail}
                            </p>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-slate-700/40">
                            <button
                                type="submit"
                                disabled={isRecovering || !recoveryData.newEmailVerificationCode}
                                className="w-full px-6 py-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isRecovering ? (
                                    <>
                                        <LoaderIcon className="size-5 animate-spin" />
                                        Updating Email...
                                    </>
                                ) : (
                                    <>
                                        Update Email
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

export default RecoveryEmail;