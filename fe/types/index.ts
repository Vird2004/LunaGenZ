export interface UserProfile {
  name: string;
  gender: string;
  dob: string;
}

export interface NumerologyReading {
  lifePathNumber: number;
  missionNumber: number;
  soulNumber: number;
  personalYear: number;
  explanations: {
    lifePath: string;
    mission: string;
    soul: string;
    personalYear: string;
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
