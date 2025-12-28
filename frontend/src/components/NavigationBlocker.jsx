import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAccountStore } from "../store/useAccountStore";

function NavigationBlocker() {
  const { hasChanges } = useAccountStore();
  const location = useLocation();

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    const handleClick = (e) => {
      if (location.pathname.includes("/account") && hasChanges) {
        const target = e.target.closest('a');
        if (target && target.getAttribute('href') && !target.getAttribute('href').includes('/account')) {
          const confirmed = window.confirm(
            "You have unsaved changes. Are you sure you want to leave?"
          );
          if (!confirmed) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          }
        }
      }
      return true;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleClick, true);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleClick, true);
    };
  }, [hasChanges, location.pathname]);

  return null;
}

export default NavigationBlocker;