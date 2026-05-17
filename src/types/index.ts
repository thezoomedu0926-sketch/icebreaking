export interface CardData {
  id: string;
  level: string;
  question: string;
  effect: string;
}

export interface GenerationResult {
  cards: CardData[];
  opening: string;
  closing: string;
  tips: string[];
}

export interface FormData {
  topic: string;
  target: string;
  atmosphere: string;
  count: number;
}
