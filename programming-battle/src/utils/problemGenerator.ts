import { GoogleGenerativeAI } from '@google/generative-ai';
import { Problem } from '../types/problem';

// Gemini APIの初期化
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// APIクライアントの設定
const genAI = new GoogleGenerativeAI(API_KEY);

// プロンプトの生成
const generatePrompt = (difficulty: 'easy' | 'medium' | 'hard', category: string) => {
  let categoryPrompt = '';
  
  switch (category) {
    case 'フロントエンドの基本':
      categoryPrompt = `
HTML、CSS、JavaScriptを使用したフロントエンド開発に関する問題を生成してください。
以下のようなトピックを含めてください：
- DOM操作
- イベントハンドリング
- レスポンシブデザイン
- モダンなJavaScript機能
- Reactの基本概念`;
      break;
    case 'APIの作成方法':
      categoryPrompt = `
APIの設計と実装に関する問題を生成してください。
以下のようなトピックを含めてください：
- RESTful API設計
- HTTPメソッド
- エンドポイント設計
- ステータスコード
- エラーハンドリング`;
      break;
    case 'Firebase FunctionとDB(FireStore)':
      categoryPrompt = `
Firebase CloudFunctionsとFirestoreを使用したバックエンド開発に関する問題を生成してください。
以下のようなトピックを含めてください：
- Firestoreのデータモデリング
- セキュリティルール
- Cloud Functionsのトリガー
- データの読み書き
- リアルタイムアップデート`;
      break;
    default:
      categoryPrompt = 'プログラミング基礎に関する問題を生成してください。';
  }

  return `
${difficulty}レベルの${category}に関する問題を1つ生成してください。
${categoryPrompt}

条件：
1. 問題は実践的で、現実の開発で遭遇する状況を反映させてください
2. 初心者でも理解できる平易な言葉を使用してください
3. 選択肢は4つ用意し、正解は1つだけにしてください
4. 説明は具体例を含めて、わかりやすく記述してください

以下のJSONフォーマットで出力してください：

{
  "title": "問題のタイトル",
  "description": "問題文",
  "choices": [
    {
      "id": "1",
      "text": "選択肢1",
      "isCorrect": true
    },
    {
      "id": "2",
      "text": "選択肢2",
      "isCorrect": false
    },
    {
      "id": "3",
      "text": "選択肢3",
      "isCorrect": false
    },
    {
      "id": "4",
      "text": "選択肢4",
      "isCorrect": false
    }
  ],
  "explanation": "解説文（具体例を含める）",
  "category": "${category}",
  "points": ${difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40}
}`;
};

// 問題の生成
export const generateProblem = async (difficulty: 'easy' | 'medium' | 'hard', category?: string): Promise<Problem> => {
  try {
    console.log('Gemini APIを使用して問題を生成中...');
    
    // モデルの取得
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });
    
    // プロンプトの生成
    const prompt = generatePrompt(difficulty, category || 'プログラミング基礎');
    console.log('送信するプロンプト:', prompt);

    // コンテンツの生成
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('生成されたレスポンス:', text);
    
    // JSONをパース
    const generatedData = JSON.parse(text);
    
    // Problem型に変換
    const problem: Problem = {
      id: `generated-${Date.now()}`,
      title: generatedData.title,
      description: generatedData.description,
      choices: generatedData.choices,
      explanation: generatedData.explanation,
      difficulty: difficulty,
      category: generatedData.category,
      points: generatedData.points
    };
    
    // バリデーション
    if (!problem.title || !problem.description || !problem.choices || 
        !problem.explanation || !problem.difficulty || 
        !Array.isArray(problem.choices) || problem.choices.length !== 4) {
      throw new Error('生成された問題が不完全です');
    }
    
    return problem;
  } catch (error) {
    console.error('問題生成中にエラーが発生しました:', error);
    throw error;
  }
}; 