# Lernapp – Style Guide

**Letztes Update:** 2026-05-08
**Designprinzip:** Mario-meets-Roblox-meets-Minecraft. Pixel-Retro mit weichen Pastell-Akzenten,
chunky Buttons mit harten Schatten, klare Hierarchie für 6-Jährige.

> **Alle Bildelemente sind Pixel-Grafiken.** Keine Emojis im Produkt.
> UI-Icons → `<PixelIcon>`. Bedienelemente → `<PixelButton>`.

---

## 1. Farb-Palette

### Hintergrund
| Token | Hex | Einsatz |
|---|---|---|
| `bg-deep` | `#0a0e27` | Haupt-Hintergrund |
| `bg-mid` | `#1a1d3a` | Sekundär-Flächen |
| `bg-card` | `#23264a` | Karten / Modals |
| `bg-overlay` | `rgba(5,7,20,0.85)` | Overlay über Spiel |

### Marken-Farben (Primary)
| Token | Hex | Einsatz |
|---|---|---|
| `primary` | `#6366f1` | Haupt-CTAs, aktive Tabs |
| `primary-bright` | `#818cf8` | Hover-States |
| `primary-deep` | `#312e81` | Pressed / Schatten |

### Akzentfarben
| Token | Hex | Bedeutung |
|---|---|---|
| `accent-coin` | `#fbbf24` | Münzen |
| `accent-star` | `#facc15` | Sterne |
| `accent-success` | `#10b981` | Richtige Antwort, Erfolg |
| `accent-danger` | `#ef4444` | Falsche Antwort, Löschen |
| `accent-warn` | `#f97316` | Hinweise, gesperrte Items |
| `accent-magic` | `#a855f7` | Spezial-Belohnungen |

### Pixel-Tinten (Borders & Schatten)
| Token | Hex | Einsatz |
|---|---|---|
| `ink` | `#0a0a14` | Pixel-Border, Outline |
| `ink-soft` | `#1e1b4b` | Sekundäre Borders |
| `highlight` | `rgba(255,255,255,0.25)` | Top-Highlight in Buttons |

### Charakter-Farben
Siehe `src/engine/avatar/character.ts` (Skin/Hair/Outfit-Tokens).

---

## 2. Typografie

| Klasse | Font | Größe | Einsatz |
|---|---|---|---|
| `font-pixel` | **Press Start 2P** | 12px – 32px | Headlines im Spiel ("FRISUR", "LEVEL UP!") |
| `font-display` | **Fredoka** | 24px – 64px | Standard-Überschriften (Profile, Welt-Karte) |
| `font-body` | **Baloo 2** (Weight 600/700/800) | 18px – 36px | Lese-Texte, Aufgabentexte, Eingabefelder |

Standard-Body-Weight: **600**. Niemals leichter als 500 (zu dünn für Kinder-Lese-Klarheit).

**Regel:**
- "Press Start 2P" ist als Pixelschrift schwer lesbar — **NIE für Aufgaben oder Eltern-Texte** verwenden.
- Aufgabenfragen ("Wie viel ist 7+5?") immer in `font-body` (Nunito), damit Kind sie flüssig lesen kann.
- Headlines / Titel / Buttons in `font-pixel` (klein) oder `font-display` (groß und freundlich).

---

## 3. Pixel-Buttons (`<PixelButton>`)

Chunky Retro-Buttons mit harter 3D-Schatten-Optik. Inspiriert vom NES/SNES-Look.

### Anatomie
```
┌─ [4px ink border] ───────────────────┐
│ ┌─ [light highlight inset top 2px] ─┐│
│ │   FÜLLFARBE                       ││
│ │   PIXEL-LABEL (Press Start 2P)    ││
│ └───────────────────────────────────┘│
└──────────────────────────────────────┘
↓ 6px ink shadow (creates 3D bottom)
```

### Varianten
| Variant | Farbe | Einsatz |
|---|---|---|
| `primary` | indigo | Haupt-CTAs ("Weiter", "Spielen") |
| `success` | green | Bestätigung, "Speichern" |
| `danger` | red | Löschen, "Verlassen" |
| `coin` | gold | Shop, Münzen-Aktionen |
| `ghost` | transparent | Sekundäre Aktionen ("Abbrechen") |

### Größen
- `lg`: 64px hoch, 18px Pixel-Schrift, für Bildschirm-Bottom-CTAs
- `md`: 48px hoch, 14px Pixel-Schrift, Standard
- `sm`: 32px hoch, 10px Pixel-Schrift, dichte Listen
- `icon`: 56x56 quadratisch, nur Icon

