# Lernapp – Projektplan

Lern-Browser-Spiel für Kinder (1. Klasse aufwärts), optimiert für Touch (iPad / Handy).
Erstes Fach: **Mathematik** nach Berliner Rahmenlehrplan. Spätere Fächer: Deutsch, Englisch, Türkisch, Russisch.

---

## 1. Vision in einem Satz

Ein knuffiges, modernes Pixel-Adventure mit anpassbarem Avatar, in dem Kinder spielerisch und didaktisch fundiert
Mathe (und später weitere Fächer) lernen — in ihrer eigenen Sprache, mit gesprochenen Anweisungen, Belohnungen
und individuellem Lernpfad.

## 2. Zielgruppe

- Primär: 6–10 Jahre (Klasse 1–4)
- Erweiterbar nach oben (Bonus-Welten, Knobeln) und nach unten (Vorschule, Mengen)
- Erstanwender: 6 Jahre, Klasse 1 (Sohn des Auftraggebers)

## 3. Didaktische Grundlagen (Mathe)

Basierend auf dem **Berliner Rahmenlehrplan Mathematik (Klassen 1–10)**.

**Leitideen** (= Hauptmodule pro Klassenstufe):
- **L1** Zahlen & Operationen
- **L2** Größen & Messen
- **L3** Raum & Form
- **L4** Gleichungen & Funktionen
- **L5** Daten & Zufall

**Methodik:**
- **EIS-Prinzip nach Bruner** (enaktiv → ikonisch → symbolisch): Aufgaben in mehreren Darstellungsebenen, mit
  flexiblem Wechsel
- **Kraft der 5 und 10**: Strukturierte Visualisierung statt Abzählen
- **Operatives Prinzip**: "Was passiert, wenn …?"-Fragen
- **Spaced Repetition**: Wackelnde Inhalte kommen in 1d / 3d / 7d / 14d wieder
- **Adaptive Schwierigkeit**: 2 Fehler → leichter, 3× Gold → freischalten
- **Self-Determination Theory**: Autonomie + Kompetenzerleben + sofortiges Feedback

## 4. Inhaltliche Struktur

### Mathe – Welt-Roadmap

```
Welt 1 – Klasse 1 (ZR 20, +/–)
  1.1 Zahlen 1–10 (Mengen, Schreiben, Vergleichen)
  1.2 Zahlzerlegung & 5er-/10er-Freunde
  1.3 Plus im ZR 10
  1.4 Minus im ZR 10
  1.5 Zahlen bis 20
  1.6 +/– im ZR 20 ohne Übergang
  1.7 Zehnerübergang (8+5, 13–6)
  1.8 Formen, Längen, Geld bis 20 ct, volle Stunde

Welt 2 – Klasse 2 (ZR 100, Einmaleins)
  2.1 Zahlen bis 100, Zehner/Einer
  2.2 +/– im ZR 100
  2.3 Einmaleins (Kernreihen 2, 5, 10 → 3, 4, 6, 7, 8, 9)
  2.4 Geteilt
  2.5 Uhr (halbe, viertel)
  2.6 Geld in Euro/Cent

Welt 3 – Klasse 3 (ZR 1.000)
  3.1 Zahlen bis 1.000
  3.2 Schriftliches +/–
  3.3 Multiplikation/Division mit Zehnerzahlen
  3.4 Brüche (Halbe, Drittel, Viertel)
  3.5 Geometrie: Umfang, rechte Winkel

Welt 4 – Klasse 4 (ZR 1 Mio.)
  4.1 Große Zahlen, Stellenwerttafel
  4.2 Schriftliche Multiplikation
  4.3 Schriftliche Division
  4.4 Brüche & Dezimalzahlen-Einstieg
  4.5 Geometrie: Flächeninhalt

Bonus-Welten
  B.1 Logik & Knobeln
  B.2 Schach-Mathe (Strategie)
  B.3 Sachaufgaben des Alltags
```

### Spätere Fächer (Architektur muss heute schon Platz lassen)

