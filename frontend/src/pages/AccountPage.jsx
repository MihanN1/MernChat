import React from "react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import AccountSidebar from "../components/account/AccountSidebar";
import AccountGeneralSection from "../components/account/AccountGeneralSection";
import AccountSecuritySection from "../components/account/AccountSecuritySection";
import AccountPrivacySection from "../components/account/AccountPrivacySection";

function AccountPage() {
  return (
    <div className="w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        <div className="flex w-full h-full">
          <div className="w-80 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/40 p-4">
            <AccountSidebar />
          </div>
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-900/40 backdrop-blur-sm">
            <AccountGeneralSection />
            <AccountSecuritySection />
            <AccountPrivacySection />
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default AccountPage;