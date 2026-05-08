import type { SupportedLanguage } from '@i18n/init';

class AudioPlayer {
  private cache = new Map<string, HTMLAudioElement>();
  private currentLang: SupportedLanguage = 'de';
  private enabled = true;

  setLanguage(lang: SupportedLanguage) {
    this.currentLang = lang;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  /**
   * Plays an audio file by key.
   * Resolves to URL like /audio/{lang}/{key}.mp3
   * Returns a Promise that resolves when playback ends or rejects if file is missing.
   */
  async play(key: string, opts?: { fallbackToTTS?: boolean; lang?: SupportedLanguage }): Promise<void> {
    if (!this.enabled) return;
    const lang = opts?.lang ?? this.currentLang;
    const url = `/audio/${lang}/${key}.mp3`;
    let audio = this.cache.get(url);
    if (!audio) {
      audio = new Audio(url);
      this.cache.set(url, audio);
    }
    try {
      audio.currentTime = 0;
      await audio.play();
      await new Promise<void>((resolve) => {
        audio!.onended = () => resolve();
        audio!.onerror = () => resolve();
      });
    } catch (err) {
      if (opts?.fallbackToTTS && 'speechSynthesis' in window) {
        this.fallbackTTS(key, lang);
      }
    }
  }

  /**
   * Browser-TTS-Fallback (kein ElevenLabs nötig). Nutzbar in der Entwicklung,
   * bevor Audio-Dateien generiert sind.
   */
  fallbackTTS(text: string, lang: SupportedLanguage) {
    if (!('speechSynthesis' in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = { de: 'de-DE', en: 'en-US', tr: 'tr-TR', ru: 'ru-RU' }[lang];
    utter.rate = 0.95;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
  }

  /** Direkter TTS-Aufruf für freien Text (wenn keine Audio-Datei existiert). */
  speak(text: string, lang?: SupportedLanguage) {
    if (!this.enabled) return;
    this.fallbackTTS(text, lang ?? this.currentLang);
  }

  stop() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    this.cache.forEach((a) => a.pause());
  }
}

export const audio = new AudioPlayer();
