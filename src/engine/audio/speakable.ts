import { ITEM_LABELS_DE, type CountItemKind } from '@ui/components/PixelItem';

/**
 * Voice-Nodes pro Aufgaben-Typ. Liefern jeweils:
 *   .question  – die natürlich formulierte Frage (wird beim Auto-Play und beim Klick auf das Speaker-Icon gesprochen)
 *   .help      – ein hilfreicher Hint, falls das Kind nicht weiterkommt
 *
 * Die Texte beziehen sich auf die tatsächlich gezeigten Items (Äpfel, Hunde, …),
 * sodass Bild und Sprache übereinstimmen.
 */

function plural(item: CountItemKind, n: number): string {
  return n === 1 ? ITEM_LABELS_DE[item].sg : ITEM_LABELS_DE[item].pl;
}

export interface VoiceNodes {
  question: string;
  help: string;
}

export function countNodes(item: CountItemKind, count: number): VoiceNodes {
  const items = plural(item, count);
  return {
    question: `Wie viele ${items} siehst du?`,
    help: `Tippe nacheinander auf jedes Bild und zähle: eins, zwei, drei und so weiter, bis du alle ${items} gezählt hast.`,
  };
}

export function plusNodes(a: number, b: number, itemA: CountItemKind, itemB: CountItemKind): VoiceNodes {
  const ia = plural(itemA, a);
  const ib = plural(itemB, b);
  if (itemA === itemB) {
    return {
      question: `Du hast ${a} ${ia} und bekommst ${b} dazu. Wie viele ${ia} hast du dann?`,
      help: `Beginne bei ${a} und zähle ${b} weiter: ${a} und eins ist ${a + 1}, und so weiter.`,
    };
  }
  return {
    question: `Wie viele Sachen sind ${a} ${ia} und ${b} ${ib} zusammen?`,
    help: `Zähle erst die ${ia}: ${a}. Dann zähle die ${ib} dazu: ${a} und eins, zwei, drei …`,
  };
}

export function minusNodes(a: number, b: number, item: CountItemKind): VoiceNodes {
  const items = plural(item, a);
  return {
    question: `Du hast ${a} ${items}. ${b} ${b === 1 ? 'wird' : 'werden'} weggenommen. Wie viele bleiben?`,
    help: `Beginne bei ${a} und zähle ${b} zurück: ${a} weniger eins ist ${a - 1}, und so weiter.`,
  };
}

export function decompositionNodes(total: number, visible: number): VoiceNodes {
  const missing = total - visible;
  return {
    question: `Du siehst ${visible} Sachen. Wie viele fehlen, damit es ${total} sind?`,
    help: `Zähle weiter ab ${visible}: ${visible} und eins ist ${visible + 1}. Wie oft musst du eins addieren, bis du ${total} erreichst? Das ist ${missing}.`,
  };
}

export function shapeNodes(question: string): VoiceNodes {
  return {
    question,
    help: `Schau dir die Form genau an. Hat sie Ecken? Wie viele? Ist sie rund?`,
  };
}

export function moneyNodes(question: string): VoiceNodes {
  return {
    question,
    help: `Lies auf jeder Münze die Zahl ab und addiere sie zusammen.`,
  };
}

export function clockNodes(question: string): VoiceNodes {
  return {
    question,
    help: `Schau auf den großen Zeiger. Welche Zahl zeigt er an?`,
  };
}
