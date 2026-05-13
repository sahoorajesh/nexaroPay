import React from "react";
import Shell from "../components/layout/Shell.jsx";
import AppCtas from "../components/layout/AppCtas.jsx";
import { readAuth } from "../auth/session.js";
import { addMoney } from "../api/walletApi.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import "./appPages.css";

export default function AddMoneyPage() {
  const toast = useToast();
  const auth = readAuth();
  const userId = auth?.userId;

  const [amount, setAmount] = React.useState("100");
  const [busy, setBusy] = React.useState(false);

  const amountNum = Number(amount);
  const amountValid = Number.isFinite(amountNum) && amountNum > 0;

  return (
    <Shell cta={<AppCtas />} footer={false}>
      <div className="appPage">
        <div className="appTitleRow">
          <div>
            <div className="appTitle">Add Money</div>
            <div className="appSub">Choose an amount and continue securely through the payment page.</div>
          </div>
        </div>

        <div className="panel addMoneyPanel">
          <div className="panelHead">
            <div className="panelTitle">Create Add-Money Transaction</div>
          </div>

          <div className="moneyForm">
            <div className="field">
              <div className="label">Amount</div>
              <input
                className="input input--large"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="e.g. 250"
              />
            </div>
          </div>

          <div className="row" style={{ marginTop: 14 }}>
            <button
              className="btn btn--primary"
              type="button"
              disabled={!userId || !amountValid || busy}
              onClick={async () => {
                setBusy(true);
                const paymentTab = window.open("", "_blank");
                if (paymentTab) paymentTab.opener = null;
                try {
                  const data = await addMoney({ userId, amount: amountNum });
                  if (data?.url) {
                    if (paymentTab) {
                      paymentTab.location.href = data.url;
                    } else {
                      window.open(data.url, "_blank", "noopener,noreferrer");
                    }
                    toast.push({ type: "ok", title: "Payment initiated", message: "Payment page opened in a new tab." });
                  } else {
                    if (paymentTab) paymentTab.close();
                    toast.push({ type: "info", title: "Payment initiated", message: "No payment URL was returned." });
                  }
                } catch (e) {
                  if (paymentTab) paymentTab.close();
                  toast.push({ type: "error", title: "Add money failed", message: e?.message || "Request failed" });
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Working..." : "Initiate Payment"}
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
