// カスタムエラー型の定義
export class ProblemGenerationError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'ProblemGenerationError';
  }
}

// エラーハンドリング共通関数
export const handleError = (error: unknown, message: string): never => {
  console.error(message, error);
  throw new ProblemGenerationError(message, error);
}; 