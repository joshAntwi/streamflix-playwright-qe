import { spawn, execFileSync, type ChildProcess } from 'node:child_process';
import { resolve } from 'node:path';

export const appUrl = process.env.BASE_URL ?? 'http://127.0.0.1:4173';
let server: ChildProcess | undefined;

// Cucumber does not run Playwright Test's webServer fixture.
// Start the *pinned upstream* app ourselves unless BASE_URL targets a deployed site.
export async function startAppIfNeeded(): Promise<void> {
  if (process.env.BASE_URL) return;

  const appDir = resolve(process.env.STREAMFLIX_DIR ?? '../../streamflix');

  execFileSync('npm', ['run', 'build'], {
    cwd: appDir,
    stdio: 'inherit',
    timeout: 180_000,
  });

  server = spawn(
    process.execPath,
    [resolve(appDir, 'node_modules/vite/bin/vite.js'), 'preview',
      '--host', '127.0.0.1', '--port', '4173', '--strictPort'],
    { cwd: appDir, stdio: 'ignore' },
  );

  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error('StreamFlix preview process exited');
    try {
      const response = await fetch(appUrl);
      if (response.ok) return;
    } catch {
      // Vite is still starting.
    }
    await new Promise((done) => setTimeout(done, 250));
  }
  throw new Error(`StreamFlix did not become ready at ${appUrl}`);
}

export function stopApp(): void {
  server?.kill();
  server = undefined;
}
