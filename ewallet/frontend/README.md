# NexaroPay Frontend (React)

This folder is intentionally *not* a Maven module. It's a separate React app to serve as the frontend for the NexaroPay eWallet services.

## Development

Prerequisite: Node.js `>= 18` (your current error `Unexpected token '??='` happens on older Node versions like `v14.x`).

1. Start the backend services you want to exercise:
   - user-service: `8091`
   - wallet-service: `8092`
   - transaction-service: `8094`
   - payment-gateway-service: `9090`
2. From this folder:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### API wiring

- Signup calls `POST /user-service/user`
- In dev, the frontend calls `/api/<service-prefix>/*` and Vite routes each service prefix to the matching local backend (see `vite.config.js`).
