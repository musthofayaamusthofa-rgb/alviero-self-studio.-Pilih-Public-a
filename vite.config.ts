import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';
import http from 'http';
import {spawn} from 'child_process';

function autoStartAdminServerPlugin(): Plugin {
  return {
    name: 'auto-start-admin-server',
    configureServer(server) {
      const startAdminServer = () => {
        if ((globalThis as any).__adminServerProcess && !(globalThis as any).__adminServerProcess.killed) {
          return;
        }

        const adminScript = path.resolve(__dirname, 'scripts', 'admin-server.cjs');
        console.log('\n[Vite] 🚀 Memastikan Admin Server Alviero (Port 3001) aktif...');

        const nodeExec = process.execPath || 'node';
        const proc = spawn(nodeExec, [adminScript], {
          stdio: 'inherit',
          shell: false,
          env: {
            ...process.env,
            PATH: `C:\\Program Files\\nodejs;${process.env.PATH || ''}`,
          },
        });

        (globalThis as any).__adminServerProcess = proc;

        proc.on('error', (err) => {
          console.error('[Vite] ❌ Gagal menjalankan admin-server:', err.message);
        });

        proc.on('exit', (code) => {
          if (code !== 0 && code !== null) {
            console.log(`[Vite] Admin server berhenti dengan kode ${code}`);
          }
          (globalThis as any).__adminServerProcess = undefined;
        });
      };

      const checkAndStart = () => {
        const req = http.get('http://127.0.0.1:3001/api/config', (res) => {
          if (res.statusCode === 200) {
            console.log('\n[Vite] ✅ Admin Server Alviero (Port 3001) sudah aktif.');
          } else {
            startAdminServer();
          }
        });

        req.on('error', () => {
          startAdminServer();
        });
      };

      checkAndStart();

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
          configure: (proxy) => {
            proxy.on('error', (_err, _req, res: any) => {
              // Jika port 3001 belum sempat ready, layani langsung file static admin-ui
              const fallbackPath = path.resolve(__dirname, 'public', 'adminsalto', 'index.html');
              if (fs.existsSync(fallbackPath) && res && !res.headersSent) {
                res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                fs.createReadStream(fallbackPath).pipe(res);
              }
            });
          },
        },
        '/api': {
          target: 'http://127.0.0.1:3001',
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.warn('[Proxy API] Port 3001 belum terhubung:', err.message);
            });
          },
        },
      },
    },
  };
});
