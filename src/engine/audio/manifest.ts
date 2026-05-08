/**
 * Audio-Manifest: Alle zu generierenden Audio-Schnipsel.
 * Schlüssel = Pfad-Komponente, Wert = Text pro Sprache.
 *
 * Generieren: `npm run audio:generate` -> erstellt /audio/{lang}/{key}.mp3
 */

export type AudioManifest = Record<string, Record<'de' | 'en' | 'tr' | 'ru', string>>;

export const audioManifest: AudioManifest = {
  // UI
  'ui/welcome': {
    de: 'Willkommen in der Lernapp!',
    en: 'Welcome to the learning app!',
    tr: 'Öğrenme uygulamasına hoş geldin!',
    ru: 'Добро пожаловать в учебное приложение!',
  },
  'ui/who_plays': {
    de: 'Wer spielt?',
    en: "Who's playing?",
    tr: 'Kim oynuyor?',
    ru: 'Кто играет?',
  },

  // Onboarding
  'onboarding/dragon_intro': {
    de: 'Hallo Abenteurer! Ich bin der Drache und schaue mal, was du schon kannst. Keine Sorge, das ist kein Test, sondern ein Spiel!',
    en: "Hello adventurer! I'm the dragon and I'll see what you can already do. Don't worry, this is not a test, it's a game!",
    tr: 'Merhaba kahraman! Ben ejderhayım, neler bilebildiğine bakacağım. Endişelenme, bu bir test değil, oyun!',
    ru: 'Привет, искатель приключений! Я дракон, и я посмотрю, что ты уже умеешь. Не волнуйся, это не тест, а игра!',
  },
  'onboarding/done': {
    de: 'Super gemacht! Jetzt kann das Abenteuer beginnen.',
    en: 'Great job! Now the adventure begins.',
    tr: 'Harika iş! Şimdi macera başlıyor.',
    ru: 'Молодец! Теперь начинается приключение.',
  },

  // Math – allgemein
  'math/world1_intro': {
    de: 'Willkommen im Zahlenland! Hier lernst du die Zahlen und das Rechnen bis zwanzig.',
    en: 'Welcome to Number Land! Here you learn numbers and math up to twenty.',
    tr: 'Sayılar Diyarına hoş geldin! Burada yirmiye kadar sayıları ve aritmetiği öğreneceksin.',
    ru: 'Добро пожаловать в Страну Чисел! Здесь ты научишься считать до двадцати.',
  },
  'math/level_1_1_intro': {
    de: 'Lass uns die Zahlen von eins bis zehn kennenlernen. Zähle die Äpfel und tippe auf die richtige Zahl!',
    en: 'Let’s get to know the numbers from one to ten. Count the apples and tap the right number!',
    tr: 'Birden ona kadar sayıları öğrenelim. Elmaları say ve doğru sayıya dokun!',
    ru: 'Давай познакомимся с числами от одного до десяти. Посчитай яблоки и нажми на правильное число!',
  },

  // Lobsprüche (5 Varianten)
  'praise/1': { de: 'Super!', en: 'Super!', tr: 'Süper!', ru: 'Супер!' },
  'praise/2': { de: 'Toll gemacht!', en: 'Well done!', tr: 'Aferin!', ru: 'Отлично!' },
  'praise/3': { de: 'Genau richtig!', en: 'Exactly right!', tr: 'Tam isabet!', ru: 'В точку!' },
  'praise/4': { de: 'Du bist klasse!', en: 'You rock!', tr: 'Harikasın!', ru: 'Ты молодец!' },
  'praise/5': { de: 'Weiter so!', en: 'Keep it up!', tr: 'Böyle devam!', ru: 'Так держать!' },

  // Ermutigung bei Fehler
  'encourage/1': {
    de: 'Probier es nochmal, du schaffst das!',
    en: 'Try again, you can do it!',
    tr: 'Tekrar dene, başaracaksın!',
    ru: 'Попробуй ещё, у тебя получится!',
  },
  'encourage/2': {
    de: 'Kein Problem, jeder lernt anders schnell.',
    en: 'No problem, everyone learns at their own pace.',
    tr: 'Sorun yok, herkes kendi hızında öğrenir.',
    ru: 'Ничего страшного, каждый учится в своём темпе.',
  },

  // Zahlen 1–10 vorlesen
  ...Object.fromEntries(
    [
      ['1', { de: 'Eins', en: 'One', tr: 'Bir', ru: 'Один' }],
      ['2', { de: 'Zwei', en: 'Two', tr: 'İki', ru: 'Два' }],
      ['3', { de: 'Drei', en: 'Three', tr: 'Üç', ru: 'Три' }],
      ['4', { de: 'Vier', en: 'Four', tr: 'Dört', ru: 'Четыре' }],
      ['5', { de: 'Fünf', en: 'Five', tr: 'Beş', ru: 'Пять' }],
      ['6', { de: 'Sechs', en: 'Six', tr: 'Altı', ru: 'Шесть' }],
      ['7', { de: 'Sieben', en: 'Seven', tr: 'Yedi', ru: 'Семь' }],
      ['8', { de: 'Acht', en: 'Eight', tr: 'Sekiz', ru: 'Восемь' }],
      ['9', { de: 'Neun', en: 'Nine', tr: 'Dokuz', ru: 'Девять' }],
      ['10', { de: 'Zehn', en: 'Ten', tr: 'On', ru: 'Десять' }],
    ].map(([n, langs]) => [`numbers/${n}`, langs as Record<'de' | 'en' | 'tr' | 'ru', string>]),
  ),
};

export function getRandomPraiseKey(): string {
  const variants = ['praise/1', 'praise/2', 'praise/3', 'praise/4', 'praise/5'];
  return variants[Math.floor(Math.random() * variants.length)];
}

export function getRandomEncourageKey(): string {
  const variants = ['encourage/1', 'encourage/2'];
  return variants[Math.floor(Math.random() * variants.length)];
}
