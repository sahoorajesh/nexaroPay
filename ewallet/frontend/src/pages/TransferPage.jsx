import React from "react";
import Shell from "../components/layout/Shell.jsx";
import AppCtas from "../components/layout/AppCtas.jsx";
import { readAuth } from "../auth/session.js";
import { getTxnStatus, transferMoney } from "../api/transactionApi.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import "./appPages.css";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function TransferPage() {
  const toast = useToast();
  const auth = readAuth();
  const fromUserId = auth?.userId;

  const [toUserId, setToUserId] = React.useState("");
  const [amount, setAmount] = React.useState("10");
  const [comment, setComment] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [transferResult, setTransferResult] = React.useState(null);
  const [statusDialog, setStatusDialog] = React.useState(null);

  const toIdNum = Number(toUserId);
  const amountNum = Number(amount);
  const valid =
    Number.isFinite(toIdNum) &&
    toIdNum > 0 &&
    Number.isFinite(amountNum) &&
    amountNum > 0 &&
    String(fromUserId) !== String(toIdNum);

  async function pollStatus(txnId) {
    let latest = null;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      latest = await getTxnStatus(txnId);
      if (latest?.status && latest.status !== "PENDING") return latest;
      await sleep(900);
    }
    return latest;
  }

  async function onTransfer() {
    setBusy(true);
    setTransferResult(null);
    try {
      const id = await transferMoney({
        fromUserId,
        toUserId: toIdNum,
        amount: amountNum,
        comment: comment.trim() || null,
      });
      const txnId = String(id || "");
      toast.push({ type: "ok", title: "Transfer initiated", message: `Txn ID: ${txnId}` });

      let status = null;
      try {
        status = await pollStatus(txnId);
      } catch (statusError) {
        toast.push({
          type: "error",
          title: "Status check failed",
          message: statusError?.message || "Transfer was initiated, but status could not be loaded.",
        });
      }
      const paymentTime = new Date();
      const result = {
        txnId,
        fromUserId,
        toUserId: toIdNum,
        amount: amountNum,
        status: status?.status || "UNKNOWN",
        reason: status?.reason || "",
        paymentTime,
      };
      setTransferResult(result);
      setStatusDialog(result);
      toast.push({
        type: result.status === "SUCCESS" ? "ok" : result.status === "FAILED" ? "error" : "info",
        title: "Transfer status updated",
        message: `Status: ${result.status}`,
      });
    } catch (e) {
      toast.push({ type: "error", title: "Transfer failed", message: e?.message || "Request failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell cta={<AppCtas />} footer={false}>
      <div className="appPage">
        <div className="appTitleRow appTitleRow--stack">
          <div>
            <div className="appTitle appTitle--hero">Send With Confidence</div>
            <div className="appSub">
              Move money from your wallet and let NexaroPay track the transaction status automatically.
            </div>
          </div>
        </div>

        <div className="panel transferPanel">
          <div className="panelHead">
            <div className="panelTitle">Transfer Details</div>
          </div>

          <div className="grid2">
            <div className="field">
              <div className="label">From User ID</div>
              <input className="input" value={String(fromUserId || "")} disabled />
            </div>
            <div className="field">
              <div className="label">To User ID</div>
              <input className="input" value={toUserId} onChange={(e) => setToUserId(e.target.value)} inputMode="numeric" />
            </div>
            <div className="field">
              <div className="label">Amount</div>
              <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" />
            </div>
            <div className="field">
              <div className="label">Comment</div>
              <input
                className="input"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional note"
              />
            </div>
          </div>

          <div className="row" style={{ marginTop: 14 }}>
            <button className="btn btn--primary" type="button" disabled={!valid || busy} onClick={onTransfer}>
              {busy ? "Checking Status..." : "Send Money"}
            </button>
          </div>
        </div>

        <div className="panel statusCardPanel">
          <div className="panelHead">
            <div className="panelTitle">Latest Transfer</div>
          </div>
          {transferResult ? (
            <div className="statusSummary">
              <div className="statusBadge">{transferResult.status}</div>
              <div>
                <div className="statusSummary__id">{transferResult.txnId}</div>
                <div className="appSub">
                  From {transferResult.fromUserId} to {transferResult.toUserId} at{" "}
                  {transferResult.paymentTime.toLocaleString()}
                </div>
              </div>
              {transferResult.reason ? <div className="statusSummary__reason">{transferResult.reason}</div> : null}
            </div>
          ) : (
            <div className="appSub">Your next transfer status will appear here automatically.</div>
          )}
        </div>

        {statusDialog ? (
          <div className="modalShade" role="presentation" onClick={() => setStatusDialog(null)}>
            <div className="statusModal" role="dialog" aria-modal="true" aria-label="Transfer status" onClick={(e) => e.stopPropagation()}>
              <div className="statusModal__head">
                <div>
                  <div className="statusModal__title">Transfer {statusDialog.status}</div>
                  <div className="appSub">{statusDialog.paymentTime.toLocaleString()}</div>
                </div>
                <button className="iconBtn btn btn--ghost" type="button" onClick={() => setStatusDialog(null)} aria-label="Close">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M6 6l12 12M18 6 6 18"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
              <div className="statusModal__grid">
                <div>
                  <span>Txn ID</span>
                  <strong>{statusDialog.txnId}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>{statusDialog.status}</strong>
                </div>
                <div>
                  <span>From User ID</span>
                  <strong>{statusDialog.fromUserId}</strong>
                </div>
                <div>
                  <span>To User ID</span>
                  <strong>{statusDialog.toUserId}</strong>
                </div>
                <div>
                  <span>Time of Payment</span>
                  <strong>{statusDialog.paymentTime.toLocaleString()}</strong>
                </div>
              </div>
              {statusDialog.reason ? <div className="statusModal__reason">{statusDialog.reason}</div> : null}
            </div>
          </div>
        ) : null}
      </div>
    </Shell>
  );
}
