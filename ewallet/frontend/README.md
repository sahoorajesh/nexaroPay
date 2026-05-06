# NexaroPay Frontend (React)

This folder is intentionally *not* a Maven module. It's a separate React app to serve as the frontend for the NexaroPay eWallet services.

## Development

Prerequisite: Node.js `>= 18` (your current error `Unexpected token '??='` happens on older Node versions like `v14.x`).

1. Start the backend user-service on port `8091`.
2. From this folder:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### API wiring

- Signup calls `POST /user-service/user`
- In dev, the frontend calls `/api/user-service/user` and Vite proxies `/api` to `http://localhost:8091` (see `vite.config.js`).
