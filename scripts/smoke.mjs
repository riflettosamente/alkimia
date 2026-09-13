#!/usr/bin/env node
/**
 * Smoke test di ALKIMIA.
 *
 * Avvia il bundle di produzione (dist/server.cjs) su una porta effimera e verifica che:
 *   1. il server faccia il bind su process.env.PORT (non più hardcoded a 3000);
 *   2. gli endpoint diagnostici rispondano con JSON valido;
 *   3. /api/daily-edition dichiari onestamente lo stato della redazione;
 *   4. il contenuto provvisorio NON venga spacciato per saggio generato da un provider.
 *
 * Non richiede chiavi API: senza chiavi la catena di provider deve fallire in modo
 * esplicito (`status: "failed"` con motivo testuale), non in silenzio.
 *
 * Uso:  npm run build && npm run smoke
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const BUNDLE = path.resolve('dist/server.cjs');
const PORT = 4321;
const BASE = `http://127.0.0.1:${PORT}`;

let failures = 0;
const ok = (label, extra = '') => console.log(`  \x1b[32m✓\x1b[0m ${label}${extra ? ` — ${extra}` : ''}`);
const ko = (label, extra = '') => {
  failures += 1;
  console.log(`  \x1b[31m✗\x1b[0m ${label}${extra ? ` — ${extra}` : ''}`);
};

if (!existsSync(BUNDLE)) {
  console.error('dist/server.cjs mancante: esegui prima `npm run build`.');
  process.exit(1);
}

const child = spawn(process.execPath, [BUNDLE], {
  env: {
    ...process.env,
    NODE_ENV: 'production',
    PORT: String(PORT),
    // Nessuna chiave: si verifica il percorso di fallimento esplicito.
    OPENROUTER_API_KEY: '',
    GEMINI_API_KEY: '',
    CLOUDFLARE_API_KEY: '',
    CLOUDFLARE_API_TOKEN: '',
    CLOUDFLARE_ACCOUNT_ID: ''
  },
  stdio: ['ignore', 'pipe', 'pipe']
});

/**
 * `process.exit()` salta il blocco `finally`: senza una chiusura esplicita il processo
 * figlio resterebbe orfano e manterrebbe occupata la porta di test.
 */
function shutdown(code) {
  try {
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
  } catch {
    // già terminato
  }
  process.exit(code);
}

process.on('exit', () => {
  try { child.kill('SIGKILL'); } catch { /* già terminato */ }
});

let serverLog = '';
child.stdout.on('data', d => { serverLog += d.toString(); });
child.stderr.on('data', d => { serverLog += d.toString(); });

