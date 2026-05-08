import { db, type CachedAudio } from '@engine/db/schema';
import type { SupportedLanguage } from '@i18n/init';

/**
 * Browser-Client für ElevenLabs.
 * Generiert personalisiertes Audio (z. B. mit Namen) und cached den Blob in IndexedDB.
 *
 * SICHERHEITSHINWEIS:
 * Da der API-Key client-seitig liegt (VITE_-Variable), ist er im JS-Bundle sichtbar.
 * Für Familien-Use OK; für öffentliche Veröffentlichung sollte man einen
 * Server-Proxy bauen (Cloudflare Worker / Edge Function).
 */

const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY as string | undefined;
const VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID as string | undefined;
const MODEL_ID = (import.meta.env.VITE_ELEVENLABS_MODEL_ID as string | undefined) ?? 'eleven_multilingual_v2';

export function isElevenLabsConfigured(): boolean {
  return !!API_KEY && !!VOICE_ID;
}

interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style: number;
  use_speaker_boost: boolean;
}

const VOICE_SETTINGS: VoiceSettings = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.4,
  use_speaker_boost: true,
};

/**
 * Generiert Audio direkt aus Text. Liefert einen Blob (mp3).
 */
export async function generateAudio(text: string): Promise<Blob> {
  if (!API_KEY || !VOICE_ID) {
    throw new Error('ElevenLabs nicht konfiguriert (.env prüfen)');
  }
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': API_KEY,
      'Content-Type': 'application/json',
      Accept: 'audio/mpeg',
    },
    body: JSON.stringify({ text, model_id: MODEL_ID, voice_settings: VOICE_SETTINGS }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs ${res.status}: ${err}`);
  }
  return await res.blob();
}

/**
 * Holt einen gecachten oder neu generierten Welcome-Sound für ein Profil.
 * Cache-Schlüssel: `welcome:${profileId}`. Bei Namensänderung wird der Cache invalidiert
 * (Vergleich des `text`-Felds).
 */
export async function getOrGenerateWelcomeAudio(
  profileId: string,
  text: string,
  language: SupportedLanguage,
): Promise<Blob | null> {
  const id = `welcome:${profileId}`;
  const cached = await db.audioCache.get(id);
  if (cached && cached.text === text && cached.language === language) {
    return cached.blob;
  }
  if (!isElevenLabsConfigured()) return null;

  try {
    const blob = await generateAudio(text);
    const entry: CachedAudio = {
      id,
      profileId,
      kind: 'welcome',
      text,
      blob,
      language,
      createdAt: Date.now(),
    };
    await db.audioCache.put(entry);
    return blob;
  } catch (err) {
    console.warn('[ElevenLabs] generateAudio failed, fallback to TTS', err);
    return null;
  }
}

/**
 * Bei Profil-Löschung: Audio-Cache aufräumen.
 */
export async function clearProfileAudioCache(profileId: string): Promise<void> {
  await db.audioCache.where('profileId').equals(profileId).delete();
}

/**
 * Liefert den passenden personalisierten Begrüßungstext zum Spielen.
 * Sprachspezifisch.
 */
export function welcomeText(name: string, language: SupportedLanguage, returning: boolean): string {
  if (returning) {
    return {
      de: `Hi ${name}! Schön, dass du wieder da bist.`,
      en: `Hi ${name}! Great to have you back.`,
      tr: `Hey ${name}! Geri döndüğüne sevindim.`,
      ru: `Привет ${name}! Рад, что ты вернулся.`,
    }[language];
  }
  return {
    de: `Willkommen ${name}! Lass uns dein Abenteuer starten.`,
    en: `Welcome ${name}! Let's start your adventure.`,
    tr: `Hoş geldin ${name}! Maceran başlasın.`,
    ru: `Добро пожаловать ${name}! Начнём твоё приключение.`,
  }[language];
}
