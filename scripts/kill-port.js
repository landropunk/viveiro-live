#!/usr/bin/env node

/**
 * Script para matar procesos que ocupan un puerto específico
 * Uso: node scripts/kill-port.js [puerto]
 */

const { execSync } = require('child_process');

const port = process.argv[2] || '3000';

try {
  // Detectar el sistema operativo
  const isWindows = process.platform === 'win32';

  if (isWindows) {
    // Windows: usar netstat y taskkill
    try {
      const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8' });
      const lines = output.split('\n').filter(line => line.includes('LISTENING'));

      const pids = new Set();
      lines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        if (pid && !isNaN(pid)) {
          pids.add(pid);
        }
      });

      if (pids.size > 0) {
        pids.forEach(pid => {
          console.log(`🔪 Matando proceso ${pid} en puerto ${port}...`);
          execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
        });
        console.log(`✅ Puerto ${port} liberado`);
      } else {
        console.log(`✨ Puerto ${port} ya está disponible`);
      }
    } catch (error) {
      // Si no hay procesos, netstat dará error - esto es normal
      console.log(`✨ Puerto ${port} ya está disponible`);
    }
  } else {
    // Unix/Linux/macOS: usar lsof
    try {
      execSync(`lsof -ti:${port} | xargs kill -9`, { stdio: 'ignore' });
      console.log(`✅ Puerto ${port} liberado`);
    } catch (error) {
      // Si no hay procesos, lsof dará error - esto es normal
      console.log(`✨ Puerto ${port} ya está disponible`);
    }
  }
} catch (error) {
  console.error(`❌ Error al liberar puerto ${port}:`, error.message);
  process.exit(1);
}
