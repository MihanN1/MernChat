import { UserIcon, ShieldIcon, LockIcon, HelpCircleIcon } from "lucide-react";
import { useAccountStore } from "../../store/useAccountStore";
import { useEffect } from "react";

function AccountSidebar() {
  const { activeSetting, setActiveSetting } = useAccountStore();
  useEffect(() => {
    return () => {
      setActiveSetting(null);
    };
  }, [setActiveSetting]);
  
  const items = [
    {
      id: "general",
      title: "General",
      description: "Profile & basic information",
      icon: UserIcon,
    },
    {
      id: "security",
      title: "Security",
      description: "Password & authentication",
      icon: ShieldIcon,
    },
  ];

  return (
    <div className="space-y-2">
      <div className="mb-4">
        <h3 className="text-slate-200 font-semibold text-lg">
          Account Settings
        </h3>
        <p className="text-slate-400 text-sm">
          Manage your account preferences
        </p>
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSetting === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveSetting(item.id)}
            className={`
              w-full text-left p-4 rounded-lg transition-colors
              ${
                isActive
                  ? "bg-cyan-500/15 border border-cyan-500/30"
                  : "bg-slate-800/40 hover:bg-slate-700/40 border border-transparent"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div
                className={`
                  p-2 rounded-md
                  ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-slate-700/40 text-slate-400"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4
                  className={`font-medium truncate ${
                    isActive ? "text-cyan-400" : "text-slate-200"
                  }`}
                >
                  {item.title}
                </h4>
                <p className="text-slate-400 text-sm truncate">
                  {item.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
      {!activeSetting && (
        <div className="mt-6 p-4 rounded-lg bg-slate-800/30 border border-slate-700/40">
          <div className="flex items-center gap-3 text-slate-400">
            <HelpCircleIcon className="w-5 h-5" />
            <p className="text-sm">
              Select a setting to view details
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountSidebar;