import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { LockIcon, MailIcon, UserIcon, HashIcon } from "lucide-react";

function AccountRecoveryPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("email");
  const [emailRecovery, setEmailRecovery] = useState({
    fullName: "",
    nickname: "",
    tag: "",
    password: "",
  });
  const [passwordRecovery, setPasswordRecovery] = useState({
    email: "",
  });
  const handleEmailRecovery = (e) => {
    e.preventDefault();
    const { password, fullName, nickname, tag } = emailRecovery;
    if (!password || (!fullName && !nickname && !tag)) {
      alert("Please enter your password and at least one of Full Name, Nickname, or Tag.");
      return;
    }
    navigate("/email-change", {
      state: {
        fromRecovery: true,
        fullName,
        nickname,
        tag,
      },
    });
  };
  const handlePasswordRecovery = (e) => {
    e.preventDefault();
    // TODO: call backend to trigger password reset email using passwordRecovery.email
  };
  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-6xl h-[700px]">
        <BorderAnimatedContainer>
          <div className="w-full h-full flex">
            <div className="w-full md:w-1/2 p-10 bg-slate-800/40 border-r border-slate-700/40 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-200 text-center">
                  Account Recovery
                </h2>
                <p className="text-slate-400 text-center">
                  Enter what you remember — no need to fill everything.
                </p>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setMode("email")}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    mode === "email"
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  Recover Email
                </button>
                <button
                  onClick={() => setMode("password")}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    mode === "password"
                      ? "bg-cyan-600 text-white"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  Recover Password
                </button>
              </div>
              {mode === "email" && (
                <form onSubmit={handleEmailRecovery} className="space-y-6">
                  <div>
                    <label className="auth-input-label">Full Name (optional)</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        className="input"
                        placeholder="John Doe"
                        value={emailRecovery.fullName}
                        onChange={(e) =>
                          setEmailRecovery({ ...emailRecovery, fullName: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="auth-input-label">Nickname (optional)</label>
                    <div className="relative">
                      <UserIcon className="auth-input-icon" />
                      <input
                        className="input"
                        placeholder="CoolDude"
                        value={emailRecovery.nickname}
                        onChange={(e) =>
                          setEmailRecovery({ ...emailRecovery, nickname: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="auth-input-label">Tag (optional)</label>
                    <div className="relative">
                      <HashIcon className="auth-input-icon" />
                      <input
                        className="input"
                        placeholder="cooltag"
                        value={emailRecovery.tag}
                        onChange={(e) =>
                          setEmailRecovery({ ...emailRecovery, tag: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="auth-input-label">Password (required)</label>
                    <div className="relative">
                      <LockIcon className="auth-input-icon" />
                      <input
                        type="password"
                        className="input"
                        placeholder="Your password"
                        value={emailRecovery.password}
                        onChange={(e) =>
                          setEmailRecovery({ ...emailRecovery, password: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button type="submit" className="auth-btn w-full">
                      Recover Email
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="auth-btn w-full bg-slate-700 text-slate-200"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}
              {mode === "password" && (
                <form onSubmit={handlePasswordRecovery} className="space-y-6">
                  <div>
                    <label className="auth-input-label">Email</label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        className="input"
                        placeholder="your@email.com"
                        value={passwordRecovery.email}
                        onChange={(e) =>
                          setPasswordRecovery({ ...passwordRecovery, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button className="auth-btn w-full">Send Password Reset</button>
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="auth-btn w-full bg-slate-700 text-slate-200"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}
            </div>
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-slate-800/20 to-transparent">
              <img src="/recover.png" alt="Recovery" className="w-full h-auto" />
            </div>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default AccountRecoveryPage;