### Interaktion
- Default: voller Schatten unten
- Hover: helles Tile + Schatten unten (kein Bewegungsunterschied)
- Active/Pressed: Button bewegt sich 4px nach unten, Schatten verschwindet → "gedrückt"-Gefühl
- Disabled: 40% Opacity, kein Schatten

---

## 4. Pixel-Icons (`<PixelIcon name="..." />`)

Alle Icons sind SVG mit `<rect>`-Elementen, `shapeRendering="crispEdges"` für scharfe Pixel-Kanten.
Standardgröße: 24×24 Logical-Pixel (Viewbox), skalierbar via `size`-Prop.

### Verfügbare Icons
| Name | Bedeutung |
|---|---|
| `speaker` / `speaker-off` | Audio an/aus |
| `lock` / `unlock` | Gesperrt / Freigeschaltet |
| `star` / `star-empty` | Sterne |
| `coin` | Münze |
| `heart` | Leben |
| `plus` / `minus` / `equals` | Math-Operatoren |
| `arrow-left` / `arrow-right` / `arrow-up` / `arrow-down` | Navigation |
| `swap` | Profil wechseln |
| `gear` | Einstellungen |
| `check` / `cross` | Richtig / Falsch |
| `apple` | Math-Inhalt |
| `dragon` | Onboarding |
| `trophy` | Erfolg |
| `shirt` / `pants` / `hair` | Slot-Symbole im Editor |

### Farben
- `tone="default"`: Bunt (für Game-Content wie Apfel, Münze)
- `tone="ink"`: monochrom dunkel (für Buttons mit hellem BG)
- `tone="white"`: weiß (für dunkle Buttons)

---

## 5. Layout-Spacing

Tailwind-Standard verwenden. Spacing-Skala:
- `space-1` = 4px
- `space-2` = 8px
- `space-3` = 12px
- `space-4` = 16px
- `space-6` = 24px
- `space-8` = 32px
- `space-12` = 48px
- `space-16` = 64px

**Mindest-Tap-Größe:** 56×56px für alle Touch-Elemente (Apple HIG für Kinder).

---

## 6. Border-Radius

| Token | Wert | Einsatz |
|---|---|---|
| `rounded-pixel` | 0 | Pixel-pure Elemente (Icons in Buttons) |
| `rounded-chunk` | 6px | Pixel-Buttons, Karten |
| `rounded-soft` | 12px | Eingabefelder, Modals |
| `rounded-full` | 9999px | Avatar-Kreise (selten) |

---

## 7. Animationen

| Animation | Dauer | Einsatz |
|---|---|---|
| `animate-pop` | 300ms | Element erscheint (Welcome, Antwort-Feedback) |
| `animate-bounce-slow` | 2000ms | Idle-Charaktere |
| `animate-wiggle` | 500ms | Falsch-Feedback, kleine Aufmerksamkeit |
| `animate-shake` | 400ms | Fehler-Schütteln |
| `animate-glow` | 1500ms | Belohnungen, neue Items |

---

## 8. Sound (kurz)

- Hintergrundmusik: optional, 8-Bit-Chiptune, vom Eltern-Bereich abschaltbar
- UI-Effekte:
  - Button-Tap: kurzer "blip"
  - Richtig: aufsteigende Note
  - Falsch: kurzer dumpfer Ton (nicht negativ)
  - Münze sammeln: klassischer Coin-Ping
  - Sterne: hell aufsteigend

(Audio-Implementierung folgt — derzeit nur ElevenLabs-Sprachausgabe.)

---

## 9. Bildelemente: NIEMALS Emojis

Wann immer ein Emoji im Code auftaucht (`👕`, `🔊`, `⭐`), ist es ein Bug. Stattdessen:

- Decorative UI → `<PixelIcon name="..." />`
- Charaktere → `<PixelCharacter config={...} />`
- Game-Inhalt (Apfel zum Zählen) → `<PixelIcon name="apple" size={64} />`
- Belohnungen → eigene Pixel-Sprite-Komponenten

Falls ein neues Bild gebraucht wird, das es noch nicht als PixelIcon gibt → **erst** Icon zu `PixelIcon`
hinzufügen, **dann** verwenden. Nicht improvisieren.

---

## 10. Komponenten-Hierarchie

```
src/ui/components/
├─ PixelButton.tsx     # Chunky 3D-Buttons (alle Varianten + Größen)
├─ PixelIcon.tsx       # Icon-Library (alle SVG-Icons)
├─ PixelTitle.tsx      # Pixel-Headlines mit Schatten
├─ PixelCharacter.tsx  # Avatar-Renderer (vorhanden)
├─ AvatarSprite.tsx    # Profil-Wrapper (vorhanden)
├─ PinPad.tsx          # PIN-Eingabe
└─ WelcomeOverlay.tsx  # Begrüßung
```

Neue UI-Komponenten gehören hierher.
