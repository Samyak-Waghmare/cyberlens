import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During local dev, proxy /api calls to the Express server on port 3001.
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.PORT) || 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: "dist",
  },
});
