import React from "react";
import Shell from "../components/layout/Shell.jsx";
import AppCtas from "../components/layout/AppCtas.jsx";
import { readAuth } from "../auth/session.js";
import { getTxnStatus, transferMoney } from "../api/transactionApi.js";
import { useToast } from "../components/ui/ToastProvider.jsx";
import { Icon } from "../components/ui/Icons.jsx";
import TransactionModal from "../components/ui/TransactionModal.jsx";
import "./appPages.css";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function transferTitle(status) {
  if (status === "SUCCESS") return "Transfer completed successfully";
  if (status === "FAILED") return "Transfer could not be completed";
  if (status === "PENDING") return "Transfer is still processing";
  return "Transfer status updated";
}

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
      toast.push({
        type: "error",
        title: "Transfer failed",
        message: e?.message || "We could not complete the transfer. Please try again.",
      });
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
              {busy ? (
                "Checking Status..."
              ) : (
                <>
                  <Icon name="send" />
                  Send Money
                </>
              )}
            </button>
          </div>
        </div>

        <div className="panel statusCardPanel">
          <div className="panelHead">
            <div className="panelTitle">Latest Transfer</div>
          </div>
          {transferResult ? (
            <div className="statusSummary">
              <div className={`statusBadge statusBadge--${String(transferResult.status).toLowerCase()}`}>
                {transferResult.status}
              </div>
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
          <TransactionModal
            title={transferTitle(statusDialog.status)}
            subtitle={statusDialog.paymentTime.toLocaleString()}
            status={statusDialog.status}
            fields={[
              { label: "Txn ID", value: statusDialog.txnId },
              { label: "From User ID", value: statusDialog.fromUserId },
              { label: "To User ID", value: statusDialog.toUserId },
              { label: "Amount", value: `INR ${Number(statusDialog.amount).toFixed(2)}` },
              { label: "Time of Payment", value: statusDialog.paymentTime.toLocaleString() },
            ]}
            reason={statusDialog.reason}
            onClose={() => setStatusDialog(null)}
            ariaLabel="Transfer status"
          />
        ) : null}
      </div>
    </Shell>
  );
}
