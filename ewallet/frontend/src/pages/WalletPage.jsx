import React from "react";
import Shell from "../components/layout/Shell.jsx";
import AppCtas from "../components/layout/AppCtas.jsx";
import { readAuth } from "../auth/session.js";
import { checkBalance, getWalletDetails } from "../api/walletApi.js";
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

export default function WalletPage() {
  const toast = useToast();
  const auth = readAuth();
  const userId = auth?.userId;

  const [loading, setLoading] = React.useState(true);
  const [wallet, setWallet] = React.useState(null);

  const load = React.useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const w = await getWalletDetails(userId);
      setWallet(w);
    } catch (e) {
      toast.push({ type: "error", title: "Wallet load failed", message: e?.message || "Request failed" });
    } finally {
      setLoading(false);
    }
  }, [toast, userId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const balance = wallet?.balance;

  return (
    <Shell cta={<AppCtas />} footer={false}>
      <div className="appPage">
        <div className="appTitleRow">
          <div>
            <div className="appTitle">Wallet</div>
            <div className="appSub">A polished view of your NexaroPay wallet and balance.</div>
          </div>
          <div className="row">
            <button className="btn btn--ghost" type="button" onClick={load} disabled={loading}>
              <RefreshIcon />
              Refresh
            </button>
            <button
              className="btn btn--ghost"
              type="button"
              onClick={async () => {
                try {
                  const w = await checkBalance(userId);
                  setWallet(w);
                  toast.push({ type: "ok", title: "Balance updated", message: "Latest wallet balance loaded." });
                } catch (e) {
                  toast.push({ type: "error", title: "Check balance failed", message: e?.message || "Request failed" });
                }
              }}
              disabled={loading}
            >
              Check balance
            </button>
          </div>
        </div>

        <div className="walletCardWrap">
          <div className="walletVisualCard">
            <div className="walletVisualCard__top">
              <img className="walletVisualCard__logo" src="/favicon.png" alt="" />
              <div className="walletVisualCard__chip" aria-hidden="true" />
            </div>
            <div>
              <div className="walletVisualCard__label">Available Balance</div>
              <div className="walletVisualCard__balance">
                {loading ? "Loading..." : balance == null ? "INR -" : `INR ${Number(balance).toFixed(2)}`}
              </div>
            </div>
            <div className="walletVisualCard__meta">
              <div>
                <span>User ID</span>
                <strong>{String(wallet?.userId ?? userId ?? "-")}</strong>
              </div>
              <div>
                <span>Wallet ID</span>
                <strong>{wallet?.walletId != null ? String(wallet.walletId) : "-"}</strong>
              </div>
            </div>
            <div className="walletVisualCard__brand">nexaroPay</div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
