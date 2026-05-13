import React from "react";
import {useSearchParams} from "react-router-dom";
import Shell from "../components/layout/Shell.jsx";
import AppCtas from "../components/layout/AppCtas.jsx";
import {readAuth} from "../auth/session.js";
import {addMoney} from "../api/walletApi.js";
import {useToast} from "../components/ui/ToastProvider.jsx";
import {Icon} from "../components/ui/Icons.jsx";
import TransactionModal from "../components/ui/TransactionModal.jsx";
import "./appPages.css";

export default function AddMoneyPage() {
    const toast = useToast();
    const [params, setParams] = useSearchParams();
    const auth = readAuth();
    const userId = auth?.userId;

    const [amount, setAmount] = React.useState("100");
    const [busy, setBusy] = React.useState(false);
    const [completionDialog, setCompletionDialog] = React.useState(null);
    const processedPaymentRef = React.useRef("");

    const amountNum = Number(amount);
    const amountValid = Number.isFinite(amountNum) && amountNum > 0;

    React.useEffect(() => {
        const pgTxnId = params.get("pgTxnId") || params.get("txnId");
        if (!pgTxnId || processedPaymentRef.current === pgTxnId) return;

        processedPaymentRef.current = pgTxnId;
        const pendingKey = `nx_add_money_pending_${pgTxnId}`;
        let pending = null;
        try {
            pending = JSON.parse(localStorage.getItem(pendingKey) || "null");
        } catch {
            pending = null;
        }

        setBusy(false);

        setCompletionDialog({
            txnId: pgTxnId,
            amount: pending?.amount,
            status: "SUCCESS",
            reason: "",
            paymentTime: new Date(),
        });

        toast.push({
            type: "ok",
            title: "Money added to wallet successfully",
            message: "Your wallet balance has been updated.",
        });

        localStorage.removeItem(pendingKey);
        setParams({}, {replace: true});
    }, [params, setParams, toast]);

    return (
        <Shell cta={<AppCtas/>} footer={false}>
            <div className="appPage">
                <div className="appTitleRow">
                    <div>
                        <div className="appTitle">Add Money</div>
                        <div className="appSub">Choose an amount and continue securely through the payment page.</div>
                    </div>
                </div>

                <div className="panel addMoneyPanel">
                    <div className="panelHead">
                        <div className="panelTitle">Top Up Your Wallet</div>
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

                    <div className="row" style={{marginTop: 14}}>
                        <button
                            className="btn btn--primary"
                            type="button"
                            disabled={!userId || !amountValid || busy}
                            onClick={async () => {
                                setBusy(true);
                                try {
                                    const data = await addMoney({userId, amount: amountNum});

                                    const paymentUrl =
                                        data?.url ||
                                        data?.paymentUrl ||
                                        data?.redirectUrl ||
                                        data;

                                    const txnId =
                                        data?.pgTxnId ||
                                        data?.txnId ||
                                        data?.transactionId;

                                    if (!paymentUrl || typeof paymentUrl !== "string") {
                                        setBusy(false);
                                        toast.push({
                                            type: "error",
                                            title: "Payment initialization failed",
                                            message: "Payment gateway URL was not received.",
                                        });
                                        return;
                                    }

                                    if (txnId) {
                                        localStorage.setItem(
                                            `nx_add_money_pending_${txnId}`,
                                            JSON.stringify({
                                                amount: amountNum,
                                                userId,
                                                startedAt: new Date().toISOString()
                                            }),
                                        );
                                    }

                                    toast.push({
                                        type: "ok",
                                        title: "Redirecting to payment gateway",
                                        message: "Please complete your payment.",
                                    });

                                    window.location.href = paymentUrl;

                                } catch (e) {
                                    toast.push({
                                        type: "error",
                                        title: "Add money failed",
                                        message: e?.message || "We could not start the payment. Please try again.",
                                    });
                                    setBusy(false);
                                }
                            }}
                        >
                            {busy ? (
                                "Working..."
                            ) : (
                                <>
                                    <Icon name="credit-card"/>
                                    Continue to Payment
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {completionDialog ? (
                    <TransactionModal
                        title={
                            completionDialog.status === "SUCCESS"
                                ? "Money added to wallet successfully"
                                : "Money could not be added"
                        }
                        subtitle={completionDialog.paymentTime.toLocaleString()}
                        status={completionDialog.status}
                        fields={[
                            {label: "Payment Txn ID", value: completionDialog.txnId},
                            {
                                label: "Amount",
                                value: completionDialog.amount != null ? `INR ${Number(completionDialog.amount).toFixed(2)}` : "-",
                            },
                            {label: "Wallet User ID", value: userId},
                        ]}
                        reason={completionDialog.reason}
                        onClose={() => setCompletionDialog(null)}
                        ariaLabel="Add money transaction status"
                    />
                ) : null}
            </div>
        </Shell>
    );
}