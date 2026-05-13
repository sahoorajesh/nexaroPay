import React from "react";
import { Icon } from "./Icons.jsx";

function normalizeStatus(status) {
  const v = String(status || "UNKNOWN").toUpperCase();
  if (v === "SUCCESS" || v === "FAILED" || v === "PENDING") return v;
  return "UNKNOWN";
}

export default function TransactionModal({ title, subtitle, status, fields = [], reason, onClose, ariaLabel }) {
  const normalized = normalizeStatus(status);
  const tone = normalized.toLowerCase();
  const iconName = normalized === "SUCCESS" ? "check-circle" : normalized === "FAILED" ? "warning" : "info";

  return (
    <div className="modalShade" role="presentation" onClick={onClose}>
      <div
        className={`statusModal statusModal--${tone}`}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title || "Transaction status"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="statusModal__head">
          <div className="statusModal__titleWrap">
            <div className="statusModal__icon" aria-hidden="true">
              <Icon name={iconName} />
            </div>
            <div>
              <div className="statusModal__title">{title}</div>
              {subtitle ? <div className="appSub">{subtitle}</div> : null}
            </div>
          </div>
          <button className="iconBtn btn btn--ghost" type="button" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>

        <div className="statusModal__summary">
          <span>Status</span>
          <strong>{normalized}</strong>
        </div>

        <div className="statusModal__grid">
          {fields.map((field) => (
            <div key={field.label}>
              <span>{field.label}</span>
              <strong>{field.value == null || field.value === "" ? "-" : field.value}</strong>
            </div>
          ))}
        </div>
        {reason ? <div className="statusModal__reason">{reason}</div> : null}
      </div>
    </div>
  );
}
