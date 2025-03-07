export interface Skill {
  name: string;
  damage: number;
  problemDifficulty: 'easy' | 'medium' | 'hard';
  requiredLevel: number;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  level: number;
  experience: number;
  maxExperience: number;
  hp: number;
  maxHp: number;
  skills: Skill[];
  unlockedSkills: string[];
}

export const calculateRequiredExperience = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

export const calculateMaxHP = (level: number, baseHP: number): number => {
  return baseHP + Math.floor(baseHP * 0.1 * (level - 1));
}; 