export type StatusEffect = {
  name: string;
  description: string;
  duration: number;
  effect: {
    damageMultiplier?: number;
    healingMultiplier?: number;
    damagePerTurn?: number;
  };
};

export type Item = {
  id: string;
  name: string;
  description: string;
  effect: {
    healing?: number;
    removeStatus?: boolean;
    damageBoost?: number;
    defenseBoost?: number;
  };
  quantity: number;
};

export interface BattleState {
  playerStatus: StatusEffect[];
  enemyStatus: StatusEffect[];
  playerItems: Item[];
  turn: number;
}

export const statusEffects = {
  bug: {
    name: 'バグ',
    description: '攻撃力が低下します',
    duration: 3,
    effect: {
      damageMultiplier: 0.7
    }
  },
  infiniteLoop: {
    name: '無限ループ',
    description: '毎ターンダメージを受けます',
    duration: 3,
    effect: {
      damagePerTurn: 10
    }
  },
  memoryLeak: {
    name: 'メモリリーク',
    description: '回復効果が低下します',
    duration: 2,
    effect: {
      healingMultiplier: 0.5
    }
  }
};

export const items = {
  debugger: {
    id: 'debugger',
    name: 'デバッガー',
    description: '状態異常を回復します',
    effect: {
      removeStatus: true
    },
    quantity: 2
  },
  energyDrink: {
    id: 'energyDrink',
    name: 'エナジードリンク',
    description: 'HPを50回復します',
    effect: {
      healing: 50
    },
    quantity: 3
  },
  codeTuning: {
    id: 'codeTuning',
    name: 'コードチューニング',
    description: '次の攻撃のダメージが1.5倍になります',
    effect: {
      damageBoost: 1.5
    },
    quantity: 1
  }
}; 