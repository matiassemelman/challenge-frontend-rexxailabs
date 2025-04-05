import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          reactRouter: ['react-router-dom'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-slot',
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
          ],
        },
      },
    },
    // Eliminar console.log en producción
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    } : undefined,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
