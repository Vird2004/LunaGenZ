export interface UserProfile {
  name: string;
  gender: string;
  dob: string;
  email?: string;
}

export interface NumerologyReading {
  calculatedNumbers: {
    lifePath: number;
    soul: number;
    personality: number;
    destiny: number;
    balance: number;
    attitude: number;
    naturalAbility: number;
    approachMotivation: number;
    approachAbility: number;
    karmicDebt: number;
    outerPersonality: number;
    maturity: number;
    personalMonth: number;
  };
  birthChart: Record<number, number>;
  nameChart?: Record<number, number>;
  pinnacles?: { age: number; year: number; value: number }[];
  yearlyCycle?: { year: number; value: number }[];
  aiReading?: any;
  pdfUrl?: string;
  readings?: {
    overview: string;
    charts: string;
    pinnacles: string;
    yearly: string;
  };
}

export interface LenormandCard {
  id: number;
  name: string;
  meaning: {
    love: string;
    career: string;
    daily: string;
  };
}
