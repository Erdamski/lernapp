/**
 * SoundPlayer für Spiel-Sound-Effekte (UI-Tap, Correct, Coin, Star, …)
 * Separat vom AudioPlayer (Sprachausgabe), damit beide unabhängig
 * gemutet werden können und Sounds sich überlappen dürfen.
 *
 * Pfad: /sounds/{key}.mp3 (vorgenerierte Dateien aus public/sounds/)
 */

class SoundPlayer {
  private cache = new Map<string, HTMLAudioElement>();
  private enabled = true;
  private volume = 0.6;

  setEnabled(v: boolean) {
    this.enabled = v;
  }

  isEnabled() {
    return this.enabled;
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
  }

  /**
   * Spielt Sound-Effekt. Mehrere Sounds dürfen sich überlappen — wir
   * klonen das Audio-Element pro Aufruf, damit schnelle Klicks nicht
   * den vorherigen Sound abschneiden.
   */
  play(key: string) {
    if (!this.enabled) return;
    const url = `/sounds/${key}.mp3`;
    let template = this.cache.get(url);
    if (!template) {
      template = new Audio(url);
      template.preload = 'auto';
      this.cache.set(url, template);
    }
    try {
      const instance = template.cloneNode(true) as HTMLAudioElement;
      instance.volume = this.volume;
      instance.play().catch(() => {
        // Browser blockiert Auto-Play vor User-Interaktion → ignorieren
      });
    } catch {
      // ignore
    }
  }

  /** Kurzformen für häufige Sounds */
  buttonTap() { this.play('ui/button-tap'); }
  swoosh() { this.play('ui/swoosh'); }
  coin() { this.play('reward/coin'); }
  star() { this.play('reward/star'); }
  levelUp() { this.play('reward/levelup'); }
  celebrate() { this.play('reward/celebrate'); }
  unlock() { this.play('reward/unlock'); }
  correct() { this.play('feedback/correct'); }
  wrong() { this.play('feedback/wrong'); }
  walk() { this.play('character/walk'); }
  jump() { this.play('character/jump'); }
  portal() { this.play('world/portal-enter'); }
  checkpoint() { this.play('world/checkpoint'); }
}

export const sfx = new SoundPlayer();
