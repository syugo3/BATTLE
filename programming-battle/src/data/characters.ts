import { Character, Skill } from '../types/character';

const javascriptSkills: Skill[] = [
  {
    name: '基本アルゴリズム',
    damage: 20,
    problemDifficulty: 'easy',
    requiredLevel: 1,
    description: '基本的なプログラミング問題を解いて攻撃'
  },
  {
    name: 'データ構造操作',
    damage: 30,
    problemDifficulty: 'medium',
    requiredLevel: 3,
    description: '配列やオブジェクトを操作して強力な攻撃'
  },
  {
    name: '非同期処理',
    damage: 40,
    problemDifficulty: 'hard',
    requiredLevel: 5,
    description: 'Promiseを使った複雑な攻撃'
  }
];

const pythonSkills: Skill[] = [
  {
    name: 'リスト操作',
    damage: 20,
    problemDifficulty: 'easy',
    requiredLevel: 1,
    description: 'Pythonのリスト操作で攻撃'
  },
  {
    name: 'ジェネレーター',
    damage: 30,
    problemDifficulty: 'medium',
    requiredLevel: 3,
    description: 'ジェネレーターを使った効率的な攻撃'
  },
  {
    name: '再帰処理',
    damage: 40,
    problemDifficulty: 'hard',
    requiredLevel: 5,
    description: '再帰を使った複雑な問題解決攻撃'
  }
];

const rustSkills: Skill[] = [
  {
    name: '所有権システム',
    damage: 20,
    problemDifficulty: 'easy',
    requiredLevel: 1,
    description: '基本的な所有権の概念を使った攻撃'
  },
  {
    name: 'トレイト実装',
    damage: 30,
    problemDifficulty: 'medium',
    requiredLevel: 3,
    description: 'トレイトを使った汎用的な攻撃'
  },
  {
    name: 'unsafe操作',
    damage: 40,
    problemDifficulty: 'hard',
    requiredLevel: 5,
    description: 'unsafeブロックを使った危険な攻撃'
  }
];

export const initialCharacters: Character[] = [
  {
    id: 'javascript',
    name: 'JavaScriptマスター',
    level: 1,
    experience: 0,
    maxExperience: 100,
    hp: 100,
    maxHp: 100,
    skills: javascriptSkills,
    unlockedSkills: ['基本アルゴリズム']
  },
  {
    id: 'python',
    name: 'Pythonista',
    level: 1,
    experience: 0,
    maxExperience: 100,
    hp: 120,
    maxHp: 120,
    skills: pythonSkills,
    unlockedSkills: ['リスト操作']
  },
  {
    id: 'rust',
    name: 'Rustacean',
    level: 1,
    experience: 0,
    maxExperience: 100,
    hp: 150,
    maxHp: 150,
    skills: rustSkills,
    unlockedSkills: ['所有権システム']
  }
]; 