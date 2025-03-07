export type ProblemDifficulty = 'easy' | 'medium' | 'hard';

export interface Choice {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  choices: Choice[];
  explanation: string;
  category: string;
  points: number;
} 