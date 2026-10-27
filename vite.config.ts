import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import http from 'http';
import {spawn, ChildProcess} from 'child_process';

function autoStartAdminServerPlugin(): Plugin {
  return {
    name: 'auto-start-admin-server',
    configureServer(server) {
      if ((globalThis as any).__adminServerProcess && !(globalThis as any).__adminServerProcess.killed) {
        return;
      }

      const req = http.get('http://127.0.0.1:3001/api/config', () => {
        console.log('\n[Vite] ✅ Admin Server Alviero (Port 3001) sudah aktif.');
      });

      req.on('error', () => {
        console.log('\n[Vite] 🚀 Menjalankan Admin Server Alviero (Port 3001) secara otomatis...');
        const adminScript = path.resolve(__dirname, 'scripts', 'admin-server.cjs');
        const proc = spawn('node', [adminScript], {
          stdio: 'inherit',
          shell: true,
        });

        (globalThis as any).__adminServerProcess = proc;

        proc.on('error', (err) => {
          console.error('[Vite] ❌ Gagal menjalankan admin-server:', err.message);
        });
      });

      const cleanup = () => {
        const proc = (globalThis as any).__adminServerProcess;
        if (proc && !proc.killed) {
          try {
            proc.kill();
          } catch {}
          (globalThis as any).__adminServerProcess = undefined;
        }
      };

      process.on('exit', cleanup);
      process.on('SIGINT', cleanup);
      process.on('SIGTERM', cleanup);
      server.httpServer?.on('close', cleanup);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), autoStartAdminServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/adminsalto': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/adminsalto/, ''),
        },
        '/api': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
        },
      },
    },
  };
});
