import React from "react";
import { Link } from "react-router-dom";
import "./shell.css";

export default function Shell({ children, cta, footer = true }) {
  const [theme, setTheme] = React.useState(() => {
    const saved = localStorage.getItem("nx_theme");
    // Default to dark unless the user explicitly selected light before.
    if (saved === "light") return "light";
    return "dark";
  });

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
    localStorage.setItem("nx_theme", theme);
  }, [theme]);

  const icon =
    theme === "dark" ? (
      // Sun icon
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M12 2v2M12 20v2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M18.4 5.6l1.4-1.4M4.2 19.8l1.4-1.4"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ) : (
      // Moon icon
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M21 13.2A8.1 8.1 0 0 1 10.8 3a7.8 7.8 0 1 0 10.2 10.2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar__inner">
          <Link to="/" className="brand" aria-label="NexaroPay Home">
            <img className="brand__logo" src="/favicon.png" alt="" />
            <span className="brand__name">NexaroPay</span>
          </Link>

          <div className="topbar__cta">
            <button
              className="btn btn--ghost iconBtn"
              type="button"
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {icon}
            </button>
            {cta}
          </div>
        </div>
      </header>

      <main className="content">{children}</main>

      {footer ? (
        <footer className="footer">
          <div className="footer__inner">
            <div className="footer__brand">
              <div className="footer__brandRow">
                <img className="footer__logo" src="/favicon.png" alt="" />
                <div>
                  <div className="footer__name">NexaroPay</div>
                  <div className="footer__tag">Wallet made simple</div>
                </div>
              </div>
            </div>

            <div className="footer__cols">
              <div className="footer__col">
                <div className="footer__head">About</div>
                <a className="footer__link" href="#">
                  Company
                </a>
                <a className="footer__link" href="#">
                  Careers
                </a>
                <a className="footer__link" href="#">
                  Blog
                </a>
              </div>
              <div className="footer__col">
                <div className="footer__head">Contact</div>
                <a className="footer__link" href="#">
                  Help center
                </a>
                <a className="footer__link" href="#">
                  Support
                </a>
                <a className="footer__link" href="#">
                  Email
                </a>
              </div>
              <div className="footer__col">
                <div className="footer__head">Legal</div>
                <a className="footer__link" href="#">
                  Privacy Policy
                </a>
                <a className="footer__link" href="#">
                  Terms
                </a>
                <a className="footer__link" href="#">
                  Security
                </a>
              </div>
              <div className="footer__col">
                <div className="footer__head">Social</div>
                <a className="footer__link" href="#" rel="noreferrer">
                  X (Twitter)
                </a>
                <a className="footer__link" href="#" rel="noreferrer">
                  LinkedIn
                </a>
                <a className="footer__link" href="#" rel="noreferrer">
                  GitHub
                </a>
              </div>
            </div>
          </div>

          <div className="footer__bottom">
            <div className="footer__bottomInner">
              <span className="footer__copy">© {new Date().getFullYear()} NexaroPay. All rights reserved.</span>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  );
}
