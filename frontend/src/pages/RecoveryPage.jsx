import React, { useEffect } from "react";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import RecoverySidebar from "../components/recovery/RecoverySidebar";
import RecoveryEmail from "../components/recovery/RecoveryEmail";
import RecoveryPassword from "../components/recovery/RecoveryPassword";
import { useAccountStore } from "../store/useAccountStore";
import NoRecoveryPlaceholder from '../components/recovery/NoRecoveryPlaceholder';

function RecoveryPage() {
  const { activeRecovery, setActiveRecovery, resetRecovery } = useAccountStore();
  
  useEffect(() => {
    resetRecovery();
    setActiveRecovery(null);
  }, [resetRecovery, setActiveRecovery]);

  return (
    <div className="w-full max-w-6xl h-[800px]">
      <BorderAnimatedContainer>
        <div className="flex w-full h-full">
          <div className="w-80 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/40 p-4">
            <RecoverySidebar />
          </div>
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-900/40 backdrop-blur-sm">
            {activeRecovery === "email" ? <RecoveryEmail /> :
             activeRecovery === "password" ? <RecoveryPassword /> :
             <NoRecoveryPlaceholder />}
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default RecoveryPage;