- **Deutsch** (Buchstaben, Lautieren, Lesen, Rechtschreibung)
- **Englisch** als Fremdsprache
- **Türkisch / Russisch** als Fremdsprache (oder Muttersprach-Modul)

## 5. Mehrsprachigkeit (i18n)

**Default-Sprache:** Deutsch.
**Unterstützte UI-Sprachen ab MVP:** Deutsch, Türkisch, Russisch, Englisch.

- Alle UI-Texte über `react-i18next`
- Alle Audios pro Sprache: `/audio/{lang}/{key}.mp3`
- Sprachauswahl pro Profil (jedes Kind kann eigene Sprache haben)
- Math-Inhalt ist sprach-agnostisch — nur UI/Audio wechselt
- Spätere Sprach-Fach-Module sind sprach-spezifisch und nur in passender Sprache verfügbar

## 6. Spielstil

- **Look:** Modernes Pixel-Art (16-Bit-inspiriert, aber mit weichen Farben und sanften Animationen).
  Mischung aus Mario-Ästhetik (knuffig, klar) und Roblox/Minecraft-Vibes (anpassbar, blockig-modern).
- **Welt-Logik:**
  - Hauptkarte mit Inseln (= Fächer: Mathe-Insel, später Deutsch-Insel, …)
  - Pro Insel mehrere Welten (= Klassenstufen / Themengruppen)
  - Pro Welt mehrere Levels (= Submodule)
  - Levels werden Stück für Stück freigeschaltet
- **Avatar:**
  - Wenige Klicks, viel Emotion: Frisur, Outfit, Ausrüstung
  - Items werden durch Levels & Sterne freigeschaltet
  - Gesperrte Items zeigen Schattensilhouette mit "Erreiche Level X"-Teaser
- **Belohnungen:**
  - Münzen (für Item-Shop)
  - Sterne pro Level (Bronze/Silber/Gold = Tempo + Fehlerquote)
  - Erfolge / Achievements

## 7. Audio (ElevenLabs)

- **Stimme:** "Ella" (Voice-ID in `.env`)
- **Modell:** `eleven_multilingual_v2`
- **Strategie:** Vorgenerierte MP3s, offline im Asset-Ordner
- **Generator:** Node-Skript `scripts/generate-audio.ts`, liest `audio-manifest.json`
- **Struktur:**
  ```
  audio/
    de/
      math/
        intro_world1.mp3
        task_count_1.mp3
        praise_correct_1.mp3
      ui/
        button_play.mp3
    tr/ ...
    ru/ ...
    en/ ...
  ```
- **Aufgaben-Audio:**
  - Aufgabentexte: pro Aufgabe eine Datei (natürlicher Klang)
  - Lobsprüche: 5–10 Varianten zufällig gemischt
  - Cutscenes: pro Welt 1 längere Erklärung am Anfang

## 8. Profile & Login

- **Mehrere Profile** pro Gerät (z. B. Geschwister)
- Beim Start: Profilauswahl als Kachel mit Avatar
- Optional **PIN-Schutz** pro Profil (4-stellig)
- **Eltern-Zone** mit eigenem PIN (separat)
- Speicherung lokal in IndexedDB via Dexie

## 9. Eltern-Dashboard

Über PIN erreichbar. Pro Profil:
- Übungszeit gesamt / heute / Woche
- Sterne pro Welt / Level
- Schwächen-Analyse (welche Aufgabentypen wackeln)
- Settings: Sprache, max. Spielzeit/Tag, Pause-Reminder
- Möglichkeit, Onboarding-Test neu zu starten

## 10. Onboarding-Test

- 5–8 adaptive Aufgaben pro Fach
- Beginnt sehr einfach, steigert sich nur bei Erfolg
- Setzt individuell den Startpunkt pro Leitidee
- Eingebettet als Story ("Der Drache prüft dein Wissen"), kein "Test"-Framing
- Wiederholbar aus Eltern-Dashboard

## 11. Tech-Stack

