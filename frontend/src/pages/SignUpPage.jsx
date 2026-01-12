import React from 'react';
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { Link } from "react-router-dom";
import { 
  MessageCircleIcon, 
  LockIcon, 
  MailIcon, 
  UserIcon, 
  LoaderIcon, 
  HashIcon,
  CheckIcon,
  AlertCircleIcon
} from "lucide-react";

function SignUpPage() {
  const [formData, setFormData] = useState({ 
    fullName: "", 
    email: "", 
    password: "", 
    nickname: "", 
    tag: "" 
  });
  const [agreements, setAgreements] = useState({
    termsOfUse: false,
    codeOfConduct: false
  });
  const [errors, setErrors] = useState({});
  const { signup, isSigningUp } = useAuthStore();
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!agreements.termsOfUse) {
      newErrors.termsOfUse = "You must accept the Terms of Use";
    }
    if (!agreements.codeOfConduct) {
      newErrors.codeOfConduct = "You must accept the Code of Conduct";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    signup(formData);
  };
  const handleAgreementChange = (name) => {
    setAgreements(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  const isSubmitDisabled = isSigningUp || !agreements.termsOfUse || !agreements.codeOfConduct;

  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">
        <BorderAnimatedContainer>
          <div className="w-full flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-slate-600/30">
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-200 mb-2">Create Account</h2>
                  <p className="text-slate-400">Sign up for a new account</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="auth-input-label">Full Name</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="input"
                        placeholder="Mikhail Kravtsov"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="input"
                        placeholder="sendmeanemail@gmail.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="auth-input-label">Password</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="input"
                        placeholder="T0TALLY_N0T_MY_PA55W0RD"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="auth-input-label">Nickname</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        className="input"
                        value={formData.nickname}
                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                        placeholder="MihanN1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="auth-input-label">Tag</label>
                    <div className="relative">
                      <HashIcon className="auth-input-icon" />
                      <input
                        className="input"
                        value={formData.tag}
                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                        placeholder="mihann1"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-4 border-t border-slate-700/30">
                    <div className="space-y-2">
                      <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        errors.termsOfUse ? "bg-red-500/10 border border-red-500/20" : "bg-slate-800/30"
                      }`}>
                        <div className="flex items-start h-6">
                          <button
                            type="button"
                            onClick={() => handleAgreementChange("termsOfUse")}
                            className={`relative inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                              agreements.termsOfUse 
                                ? "bg-cyan-500 border-cyan-500" 
                                : "bg-slate-700 border-slate-600"
                            }`}
                          >
                            {agreements.termsOfUse && (
                              <CheckIcon className="h-3.5 w-3.5 text-white" />
                            )}
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="text-sm text-slate-300 cursor-pointer">
                            I accept the{" "}
                            <a 
                              href="https://github.com/MihanN1/MernChat?tab=readme-ov-file#2-terms-of-use-tou" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 underline"
                            >
                              Terms of Use
                            </a>
                          </label>
                          {errors.termsOfUse && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertCircleIcon className="h-3.5 w-3.5 text-red-400" />
                              <p className="text-xs text-red-400">{errors.termsOfUse}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        errors.codeOfConduct ? "bg-red-500/10 border border-red-500/20" : "bg-slate-800/30"
                      }`}>
                        <div className="flex items-start h-6">
                          <button
                            type="button"
                            onClick={() => handleAgreementChange("codeOfConduct")}
                            className={`relative inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border transition-colors ${
                              agreements.codeOfConduct 
                                ? "bg-cyan-500 border-cyan-500" 
                                : "bg-slate-700 border-slate-600"
                            }`}
                          >
                            {agreements.codeOfConduct && (
                              <CheckIcon className="h-3.5 w-3.5 text-white" />
                            )}
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <label className="text-sm text-slate-300 cursor-pointer">
                            I accept the{" "}
                            <a 
                              href="https://github.com/MihanN1/MernChat?tab=readme-ov-file#3-code-of-conduct-coc" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 underline"
                            >
                              Code of Conduct
                            </a>
                          </label>
                          {errors.codeOfConduct && (
                            <div className="flex items-center gap-1 mt-1">
                              <AlertCircleIcon className="h-3.5 w-3.5 text-red-400" />
                              <p className="text-xs text-red-400">{errors.codeOfConduct}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1">
                      <p>By creating an account, you agree to:</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>Our Terms of Use regarding service usage and responsibilities</li>
                        <li>Our Code of Conduct for respectful community interaction</li>
                      </ul>
                    </div>
                  </div>
                  <button 
                    className="auth-btn" 
                    type="submit" 
                    disabled={isSubmitDisabled}
                  >
                    {isSigningUp ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <Link to="/login" className="auth-link">
                    Already have an account? Login
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <div>
                <img
                  src="/signup.png"
                  alt="People using mobile devices"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-cyan-400">Start Your Journey Today</h3>
                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Secure</span>
                  </div>
                  <p className="text-sm text-slate-400 mt-4 max-w-sm mx-auto">
                    Join our community committed to respectful and secure communication
                  </p>
                </div>
              </div>
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default SignUpPage;