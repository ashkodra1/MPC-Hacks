import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { copyFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const copyFilesPlugin = {
  name: "copy-files",
  writeBundle(options) {
    const filesToCopy = [
      { src: "manifest.json", dest: "dist/manifest.json" },
      { src: "content.js", dest: "dist/content.js" },
      { src: "popup.js", dest: "dist/popup.js" },
    ];

    filesToCopy.forEach(({ src, dest }) => {
      const srcPath = resolve(__dirname, src);
      const destPath = resolve(__dirname, dest);
      
      if (existsSync(srcPath)) {
        copyFileSync(srcPath, destPath);
        console.log(`✓ Copied ${src} to ${dest}`);
      }
    });
  },
};

export default defineConfig({
  plugins: [react(), copyFilesPlugin],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
      },
    },
  },
  server: {
    port: 5173,
  },
});