| Layer | Technologie | Begründung |
|---|---|---|
| Build | Vite | Schnell, modern, gute PWA-Unterstützung |
| Sprache | TypeScript | Typsicherheit, weniger Bugs |
| UI-Framework | React 18 | Komponenten-Wiederverwendung, Eltern-Dashboard |
| Spiel-Engine | Phaser 3 | Beste 2D-Engine für Web, Touch-optimiert |
| Styling | Tailwind CSS | Schnelles Prototyping |
| State | Zustand | Leichtgewichtig |
| Storage | Dexie (IndexedDB) | Offline-fähig, viel Platz |
| i18n | react-i18next | De-facto-Standard |
| PWA | vite-plugin-pwa | Offline + Homescreen-Install |
| Audio-Gen | ElevenLabs SDK + Node | Vorgenerierte Assets |

## 12. Repo-Struktur

```
lernapp/
├── public/                  # Statische Assets, manifest, Icons
├── audio/                   # Generierte Audio-Dateien (im Build mitgepackt)
│   ├── de/
│   ├── tr/
│   ├── ru/
│   └── en/
├── src/
│   ├── engine/              # Wiederverwendbare Spiel-Engine
│   │   ├── audio/
│   │   ├── progress/        # Spaced Repetition, Sterne, Münzen
│   │   ├── profile/
│   │   ├── avatar/
│   │   └── world-map/
│   ├── subjects/            # Fach-Module (Plugins)
│   │   ├── math/
│   │   │   ├── world1/      # Klasse 1
│   │   │   │   ├── 1.1-numbers-1-10/
│   │   │   │   ├── 1.2-decomposition/
│   │   │   │   └── ...
│   │   │   ├── world2/      # Klasse 2 (später)
│   │   │   └── manifest.ts  # Welt-/Level-Definitionen
│   │   └── german/          # Später
│   ├── ui/                  # React-Komponenten (Profilauswahl, Dashboard, Shop)
│   ├── i18n/
│   │   ├── de.json
│   │   ├── tr.json
│   │   ├── ru.json
│   │   └── en.json
│   ├── App.tsx
│   └── main.tsx
├── scripts/
│   └── generate-audio.ts    # ElevenLabs-Generator
├── audio-manifest.json      # Alle zu generierenden Texte pro Sprache
├── .env / .env.example
├── .gitignore
├── package.json
├── vite.config.ts
└── PLAN.md
```

## 13. Roadmap (Bauphasen)

### Phase 1 – Foundation
- Projekt-Setup (Vite, React, TS, Tailwind, Phaser, PWA)
- i18n-Foundation mit allen 4 Sprachen
- Profilauswahl + PIN-Schutz
- Avatar-Customization (Kachel-UI)
- ElevenLabs-Generator-Skript

### Phase 2 – Engine & MVP-Level
- Welt-Karte mit Insel-Konzept
- Spaced-Repetition-Algorithmus
- Onboarding-Diagnose-Test
- **Welt 1.1 (Zahlen 1–10)** als spielbares MVP
- Sterne, Münzen, Belohnungen

### Phase 3 – Klasse 1 komplett
- Welten 1.2 bis 1.8 (alle Submodule Klasse 1)
- Eltern-Dashboard
- Erste Audio-Charge generieren (DE)

### Phase 4 – Skalierung
- Klasse 2 (Einmaleins!)
- Audio in TR / RU / EN
- Bonus-Welten (Logik)

### Phase 5 – Sprachfächer
- Deutsch-Modul (Lesen, Rechtschreibung)
- Architektur-Anpassungen

## 14. Spielzeit / Wohlbefinden

- Default: max. 20 Min am Stück, dann sanfte Pause-Aufforderung
- Kein Zeitdruck-Stress in Aufgaben (kein Countdown)
- Lob bei Fehlern, niemals Bestrafung
- Hintergrundmusik dezent, abschaltbar

## 15. Datenschutz

- Alles lokal auf dem Gerät (IndexedDB)
- Keine Tracking-Skripte
- ElevenLabs-Key bleibt nur in der `.env`, nie im Build
