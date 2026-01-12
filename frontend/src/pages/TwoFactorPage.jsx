import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import BorderAnimatedContainer from '../components/BorderAnimatedContainer';
import { ShieldIcon, LockIcon, LoaderIcon, ArrowLeftIcon } from 'lucide-react';

function TwoFactorPage() {
    const [code, setCode] = useState('');
    const [isResending, setIsResending] = useState(false);
    const navigate = useNavigate();
    const { verifyTwoFactor, isVerifying2FA, twoFactorData, clearTwoFactorData, resendTwoFactor } = useAuthStore();
    useEffect(() => {
        if (!twoFactorData) {
            navigate('/login');
        }
    }, [twoFactorData, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (code.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }
        verifyTwoFactor(code);
    };
    const handleBackToLogin = () => {
        clearTwoFactorData();
        navigate('/login');
    };
    const handleResendCode = async () => {
        setIsResending(true);
        await resendTwoFactor();
        setIsResending(false);
    };
    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 6) {
            setCode(value);
        }
    };
    return (
        <div className="w-full flex items-center justify-center p-4 bg-slate-900">
            <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
                <BorderAnimatedContainer>
                    <div className="w-full flex flex-col md:flex-row">
                        <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
                            <div className="w-full max-w-md">
                                <div className="text-center mb-8">
                                    <ShieldIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                                    <h2 className="text-2xl font-bold text-slate-200 mb-2">Two-Factor Authentication</h2>
                                    <p className="text-slate-400">Enter the 6-digit code sent to your email</p>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="auth-input-label">Verification Code</label>
                                        <div className="relative">
                                            <LockIcon className="auth-input-icon" />
                                            <input
                                                type="text"
                                                value={code}
                                                onChange={handleCodeChange}
                                                className="input text-center tracking-widest text-lg"
                                                placeholder="123456"
                                                maxLength={6}
                                                autoFocus
                                            />
                                        </div>
                                        <p className="text-sm text-slate-400 mt-2">
                                            Enter the 6-digit code from your email
                                        </p>
                                    </div>
                                    <div className="flex flex-col space-y-4">
                                        <button 
                                            className="auth-btn" 
                                            type="submit" 
                                            disabled={isVerifying2FA || code.length !== 6}
                                        >
                                            {isVerifying2FA ? (
                                                <LoaderIcon className="w-full h-5 animate-spin text-center" />
                                            ) : (
                                                "Verify & Continue"
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleResendCode}
                                            disabled={isResending}
                                            className="py-2 px-4 text-cyan-300 hover:text-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isResending ? 'Sending...' : 'Resend Code'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleBackToLogin}
                                            className="py-2 px-4 text-slate-400 hover:text-slate-300 flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeftIcon className="w-4 h-4" />
                                            Back to Login
                                        </button>
                                    </div>
                                </form>
                                <div className="mt-8 p-4 bg-slate-800/50 rounded-lg">
                                    <p className="text-sm text-slate-400">
                                        <strong>Note:</strong> The code will expire in 10 minutes. 
                                        If you didn't receive the code, check your spam folder or click "Resend Code".
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="md:w-1/2 p-8 flex flex-col justify-center bg-slate-800/30">
                            <div className="max-w-md mx-auto">
                                <h3 className="text-xl font-bold text-slate-200 mb-4">Why Two-Factor Authentication?</h3>
                                <ul className="space-y-3 text-slate-400">
                                    <li className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                                        <span>Adds an extra layer of security to your account</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                                        <span>Protects your account even if your password is compromised</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                                        <span>Required for enhanced security features</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>
                                        <span>You can disable this feature in your account settings</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </BorderAnimatedContainer>
            </div>
        </div>
    );
}

export default TwoFactorPage;