async function waitForBoot(timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/api/health`);
      if (res.ok) return true;
    } catch {
      // non ancora in ascolto
    }
    await new Promise(r => setTimeout(r, 400));
  }
  return false;
}

async function getJson(url) {
  const res = await fetch(url);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { /* lasciato a null */ }
  return { status: res.status, contentType: res.headers.get('content-type') || '', json, text };
}

try {
  console.log('\nALKIMIA — smoke test\n');

  const booted = await waitForBoot();
  if (!booted) {
    ko('bind su process.env.PORT', `nessuna risposta su ${BASE}`);
    console.log('\n--- log del server ---\n' + serverLog);
    shutdown(1);
  }
  ok('bind su process.env.PORT', `porta ${PORT}`);

  const health = await getJson(`${BASE}/api/health`);
  health.json ? ok('/api/health risponde con JSON valido') : ko('/api/health non restituisce JSON');
  health.json?.activeProvider === 'none'
    ? ok('/api/health dichiara activeProvider "none" senza chiavi configurate')
    : ko('/api/health activeProvider inatteso', String(health.json?.activeProvider));
  if (health.json?.todayEdition?.generation) {
    ok('/api/health espone lo stato della redazione odierna',
       health.json.todayEdition.generation.status);
  } else {
    ko('/api/health non espone todayEdition.generation');
  }

  const providers = await getJson(`${BASE}/api/ai-providers`);
  providers.json ? ok('/api/ai-providers risponde con JSON valido') : ko('/api/ai-providers non restituisce JSON');

  const topics = await getJson(`${BASE}/api/topics`);
  topics.json?.count === 8
    ? ok('/api/topics restituisce gli 8 vettori ontologici')
    : ko('/api/topics count inatteso', String(topics.json?.count));

  const pair = await getJson(`${BASE}/api/select-vector-pair?solarDate=2026-09-13`);
  const a = pair.json?.vectorA?.name;
  const b = pair.json?.vectorB?.name;
  a && b && a !== b
    ? ok('/api/select-vector-pair estrae due vettori distinti', `${a} × ${b}`)
    : ko('/api/select-vector-pair non restituisce una coppia valida');

  const daily = await getJson(`${BASE}/api/daily-edition`);
  daily.json?.success === true
    ? ok('/api/daily-edition risponde success: true')
    : ko('/api/daily-edition non risponde success');

  const status = daily.json?.generation?.status;
  ['placeholder', 'generating', 'failed'].includes(status)
    ? ok('/api/daily-edition dichiara uno stato provvisorio o fallito senza chiavi', status)
    : ko('/api/daily-edition stato inatteso', String(status));

  daily.json?.edition?.aiProvider === null
    ? ok('il contenuto provvisorio non attribuisce un provider fittizio')
    : ko('il contenuto provvisorio attribuisce ancora un provider',
         String(daily.json?.edition?.aiProvider));

  // I due campi devono coincidere: il client legge sia edition.generationStatus sia generation.status.
  await new Promise(r => setTimeout(r, 1500));
  const coerent = await getJson(`${BASE}/api/daily-edition`);
  const editionStatus = coerent.json?.edition?.generationStatus;
  const generationStatus = coerent.json?.generation?.status;
  editionStatus === generationStatus
    ? ok('edition.generationStatus coerente con generation.status', String(editionStatus))
    : ko('edition.generationStatus diverge da generation.status',
         `${editionStatus} vs ${generationStatus}`);

  generationStatus === 'failed' && typeof coerent.json?.edition?.generationError === 'string'
    ? ok('il motivo del fallimento è esposto anche sull\'edizione')
    : ko('generationError non esposto sull\'edizione', String(coerent.json?.edition?.generationError));

  const dailyStatus = await getJson(`${BASE}/api/daily-edition/status`);
  dailyStatus.json?.exists === true
    ? ok('/api/daily-edition/status restituisce lo stato della redazione')
    : ko('/api/daily-edition/status non risponde correttamente');

  // Dopo il tentativo della catena di provider, senza chiavi lo stato deve diventare "failed"
  // con un motivo testuale: è la garanzia che l'errore non venga più inghiottito.
  await new Promise(r => setTimeout(r, 2500));
  const settled = await getJson(`${BASE}/api/daily-edition/status`);
  const settledStatus = settled.json?.generation?.status;
  settledStatus === 'failed' && settled.json?.generation?.error
    ? ok('il fallimento della catena AI viene registrato con il motivo', String(settled.json.generation.error).slice(0, 90) + '…')
    : ko('il fallimento della catena AI non è registrato correttamente', String(settledStatus));

  const regen = await fetch(`${BASE}/api/daily-edition/regenerate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wait: true, force: true })
  });
  const regenBody = await regen.json().catch(() => null);
  regen.ok && regenBody && typeof regenBody.success === 'boolean'
    ? ok('/api/daily-edition/regenerate risponde (rigenerazione esplicita)')
    : ko('/api/daily-edition/regenerate non risponde correttamente', `HTTP ${regen.status}`);

  const spa = await fetch(`${BASE}/`);
  const spaText = await spa.text();
  spa.ok && spaText.includes('<div id="root">')
    ? ok('la SPA di produzione viene servita da dist/')
    : ko('la SPA di produzione non viene servita correttamente', `HTTP ${spa.status}`);

  const apiMiss = await fetch(`${BASE}/api/inesistente`);
  apiMiss.status === 404
    ? ok('una rotta API sconosciuta restituisce 404, non l\'HTML della SPA')
    : ko('rotta API sconosciuta gestita male', `HTTP ${apiMiss.status}`);

  console.log('');
  if (failures === 0) {
    console.log('\x1b[32mTutti i controlli superati.\x1b[0m\n');
    shutdown(0);
  } else {
    console.log(`\x1b[31m${failures} controllo/i fallito/i.\x1b[0m`);
    console.log('\n--- log del server ---\n' + serverLog + '\n');
    shutdown(1);
  }
} catch (err) {
  ko('esecuzione dello smoke test', err?.message || String(err));
  console.log('\n--- log del server ---\n' + serverLog + '\n');
  shutdown(1);
}
