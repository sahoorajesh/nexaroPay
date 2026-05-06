import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dev proxy:
// Frontend calls /api/*, Vite proxies to user-service (8091) so the browser doesn't hit CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8091",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
