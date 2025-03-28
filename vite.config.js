import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  optimizeDeps: {
    include: ["jodit-react"],
  },
  build: {
    outDir: "dist", // Ensure Vite outputs build files to 'dist'
    emptyOutDir: true, // Clears the output directory before building
  },
  server: {
    port: 3000, // Optional: Change to your preferred port
    option:true,
  },
});
