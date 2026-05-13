import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import "./toast.css";

const ToastCtx = createContext(null);

let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const tm = timers.current.get(id);
    if (tm) clearTimeout(tm);
    timers.current.delete(id);
  }, []);

  const push = useCallback(
    ({ type = "info", title, message, durationMs = 3200 }) => {
      const id = nextId++;
      const toast = { id, type, title, message };
      setToasts((prev) => [...prev, toast]);
      if (durationMs > 0) {
        const tm = setTimeout(() => dismiss(id), durationMs);
        timers.current.set(id, tm);
      }
      return id;
    },
    [dismiss],
  );

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss]);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="toastHost" aria-live="polite" aria-relevant="additions removals">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`} role="status">
            <div className="toast__bar" aria-hidden="true" />
            <div className="toast__body">
              {t.title ? <div className="toast__title">{t.title}</div> : null}
              <div className="toast__msg">{t.message}</div>
            </div>
            <button className="toast__x" type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss">
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const v = useContext(ToastCtx);
  if (!v) throw new Error("useToast must be used within ToastProvider");
  return v;
}
