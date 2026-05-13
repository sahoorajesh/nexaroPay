# NexaroPay Frontend UI Notes

This document explains the React UI pages used to exercise the backend services, excluding notifications.

## Auth And Redirects

Auth is stored in `sessionStorage` key `nx_auth` as:

```json
{ "userId": 123, "user": { "name": "...", "email": "...", "phone": "...", "kycNumber": "..." } }
```

Helpers live in `src/auth/session.js`.

Routing guards live in `src/App.jsx`:

- Public-only routes: `/login`, `/signin`, `/signup`
  - If `nx_auth.userId` exists, they redirect to `/welcome`
- Protected routes: `/welcome`, `/wallet`, `/add-money`, `/transfer`, `/txn-status`, `/profile`, `/merchant`
  - If not logged in, they redirect to `/login`

## API Routing

The UI calls backend endpoints through `/api/*`. In development, `vite.config.js` routes each service prefix to the correct local backend:

- `/api/user-service/*` -> `http://localhost:8091`
- `/api/wallet-service/*` -> `http://localhost:8092`
- `/api/transaction-service/*` -> `http://localhost:8094`
- `/api/merchant-service/*` -> `http://localhost:9090`
- `/api/pg-service/*` -> `http://localhost:9090`

This keeps browser requests on the Vite origin while avoiding CORS issues.

## Pages

All pages below are routed in `src/App.jsx` and use `Shell` + `AppCtas` for a consistent header.

`/wallet`

- Loads wallet details automatically for the logged-in user.
- Shows wallet data as a NexaroPay-styled card with brand icon, balance, user id, wallet id, and brand name.
- Provides Refresh and Check balance actions.
- Files:
  - `src/pages/WalletPage.jsx`
  - `src/api/walletApi.js`

`/add-money`

- Uses the logged-in `userId` internally; the page only asks for the amount.
- Starts the add-money transaction and automatically opens the returned payment URL in a new browser tab.
- No longer displays the raw response section.
- No longer exposes the manual process-payment helper.
- Files:
  - `src/pages/AddMoneyPage.jsx`
  - `src/api/walletApi.js`

`/transfer`

- Uses a stronger header: "Send With Confidence" with explanatory supporting text.
- Starts a transfer with from user id, to user id, amount, and optional comment.
- After a transfer is initiated, polls transaction status automatically.
- Shows the latest transfer status inline and opens a modal with transaction id, status, from user id, to user id, and payment time.
- Files:
  - `src/pages/TransferPage.jsx`
  - `src/api/transactionApi.js`

`/txn-status`

- Supports manual lookup by transaction id.
- Supports `?txnId=...` query param.
- The Fetch button is aligned with the transaction id input.
- Files:
  - `src/pages/TxnStatusPage.jsx`
  - `src/api/transactionApi.js`

`/profile`

- Loads user details automatically for the logged-in user.
- Shows a visual profile card with initials, name, email, user id, phone, and KYC number.
- Replaces the older table-like key/value layout.
- Files:
  - `src/pages/ProfilePage.jsx`
  - `src/api/userApi.js`

`/merchant`

- Registers a merchant through the payment-gateway module.
- Primarily used for testing merchant setup during development.
- Files:
  - `src/pages/MerchantRegisterPage.jsx`
  - `src/api/merchantApi.js`

## API Helper Pattern

`src/api/http.js` provides `jsonFetch(path, options)` for JSON endpoints:

- Adds `Content-Type: application/json`
- Reads JSON or text based on `content-type`
- Throws an `Error` with a readable message on non-2xx responses

## Styling

Shared page styling is in `src/pages/appPages.css`:

- Page titles, panels, fields, grids, modals, wallet card, profile card, and status summaries.
- Wallet page uses a card-style visual layout.
- Profile page uses a visual identity card.
- Transfer page uses an inline status summary and modal.

Global button styling is in `src/styles/global.css`:

- Buttons use stronger typography, subtle elevation, and a dark-blue/gold primary treatment.
- Refresh buttons use inline SVG icons.
