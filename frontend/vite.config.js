import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In dev the Django API runs on :8000; proxying keeps the browser on one origin.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:8000", "/media": "http://localhost:8000" } },
});
