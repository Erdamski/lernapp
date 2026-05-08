/**
 * ElevenLabs Audio-Generator.
 *
 * Liest das Audio-Manifest aus src/engine/audio/manifest.ts und erzeugt
 * pro Eintrag und Sprache eine MP3-Datei in /public/audio/{lang}/{key}.mp3.
 *
 * Aufruf:   npm run audio:generate
 * Optional: npm run audio:generate -- --lang de            # nur eine Sprache
 *           npm run audio:generate -- --only math/world1_intro
 *           npm run audio:generate -- --force              # auch bestehende neu erzeugen
 */
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { audioManifest } from '../src/engine/audio/manifest';

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID ?? 'eleven_multilingual_v2';
const OUT_DIR = path.resolve(process.cwd(), 'public/audio');

if (!API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY fehlt in .env');
  process.exit(1);
}
if (!VOICE_ID) {
  console.error('❌ ELEVENLABS_VOICE_ID fehlt in .env');
  process.exit(1);
}

const args = process.argv.slice(2);
function getFlag(name: string): string | undefined {
  const idx = args.indexOf(name);
  if (idx === -1) return undefined;
  return args[idx + 1];
}
const langArg = getFlag('--lang');
const onlyArg = getFlag('--only');
const force = args.includes('--force');

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

const VOICE_SETTINGS: VoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.4,         // Etwas Ausdruck für Kinder
  use_speaker_boost: true,
};

async function generateOne(text: string, outFile: string) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY!,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: VOICE_SETTINGS,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${errBody}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, buffer);
}

async function main() {
  const langsToProcess = (langArg ? [langArg] : ['de', 'en', 'tr', 'ru']) as ('de' | 'en' | 'tr' | 'ru')[];
  const keys = onlyArg ? [onlyArg] : Object.keys(audioManifest);

  let totalChars = 0;
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const key of keys) {
    const entry = audioManifest[key];
    if (!entry) {
      console.warn(`⚠️  Key nicht gefunden: ${key}`);
      continue;
    }
    for (const lang of langsToProcess) {
      const text = entry[lang];
      const outFile = path.join(OUT_DIR, lang, `${key}.mp3`);

      if (!force) {
        try {
          await fs.access(outFile);
          skipped++;
          continue;
        } catch {
          // existiert nicht → generieren
        }
      }

      try {
        process.stdout.write(`▶  ${lang}/${key} (${text.length} Z) … `);
        await generateOne(text, outFile);
        totalChars += text.length;
        generated++;
        console.log('✓');
      } catch (err) {
        failed++;
        console.error(`✗ ${(err as Error).message}`);
      }
    }
  }

  console.log('---');
  console.log(`Erzeugt: ${generated}  Übersprungen: ${skipped}  Fehlgeschlagen: ${failed}`);
  console.log(`Verbrauchte Zeichen: ${totalChars}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
