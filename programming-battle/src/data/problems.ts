import { Problem } from '../types/problem';

export const problems: Problem[] = [
  {
    id: 'chatgpt-usage',
    title: 'ChatGPTの活用',
    description: 'ChatGPTを活用してプログラミングを学ぶ際の基本的な考え方として、最も適切なものを選んでください。',
    difficulty: 'easy',
    choices: [
      { id: '1', text: 'ChatGPTは万能なので、自分で考えずにすべてのコードをそのまま使うべき', isCorrect: false },
      { id: '2', text: 'ChatGPTに質問しながら学習を進め、理解を深めることが重要', isCorrect: true },
      { id: '3', text: 'ChatGPTは間違った情報を提供することがあるため、使わない方がよい', isCorrect: false },
      { id: '4', text: 'ChatGPTを使わずにすべてのコードをゼロから自分で書くべき', isCorrect: false }
    ],
    explanation: 'ChatGPTは強力な学習ツールですが、単にコードをコピーするだけでなく、生成されたコードを理解し、必要に応じて修正・改善することで、より深い学習効果が得られます。',
    category: 'フロントエンドの基本',
    points: 20
  },
  {
    id: 'python-features',
    title: 'プログラミング言語',
    description: '以下のうち、Pythonの特徴として適切なものを選んでください。',
    difficulty: 'medium',
    choices: [
      { id: '1', text: '主にウェブサイトの動作を制御するための言語である', isCorrect: false },
      { id: '2', text: '初心者にも学びやすく、データ分析やAI開発など幅広く活用される', isCorrect: true },
      { id: '3', text: '大規模なシステム開発には使用されない', isCorrect: false },
      { id: '4', text: 'プログラミング言語ではなく、エディタの名前である', isCorrect: false }
    ],
    explanation: 'Pythonは読みやすい文法と豊富なライブラリを持ち、初心者に優しい言語です。データサイエンス、AI開発、Web開発など、様々な分野で広く使用されています。',
    category: 'フロントエンドの基本',
    points: 30
  },
  {
    id: 'programming-basics',
    title: 'プログラミングの基本',
    description: 'プログラミングを実行するために必要なものとして、適切なものを選んでください。',
    difficulty: 'hard',
    choices: [
      { id: '1', text: 'インターネット環境があれば、他には何もいらない', isCorrect: false },
      { id: '2', text: 'コードを記述するエディタとプログラムを実行する環境が必要', isCorrect: true },
      { id: '3', text: 'スマートフォンのメモ帳に書けば、そのまま実行できる', isCorrect: false },
      { id: '4', text: 'どの言語でも手書きでプログラムを書けば実行できる', isCorrect: false }
    ],
    explanation: 'プログラミングには、コードを書くためのエディタ（VSCode、Cursorなど）と、そのコードを実行するための環境（Python、Node.jsなど）が必要です。これらの開発環境を適切にセットアップすることが、プログラミングの第一歩となります。',
    category: 'フロントエンドの基本',
    points: 40
  },
  {
    id: 'cursor-editor',
    title: 'Cursorエディタの操作',
    description: 'CursorエディタでPythonファイルを作成する正しい手順として、適切なものを選んでください。',
    difficulty: 'easy',
    choices: [
      { id: '1', text: 'Cursorを開いたら、「新規ファイル」を選び、拡張子を「.py」にして保存する', isCorrect: true },
      { id: '2', text: 'Cursorを開いたら、ファイルを保存せずに直接コードを書いても問題ない', isCorrect: false },
      { id: '3', text: 'Cursorを開いたら、Pythonのコードを書いた後に「Ctrl + P」で実行できる', isCorrect: false },
      { id: '4', text: 'CursorにはPythonのコードを書くことはできない', isCorrect: false }
    ],
    explanation: 'Cursorエディタでは、新規ファイルを作成し、適切な拡張子（.py）を付けて保存することで、シンタックスハイライトやコード補完などの機能が有効になります。',
    category: 'フロントエンドの基本',
    points: 20
  },
  {
    id: 'github-basics',
    title: 'GitHubの基本',
    description: 'GitHubの主な用途として適切なものを選んでください。',
    difficulty: 'medium',
    choices: [
      { id: '1', text: 'プログラムのコードを管理し、複数人での共同開発を容易にする', isCorrect: true },
      { id: '2', text: 'プログラムを実行するためのクラウド環境を提供するサービス', isCorrect: false },
      { id: '3', text: 'プログラミング言語の開発を行うためのツール', isCorrect: false },
      { id: '4', text: 'AIが自動でプログラムを作成してくれるサービス', isCorrect: false }
    ],
    explanation: 'GitHubは、Gitを使用したバージョン管理システムをホスティングするサービスで、コードの共有、バージョン管理、イシュー管理など、チーム開発に必要な機能を提供します。',
    category: 'フロントエンドの基本',
    points: 30
  },
  {
    id: 'workshop-task',
    title: 'ワークショップ課題',
    description: 'ChatGPTを使用してPythonで簡単なToDo管理アプリを作成する際、適切なアプローチを選んでください。',
    difficulty: 'hard',
    choices: [
      { id: '1', text: 'ChatGPTに「ToDoアプリを作って」と指示し、コードをコピーして実行する', isCorrect: false },
      { id: '2', text: 'ChatGPTに指示し、生成されたコードを理解しながら修正・拡張する', isCorrect: true },
      { id: '3', text: 'ChatGPTに頼らず、すべて自分でコードを書く', isCorrect: false },
      { id: '4', text: 'ChatGPTのコードを一部だけ使い、残りはChatGPTに質問せずに作る', isCorrect: false }
    ],
    explanation: 'ChatGPTを効果的に活用するには、単にコードを生成させるだけでなく、生成されたコードの仕組みを理解し、必要に応じて修正や機能追加を行うことが重要です。',
    category: 'フロントエンドの基本',
    points: 40
  },
  {
    id: 'api-basics',
    title: 'APIとは',
    description: 'API（Application Programming Interface）の主な役割はどれでしょうか？',
    difficulty: 'easy',
    category: 'APIの作成方法',
    points: 20,
    choices: [
      {
        id: 'a',
        text: '異なるソフトウェア間でデータや機能を共有する',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'コンピュータのウイルスを除去する',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Webページのデザインを決める',
        isCorrect: false
      },
      {
        id: 'd',
        text: '人間が直接操作するためのインターフェースを提供する',
        isCorrect: false
      }
    ],
    explanation: 'APIは、異なるソフトウェアが通信するためのルールやプロトコルの集合です。例えば、天気アプリが気象データを取得する際にAPIを利用します。'
  },
  {
    id: 'web-api-features',
    title: 'Web APIの特徴',
    description: 'Web APIの主な特徴として正しいものはどれでしょうか？',
    difficulty: 'easy',
    category: 'APIの作成方法',
    points: 20,
    choices: [
      {
        id: 'a',
        text: 'インターネットを介してデータや機能を提供する',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'すべてのAPIはローカル環境でしか動作しない',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'APIはプログラムが直接ユーザーと対話するための仕組みである',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'APIはWebサイトのレイアウトを変更するために使われる',
        isCorrect: false
      }
    ],
    explanation: 'Web APIは、インターネットを介して外部のデータや機能にアクセスする仕組みです。例えば、Google Maps APIを使用すると、Webサイトに地図を埋め込むことができます。'
  },
  {
    id: 'flask-basics',
    title: 'Flask APIの基本',
    description: 'Flaskを使用してAPIを作成する際に最初に必要な作業はどれでしょうか？',
    difficulty: 'medium',
    category: 'APIの作成方法',
    points: 30,
    choices: [
      {
        id: 'a',
        text: 'pip install flask を実行してFlaskをインストールする',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'JavaScriptのコードを記述する',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'APIのURLを取得する',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'HTMLファイルを作成する',
        isCorrect: false
      }
    ],
    explanation: 'FlaskはPythonでWeb APIを作成するための軽量なフレームワークです。使用するには、まず pip install flask でインストールする必要があります。'
  },
  {
    id: 'fastapi-features',
    title: 'FastAPIの特徴',
    description: 'FastAPIの主な特徴として適切なものはどれでしょうか？',
    difficulty: 'medium',
    category: 'APIの作成方法',
    points: 30,
    choices: [
      {
        id: 'a',
        text: '高速なパフォーマンスと自動生成されるドキュメント',
        isCorrect: true
      },
      {
        id: 'b',
        text: 'すべてのリクエストを同期的に処理する',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'Python 2 で動作する',
        isCorrect: false
      },
      {
        id: 'd',
        text: 'フロントエンドの開発専用のフレームワークである',
        isCorrect: false
      }
    ],
    explanation: 'FastAPIは非同期処理をサポートしており、高速なAPIの開発が可能です。また、Swagger UIを使って自動的にAPIのドキュメントを生成する機能も備えています。'
  },
  {
    id: 'http-methods',
    title: 'APIのHTTPメソッド',
    description: 'APIでデータを削除するために使用されるHTTPメソッドはどれでしょうか？',
    difficulty: 'hard',
    category: 'APIの作成方法',
    points: 40,
    choices: [
      {
        id: 'a',
        text: 'GET',
        isCorrect: false
      },
      {
        id: 'b',
        text: 'POST',
        isCorrect: false
      },
      {
        id: 'c',
        text: 'DELETE',
        isCorrect: true
      },
      {
        id: 'd',
        text: 'PUT',
        isCorrect: false
      }
    ],
    explanation: 'DELETEメソッドは、サーバー上のリソースを削除するために使用されます。例えば、DELETE /users/1 のようなリクエストを送ると、IDが1のユーザーを削除できます。'
  },
  {
    id: 'firebase-cli',
    title: 'Firebase CLIのインストール',
    description: 'Firebase CLIをインストールするための正しいコマンドはどれでしょうか？',
    difficulty: 'easy',
    category: 'Firebase FunctionとDB(FireStore)',
    points: 20,
    choices: [
      { id: 'a', text: 'npm install firebase-cli', isCorrect: false },
      { id: 'b', text: 'npm install -g firebase-tools', isCorrect: true },
      { id: 'c', text: 'firebase install cli', isCorrect: false },
      { id: 'd', text: 'install firebase-cli', isCorrect: false }
    ],
    explanation: 'Firebase CLIをインストールするには、npm install -g firebase-tools を実行する必要があります。'
  },
  {
    id: 'firebase-project',
    title: 'Firebaseプロジェクトの作成',
    description: 'Firebaseプロジェクトを作成する最初のステップは何でしょうか？',
    difficulty: 'easy',
    category: 'Firebase FunctionとDB(FireStore)',
    points: 20,
    choices: [
      { id: 'a', text: 'Firebase CLIでfirebase init', isCorrect: false },
      { id: 'b', text: 'Firebaseコンソールでプロジェクトを作成', isCorrect: true },
      { id: 'c', text: 'firebase create project コマンドを実行', isCorrect: false },
      { id: 'd', text: 'Firebase Admin SDKをインストール', isCorrect: false }
    ],
    explanation: 'Firebaseの利用を開始するには、まずFirebaseコンソールにアクセスし、プロジェクトを作成する必要があります。'
  },
  {
    id: 'firebase-functions-trigger',
    title: 'Firebase Functionsのトリガー',
    description: '次のうち、Firebase Functionsのトリガーとして使用できるものはどれでしょうか？',
    difficulty: 'medium',
    category: 'Firebase FunctionとDB(FireStore)',
    points: 30,
    choices: [
      { id: 'a', text: 'HTTPリクエスト', isCorrect: false },
      { id: 'b', text: 'Firestoreのデータ変更', isCorrect: false },
      { id: 'c', text: 'Firebase Authenticationのイベント', isCorrect: false },
      { id: 'd', text: '以上すべて', isCorrect: true }
    ],
    explanation: 'Firebase Functionsは、HTTPリクエスト、Firestoreのデータ変更、Firebase Authenticationイベントなどをトリガーとして使用できます。'
  },
  {
    id: 'firebase-functions-deploy',
    title: 'Firebase Functionsのデプロイ',
    difficulty: 'medium',
    category: 'Firebase FunctionとDB(FireStore)',
    points: 30,
    description: 'Firebase Functionsをデプロイするための正しいコマンドはどれでしょうか？',
    choices: [
      { id: 'a', text: 'firebase upload functions', isCorrect: false },
      { id: 'b', text: 'firebase deploy --only functions', isCorrect: true },
      { id: 'c', text: 'firebase push functions', isCorrect: false },
      { id: 'd', text: 'deploy firebase functions', isCorrect: false }
    ],
    explanation: 'Firebase Functionsをデプロイするには、firebase deploy --only functions を使用します。'
  },
  {
    id: 'firestore-features',
    title: 'Firestoreの特徴',
    difficulty: 'hard',
    category: 'Firebase FunctionとDB(FireStore)',
    points: 40,
    description: 'Firestoreの特徴として正しいものはどれでしょうか？',
    choices: [
      { id: 'a', text: 'NoSQLデータベースである', isCorrect: false },
      { id: 'b', text: 'リアルタイムのデータ同期が可能', isCorrect: false },
      { id: 'c', text: 'ドキュメントとコレクションの構造を持つ', isCorrect: false },
      { id: 'd', text: '以上すべて', isCorrect: true }
    ],
    explanation: 'Firestoreは、NoSQLデータベースであり、リアルタイムのデータ同期が可能で、ドキュメントとコレクションの構造を持ちます。'
  }
]; 