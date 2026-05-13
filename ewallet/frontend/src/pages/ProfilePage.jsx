import React from "react";
import Shell from "../components/layout/Shell.jsx";
import AppCtas from "../components/layout/AppCtas.jsx";
import { readAuth } from "../auth/session.js";
import { getUserDetails } from "../api/userApi.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import "./appPages.css";

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20 12a8 8 0 0 1-13.66 5.66M4 12A8 8 0 0 1 17.66 6.34M18 2v5h-5M6 22v-5h5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function ProfilePage() {
  const toast = useToast();
  const auth = readAuth();
  const userId = auth?.userId;

  const [busy, setBusy] = React.useState(true);
  const [user, setUser] = React.useState(null);

  const load = React.useCallback(async () => {
    if (!userId) return;
    setBusy(true);
    try {
      const u = await getUserDetails(userId);
      setUser(u);
    } catch (e) {
      toast.push({ type: "error", title: "Profile load failed", message: e?.message || "Request failed" });
    } finally {
      setBusy(false);
    }
  }, [toast, userId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const displayName = user?.name || auth?.user?.name || "NexaroPay User";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <Shell cta={<AppCtas />} footer={false}>
      <div className="appPage">
        <div className="appTitleRow">
          <div>
            <div className="appTitle">Profile</div>
            <div className="appSub">Your account identity, contact details, and verification number.</div>
          </div>
          <button className="btn btn--ghost" type="button" onClick={load} disabled={busy}>
            <RefreshIcon />
            Refresh
          </button>
        </div>

        <div className="profileCard">
          <div className="profileCard__hero">
            <div className="profileAvatar">{busy ? "..." : initials || "NP"}</div>
            <div>
              <div className="profileName">{busy ? "Loading profile..." : displayName}</div>
              <div className="profileEmail">{user?.email || auth?.user?.email || "-"}</div>
            </div>
          </div>
          <div className="profileDetailGrid">
            <div className="profileDetail">
              <span>User ID</span>
              <strong>{String(userId || "-")}</strong>
            </div>
            <div className="profileDetail">
              <span>Phone</span>
              <strong>{user?.phone || "-"}</strong>
            </div>
            <div className="profileDetail profileDetail--wide">
              <span>KYC Number</span>
              <strong>{user?.kycNumber || "-"}</strong>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
