const { execSync } = require('child_process');

const port = process.argv[2] || 3000;

try {
  console.log(`Intentando liberar puerto ${port}...`);

  // En Windows, encuentra y mata el proceso usando el puerto
  const command = `netstat -ano | findstr :${port}`;
  const output = execSync(command, { encoding: 'utf-8' }).toString();

  if (output) {
    const lines = output.trim().split('\n');
    const pids = new Set();

    lines.forEach(line => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[parts.length - 1];
      if (pid && !isNaN(pid)) {
        pids.add(pid);
      }
    });

    pids.forEach(pid => {
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        console.log(`✅ Proceso ${pid} terminado`);
      } catch (err) {
        // Ignorar errores si el proceso ya no existe
      }
    });
  } else {
    console.log(`✅ Puerto ${port} ya está libre`);
  }
} catch (error) {
  // Si no hay procesos usando el puerto, está bien
  console.log(`✅ Puerto ${port} disponible`);
}
