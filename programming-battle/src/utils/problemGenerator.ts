/// <reference types="vite/client" />

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Problem, ProblemDifficulty } from '../types/problem';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log('APIキーの確認:', API_KEY ? 'セットされています' : 'セットされていません');

// APIクライアントの設定
const genAI = new GoogleGenerativeAI(API_KEY);

// プロンプトの生成
const generatePrompt = (difficulty: ProblemDifficulty, category: string) => {
  let categoryPrompt = '';
  
  switch (category) {
    case 'フロントエンドとバックエンドの基本':
      categoryPrompt = `
HTML、CSS、JavaScriptを使用したフロントエンドとバックエンド開発に関する問題を生成してください。
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
2. タイトルは10単語以内、問題文は3-4文で簡潔に書いてください
3. 選択肢は4つ用意し、それぞれ1-2文の簡潔な表現にしてください
4. 説明は最も重要なポイントのみを記述してください

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

// テキストのクリーニング処理
const cleanText = (text: string): string => {
  try {
    // マークダウンのJSON部分を抽出
    const jsonContent = text
      .replace(/^```json\n/, '')
      .replace(/\n```$/, '');

    // オブジェクトを構築
    const jsonObject = {
      title: '',
      description: '',
      choices: [] as Array<{
        id: string;
        text: string;
        isCorrect: boolean;
      }>,
      explanation: '',
      category: '',
      points: 0
    };

    // タイトルと説明の抽出
    const titleMatch = jsonContent.match(/"title":\s*"([^"]+)"/);
    if (titleMatch) jsonObject.title = titleMatch[1];

    const descriptionMatch = jsonContent.match(/"description":\s*"([^"]+)"/);
    if (descriptionMatch) jsonObject.description = descriptionMatch[1];

    // 選択肢の抽出を改善
    const choicesSection = jsonContent.match(/"choices":\s*\[([\s\S]*?)\]/);
    if (choicesSection) {
      const choicesText = choicesSection[1];
      // 各選択肢を個別に抽出
      const choiceMatches = [...choicesText.matchAll(/{([^{}]*(?:{[^{}]*}[^{}]*)*)}/g)];
      
      jsonObject.choices = choiceMatches.map(match => {
        const choiceContent = match[1];
        
        // IDの抽出
        const idMatch = choiceContent.match(/"id":\s*"(\d+)"/);
        const id = idMatch ? idMatch[1] : '';

        // テキストの抽出（コードブロックを含む）
        const textMatch = choiceContent.match(/"text":\s*"((?:\\.|[^"\\])*?)"/);
        let text = textMatch ? textMatch[1] : '';
        
        // コードブロックの処理
        text = text
          .replace(/\\n/g, '\n')  // エスケープされた改行を実際の改行に
          .replace(/\\\\/g, '\\')  // エスケープされたバックスラッシュを1つに
          .replace(/\\"/g, '"');   // エスケープされた引用符を通常の引用符に

        // 正解フラグの抽出
        const isCorrect = choiceContent.includes('"isCorrect": true');

        return { id, text, isCorrect };
      });
    }

    // 説明とカテゴリ、ポイントの抽出
    const explanationMatch = jsonContent.match(/"explanation":\s*"([^"]+)"/);
    if (explanationMatch) jsonObject.explanation = explanationMatch[1];

    const categoryMatch = jsonContent.match(/"category":\s*"([^"]+)"/);
    if (categoryMatch) jsonObject.category = categoryMatch[1];

    const pointsMatch = jsonContent.match(/"points":\s*(\d+)/);
    if (pointsMatch) jsonObject.points = parseInt(pointsMatch[1], 10);

    // 結果を文字列化
    const result = JSON.stringify(jsonObject);
    console.log('クリーニング成功:', result);
    return result;

  } catch (error) {
    console.error('クリーニング処理でエラー:', error);
    console.error('処理対象のテキスト:', text);
    throw new Error('JSONの解析に失敗しました');
  }
};

// 問題の生成
export const generateProblem = async (
  difficulty: ProblemDifficulty,
  category: string
): Promise<Problem> => {
  try {
    // APIキーの確認
    if (!API_KEY) {
      throw new Error('APIキーが設定されていません');
    }

    // モデルの取得とプロンプト生成
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = generatePrompt(difficulty, category || 'プログラミング基礎');
    console.log('Gemini APIを使用して問題を生成中...');
    console.log('送信するプロンプト:', prompt);
    
    // APIリクエストの実行
    const chat = model.startChat();
    const result = await chat.sendMessage(prompt);
    
    if (!result.response) {
      throw new Error('APIからの応答が空です');
    }

    // レスポンスの処理
    const responseText = result.response.text();
    console.log('生成されたレスポンス:', responseText);
    const cleanedText = cleanText(responseText);
    const generatedData = JSON.parse(cleanedText);

    // 問題データの作成
    const problem: Problem = {
      id: `generated-${Date.now()}`,
      title: generatedData.title || '',
      description: (generatedData.description || '').trim(),
      choices: Array.isArray(generatedData.choices) 
        ? generatedData.choices.map((choice: any, index: number) => ({
            id: choice.id || (index + 1).toString(),
            text: (choice.text || '').trim(),
            isCorrect: Boolean(choice.isCorrect)
          }))
        : [],
      explanation: (generatedData.explanation || '').trim(),
      difficulty: difficulty,
      category: generatedData.category || category || 'プログラミング基礎',
      points: Number(generatedData.points) || 
        (difficulty === 'easy' ? 20 : difficulty === 'medium' ? 30 : 40)
    };

    // バリデーション
    if (!problem.title || !problem.description || !problem.choices || 
        !problem.explanation || !problem.difficulty || 
        !Array.isArray(problem.choices) || problem.choices.length !== 4) {
      throw new Error('生成された問題が不完全です');
    }

    return problem;

  } catch (error) {
    console.warn('問題生成に失敗しました:', error);
    
    // Problem型に厳密に従ったフォールバックオブジェクト
    const fallbackProblem: Problem = {
      id: `fallback_${Date.now()}`,
      title: '基本的なプログラミング問題', // questionではなくtitle
      description: '以下のコードの空欄に入る適切な記述を選んでください', // codeではなくdescription
      choices: [
        { id: 'a', text: '選択肢A', isCorrect: true },
        { id: 'b', text: '選択肢B', isCorrect: false },
        { id: 'c', text: '選択肢C', isCorrect: false },
        { id: 'd', text: '選択肢D', isCorrect: false }
      ],
      difficulty: difficulty,
      explanation: '基本的な説明です',
      category: category || 'プログラミング基礎', // categoryを追加
      points: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30
    };
    
    return fallbackProblem;
  }
}; 