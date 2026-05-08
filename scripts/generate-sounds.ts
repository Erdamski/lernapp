/**
 * ElevenLabs Sound-Effects-Generator.
 *
 * Anders als TTS (siehe generate-audio.ts) nutzt der Sound-Generation-Endpoint
 * `/v1/sound-generation` und beschreibt Sounds in Prompt-Form.
 *
 *   npm run sound:generate              # alle Sounds
 *   npm run sound:generate -- --only ui/coin
 *   npm run sound:generate -- --force   # auch existierende neu erzeugen
 */
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { soundManifest } from '../src/engine/audio/soundManifest';

const API_KEY = process.env.ELEVENLABS_API_KEY;
const OUT_DIR = path.resolve(process.cwd(), 'public/sounds');

if (!API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY fehlt in .env');
  process.exit(1);
}

const args = process.argv.slice(2);
function getFlag(name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}
const onlyArg = getFlag('--only');
const force = args.includes('--force');

async function generateOne(text: string, durationSeconds: number, outFile: string, promptInfluence = 0.3) {
  const url = 'https://api.elevenlabs.io/v1/sound-generation';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY!,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      duration_seconds: durationSeconds,
      prompt_influence: promptInfluence,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${err}`);
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, buffer);
}

async function main() {
  const keys = onlyArg ? [onlyArg] : Object.keys(soundManifest);
  let generated = 0, skipped = 0, failed = 0;
  for (const key of keys) {
    const entry = soundManifest[key];
    if (!entry) {
      console.warn(`⚠️  Key nicht gefunden: ${key}`);
      continue;
    }
    const outFile = path.join(OUT_DIR, `${key}.mp3`);
    if (!force) {
      try { await fs.access(outFile); skipped++; continue; } catch {}
    }
    try {
      process.stdout.write(`▶  ${key}  (${entry.duration}s) … `);
      await generateOne(entry.prompt, entry.duration, outFile, entry.promptInfluence);
      generated++;
      console.log('✓');
    } catch (err) {
      failed++;
      console.error(`✗ ${(err as Error).message}`);
    }
  }
  console.log(`---\nErzeugt: ${generated}  Übersprungen: ${skipped}  Fehlgeschlagen: ${failed}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
