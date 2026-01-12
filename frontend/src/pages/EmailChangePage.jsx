import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MailIcon, LockIcon, UserIcon, HashIcon } from "lucide-react";

function EmailChangePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialState = {
    newEmail: "",
    password: "",
    fullName: "",
    nickname: "",
    tag: "",
  };
  const passed = location.state || {};
  const [form, setForm] = useState({
    ...initialState,
    fullName: passed.fullName || "",
    nickname: passed.nickname || "",
    tag: passed.tag || "",
  });
  const submit = (e) => {
    e.preventDefault();
    console.log("CHANGE EMAIL DATA →", form);
  };
  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900">
      <div className="relative w-full max-w-4xl h-[680px]">
        <BorderAnimatedContainer>
          <div className="w-full h-full p-10 bg-slate-800/40 space-y-6">
            <h2 className="text-2xl text-center text-slate-200 font-bold">
              Change Email
            </h2>
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="auth-input-label">New Email</label>
                <div className="relative">
                  <MailIcon className="auth-input-icon" />
                  <input
                    className="input"
                    value={form.newEmail}
                    onChange={(e) =>
                      setForm({ ...form, newEmail: e.target.value })
                    }
                    placeholder="new@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="auth-input-label">Password</label>
                <div className="relative">
                  <LockIcon className="auth-input-icon" />
                  <input
                    type="password"
                    className="input"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    placeholder="Your password"
                  />
                </div>
              </div>
              <div>
                <label className="auth-input-label">Full Name (optional)</label>
                <div className="relative">
                  <UserIcon className="auth-input-icon" />
                  <input
                    className="input"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div>
                <label className="auth-input-label">Nickname (optional)</label>
                <div className="relative">
                  <UserIcon className="auth-input-icon" />
                  <input
                    className="input"
                    value={form.nickname}
                    onChange={(e) =>
                      setForm({ ...form, nickname: e.target.value })
                    }
                    placeholder="CoolDude"
                  />
                </div>
              </div>
              <div>
                <label className="auth-input-label">Tag (optional)</label>
                <div className="relative">
                  <HashIcon className="auth-input-icon" />
                  <input
                    className="input"
                    value={form.tag}
                    onChange={(e) =>
                      setForm({ ...form, tag: e.target.value })
                    }
                    placeholder="cooltag"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button className="auth-btn w-full">Change Email</button>
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="auth-btn w-full bg-slate-700 text-slate-200"
                >
                  Back to Login
                </button>
              </div>
            </form>
          </div>
        </BorderAnimatedContainer>
      </div>
    </div>
  );
}

export default EmailChangePage;