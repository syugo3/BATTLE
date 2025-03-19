import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, VStack, Text, Button, Progress, Heading, Badge, HStack, Image } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import type { Problem, ProblemDifficulty } from '../types/problem';
import { generateProblem } from '../utils/problemGenerator';
import CodeEditor from './CodeEditor';
import CameraCapture from './CameraCapture';
import SimpleCamera from './SimpleCamera';

const popIn = keyframes`
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.2); opacity: 0.8; }
  80% { transform: scale(0.9); opacity: 0.9; }
  100% { transform: scale(1); opacity: 1; }
`;

const shine = keyframes`
  0% { filter: brightness(1); transform: rotate(-3deg); }
  50% { filter: brightness(1.2); transform: rotate(3deg); }
  100% { filter: brightness(1); transform: rotate(-3deg); }
`;

const damageShake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
`;

const correctAnswer = keyframes`
  0% { background-color: transparent; }
  30% { background-color: rgba(72, 187, 120, 0.3); }
  100% { background-color: transparent; }
`;

const wrongAnswer = keyframes`
  0% { background-color: transparent; }
  30% { background-color: rgba(245, 101, 101, 0.3); }
  100% { background-color: transparent; }
`;

// 追加アニメーション
const zoomPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const glowEffect = keyframes`
  0% { box-shadow: 0 0 5px rgba(0,0,0,0.2); }
  50% { box-shadow: 0 0 20px rgba(66,153,225,0.6); }
  100% { box-shadow: 0 0 5px rgba(0,0,0,0.2); }
`;

// バトル開始アニメーション
const battleStartAnimation = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
`;

interface BattleFieldProps {
  playerCharacter: string;
  playerName: string;
  initialPlayerPhoto: string;
  initialDifficulty: 'easy' | 'medium' | 'hard';
  onVictory: () => void;
  onDefeat: () => void;
}

interface Character {
  name: string;
  hp: number;
  maxHp: number;
  skills: Array<{
    name: string;
    damage: number;
    problemDifficulty: 'easy' | 'medium' | 'hard';
  }>;
}

const LoadingProblem = () => (
  <Box 
    width="100%" 
    bg="white" 
    p={6} 
    borderRadius="md"
    textAlign="center"
  >
    <VStack spacing={4}>
      <Heading size="md" color="blue.600">問題を準備しています...</Heading>
      <Progress 
        size="md" 
        isIndeterminate 
        colorScheme="blue" 
        width="80%" 
        borderRadius="full" 
      />
      <Text color="gray.600">AIが次の問題を生成中です。少々お待ちください。</Text>
    </VStack>
  </Box>
);

// バックグラウンドエフェクトコンポーネント
const BackgroundEffects = () => (
  <>
    {/* 装飾的な背景要素 */}
    <Box
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      overflow="hidden"
      zIndex="0"
      pointerEvents="none"
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <Box
          key={i}
          position="absolute"
          top={`${Math.random() * 100}%`}
          left={`${Math.random() * 100}%`}
          width={`${Math.random() * 20 + 5}px`}
          height={`${Math.random() * 20 + 5}px`}
          bg={i % 2 === 0 ? "blue.100" : "purple.100"}
          borderRadius="full"
          opacity={Math.random() * 0.5 + 0.1}
          animation={`${floatAnimation} ${Math.random() * 10 + 10}s linear infinite`}
        />
      ))}
    </Box>
  </>
);

// 難易度に応じた敵の画像を返す関数
const getEnemyImage = (difficulty: ProblemDifficulty): string => {
  switch (difficulty) {
    case 'easy':
      return './enemy-easy.png'; // ./を追加（相対パス）
    case 'medium':
      return './enemy-medium.png'; // または正確なファイル名に修正
    case 'hard':
      return './enemy-hard.png';
    default:
      return './enemy-easy.png';
  }
};

const BattleField: React.FC<BattleFieldProps> = ({
  playerCharacter,
  playerName,
  initialPlayerPhoto,
  initialDifficulty,
  onVictory,
  onDefeat
}) => {
  const getCharacterInitialHP = (characterId: string): number => {
    // デバッグ用
    console.log("キャラクターHP初期化:", characterId);
    
    switch (characterId) {
      case 'javascript':
        return 100; // ここが呼ばれていることを確認
      case 'python':
        return 120;
      case 'rust':
        return 150;
      default:
        return 100;
    }
  };

  const getCharacterCategory = (characterId: string): string => {
    switch (characterId) {
      case 'javascript':
        return 'フロントエンドの基本';
      case 'python':
        return 'APIの作成方法';
      case 'rust':
        return 'Firebase FunctionとDB(FireStore)';
      default:
        return 'フロントエンドの基本';
    }
  };

  // キャラクターに基づいてスキルを設定
  const getCharacterSkills = (characterId: string): Array<{
    name: string;
    damage: number;
    problemDifficulty: 'easy' | 'medium' | 'hard';
  }> => {
    switch (characterId) {
      case 'javascript':
        return [
          { name: 'フロントエンドの基本', damage: 20, problemDifficulty: 'easy' as const },
          { name: '基礎から応用まで幅広く学べる', damage: 30, problemDifficulty: 'medium' as const },
        ];
      case 'python':
        return [
          { name: 'シンプルで強力な技を使用', damage: 25, problemDifficulty: 'easy' as const },
          { name: 'インデント斬り', damage: 35, problemDifficulty: 'medium' as const },
          { name: 'ジェネレーター連打', damage: 40, problemDifficulty: 'hard' as const },
          { name: 'リスト内包', damage: 45, problemDifficulty: 'hard' as const },
        ];
      case 'rust':
        return [
          { name: '堅牢な防御力が特徴', damage: 30, problemDifficulty: 'easy' as const },
          { name: '所有権移転', damage: 35, problemDifficulty: 'medium' as const },
          { name: 'ライフタイム制御', damage: 40, problemDifficulty: 'hard' as const },
          { name: 'unsafe破壊', damage: 45, problemDifficulty: 'hard' as const },
        ];
      default:
        return [
          { name: 'フロントエンドの基本', damage: 20, problemDifficulty: 'easy' as const },
          { name: '基礎から応用まで幅広く学べる', damage: 30, problemDifficulty: 'medium' as const },
        ];
    }
  };

  const calculateEnemyHP = () => {
    // 各難易度で5問ずつ、合計15問を想定
    return 150;
  };

  const initialPlayerHP = getCharacterInitialHP(playerCharacter);
  const initialEnemyHP = calculateEnemyHP();

  const [playerHP, setPlayerHP] = useState(initialPlayerHP);
  const [enemyHP, setEnemyHP] = useState(initialEnemyHP);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const [isGameCleared, setIsGameCleared] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerDamaged, setPlayerDamaged] = useState(false);
  const [enemyDamaged, setEnemyDamaged] = useState(false);
  const [currentDifficulty, setCurrentDifficulty] = useState<ProblemDifficulty>(initialDifficulty);
  const [nextProblem, setNextProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCorrectAnimation, setShowCorrectAnimation] = useState(false);
  const [showWrongAnimation, setShowWrongAnimation] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState({
    easy: 0,
    medium: 0,
    hard: 0
  });
  const [showBattleStartAnimation, setShowBattleStartAnimation] = useState(false);
  const [playerPhoto, setPlayerPhoto] = useState<string>(initialPlayerPhoto || '/warrior-character.png');
  const [showImageSelector, setShowImageSelector] = useState(false);  // 画像選択表示状態
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);

  // 位置を追跡するためのrefを追加
  const playerIconRef = useRef<HTMLDivElement>(null);
  const enemyIconRef = useRef<HTMLDivElement>(null);
  const [fireballPosition, setFireballPosition] = useState({ start: { left: 0, top: 0 }, end: { left: 0, top: 0 } });
  
  // ファイヤーボール発射時に位置を計算
  const calculateFireballPosition = () => {
    if (playerIconRef.current && enemyIconRef.current) {
      const playerRect = playerIconRef.current.getBoundingClientRect();
      const enemyRect = enemyIconRef.current.getBoundingClientRect();
      
      setFireballPosition({
        start: {
          left: playerRect.right,
          top: playerRect.top + playerRect.height / 2
        },
        end: {
          left: enemyRect.left,
          top: enemyRect.top + enemyRect.height / 2
        }
      });
    }
  };

  const enemy: Character = {
    name: 'チャレンジャー',
    hp: enemyHP,
    maxHp: initialEnemyHP,
    skills: []
  };

  const player: Character = {
    name: playerName,
    hp: playerHP,
    maxHp: initialPlayerHP,
    skills: getCharacterSkills(playerCharacter),
  };

  // componentDidMount時にHPが正しいか確認
  useEffect(() => {
    // 初期HPを確実に設定
    setPlayerHP(initialPlayerHP);
    setEnemyHP(initialEnemyHP);
  }, [initialPlayerHP, initialEnemyHP]);
  
  // 戦闘開始時にHPをリセット
  const handleStartBattle = async () => {
    // HPを確実にリセット
    setPlayerHP(initialPlayerHP);
    setEnemyHP(initialEnemyHP);
    
    // 戦闘開始演出
    setShowBattleStartAnimation(true);
    
    // 2秒後に戦闘開始
    setTimeout(() => {
      setShowBattleStartAnimation(false);
      setIsBattleStarted(true);
      handleNextProblem();
    }, 2000);
  };

  const handleCodeSubmit = async (selectedChoiceId: string) => {
    if (!currentProblem) return;
    if (answerSubmitted) return;

    setAnswerSubmitted(true);
    
    const selectedChoice = currentProblem.choices.find(c => c.id === selectedChoiceId);
    if (!selectedChoice) return;

    if (selectedChoice.isCorrect) {
      setShowCorrectAnimation(true);
      setIsCorrectAnswer(true);
      setTimeout(() => setShowCorrectAnimation(false), 1500);
    } else {
      setShowWrongAnimation(true);
      setIsCorrectAnswer(false);
      setTimeout(() => setShowWrongAnimation(false), 1500);
    }
  };

  const prefetchNextProblem = async () => {
    try {
      const category = getCharacterCategory(playerCharacter);
      
      // リトライ処理
      let attempts = 0;
      let generatedProblem = null;
      
      while (attempts < 3 && !generatedProblem) {
        try {
          generatedProblem = await generateProblem(currentDifficulty, category);
          attempts++;
        } catch (err) {
          console.warn(`次の問題事前生成の試行 ${attempts}/3 が失敗しました:`, err);
          // 少し待機して再試行
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (generatedProblem) {
        setNextProblem(generatedProblem);
      }
    } catch (error) {
      console.error('次の問題の事前生成に失敗しました:', error);
      // ここではエラーメッセージを表示しない（事前ロードなので）
    }
  };

  useEffect(() => {
    if (currentProblem) {
      prefetchNextProblem();
    }
  }, [currentProblem, currentDifficulty]);

  const handleNextProblem = async () => {
    if (isCorrectAnswer) {
      // 正解時はすぐに敵にダメージを与える
      const damage = currentProblem!.points;
      const newEnemyHP = Math.max(0, enemyHP - damage);
      setEnemyHP(newEnemyHP);
      setEnemyDamaged(true);
      
      if (newEnemyHP <= 0) {
        setIsGameCleared(true);
        onVictory();
        return;
      }

      // 解決済み問題をカウントアップ
      setSolvedProblems(prev => ({
        ...prev,
        [currentDifficulty]: prev[currentDifficulty] + 1
      }));
      
      // ダメージ表示後、次の問題へ
      setTimeout(() => {
        loadNextProblem();
      }, 800);
    } else {
      // 不正解時はすぐにプレイヤーにダメージを与える
      const damage = 5;
      const newPlayerHP = Math.max(0, playerHP - damage);
      setPlayerHP(newPlayerHP);
      setPlayerDamaged(true);
      
      if (newPlayerHP <= 0) {
        setIsGameOver(true);
        onDefeat();
        return;
      }
      
      // ダメージ表示後、次の問題へ
      setTimeout(() => {
        loadNextProblem();
      }, 800);
    }
  };

  // 次の問題を読み込む処理を分離
  const loadNextProblem = async () => {
    setAnswerSubmitted(false);
    // プレイヤーダメージ状態をリセット
    setPlayerDamaged(false);
    setEnemyDamaged(false);
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (nextProblem) {
        // 事前ロードされた問題がある場合はそれを使用
        setCurrentProblem(nextProblem);
        setNextProblem(null);
        prefetchNextProblem(); // 次の問題を事前ロード
      } else {
        const category = getCharacterCategory(playerCharacter);
        console.log(`問題を生成: 難易度=${currentDifficulty}, カテゴリ=${category}`); // デバッグ用
        
        // 問題生成（リトライロジック付き）
        let attempts = 0;
        let generatedProblem = null;
        
        while (attempts < 3 && !generatedProblem) {
          try {
            generatedProblem = await generateProblem(currentDifficulty, category);
            attempts++;
          } catch (err) {
            console.warn(`問題生成の試行 ${attempts}/3 が失敗:`, err);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 少し待機
          }
        }
        
        if (generatedProblem) {
          console.log('問題生成成功:', generatedProblem.difficulty); // デバッグ用
          setCurrentProblem(generatedProblem);
        } else {
          setError('問題の生成に失敗しました。再試行してください。');
        }
      }
    } catch (error) {
      console.error('問題生成中にエラーが発生しました:', error);
      setError('問題の読み込みに失敗しました。再試行してください。');
    } finally {
      setIsLoading(false);
    }
  };

  // retry時のHP修正
  const handleRetry = (continueFromCheckpoint: boolean) => {
    if (continueFromCheckpoint) {
      // 現在の敵から再開時はプレイヤーのHPを完全回復
      setPlayerHP(initialPlayerHP);
      setIsGameOver(false);
    } else {
      // 最初からやり直す場合は両方のHPをリセット
      setPlayerHP(initialPlayerHP);
      setEnemyHP(initialEnemyHP);
      setCurrentProblem(null);
      setIsGameOver(false);
      setIsBattleStarted(false);
    }
  };

  // ダメージアニメーションをリセット
  useEffect(() => {
    if (playerDamaged) {
      const timer = setTimeout(() => setPlayerDamaged(false), 500);
      return () => clearTimeout(timer);
    }
  }, [playerDamaged]);

  useEffect(() => {
    if (enemyDamaged) {
      const timer = setTimeout(() => setEnemyDamaged(false), 500);
      return () => clearTimeout(timer);
    }
  }, [enemyDamaged]);

  // 写真選択ハンドラー
  const handlePhotoCapture = (photoUrl: string) => {
    setPlayerPhoto(photoUrl);
    setShowImageSelector(false);  // 選択後は非表示
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      bg="gray.100"
      overflow="auto"
      p={4}
    >
      {/* 背景エフェクトを追加 */}
      <BackgroundEffects />

      {error && (
        <Box 
          position="fixed" 
          top="4" 
          left="50%" 
          transform="translateX(-50%)" 
          zIndex="toast"
          bg="red.500"
          color="white"
          px="4"
          py="3"
          borderRadius="md"
          boxShadow="lg"
          maxW="90%"
          textAlign="center"
        >
          <Text fontWeight="bold">{error}</Text>
          <Button 
            size="sm" 
            variant="outline" 
            colorScheme="whiteAlpha" 
            mt="2"
            onClick={() => setError(null)}
          >
            閉じる
          </Button>
        </Box>
      )}

      {showCorrectAnimation && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="overlay"
          animation={`${correctAnswer} 0.8s ease-in-out`}
          pointerEvents="none"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontSize="6xl"
            fontWeight="bold"
            color="green.500"
            textShadow="0 0 10px rgba(72, 187, 120, 0.7)"
          >
            正解！
          </Text>
        </Box>
      )}
      
      {showWrongAnimation && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="overlay"
          animation={`${wrongAnswer} 1.5s ease-in-out`}
          pointerEvents="none"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text
            fontSize="6xl"
            fontWeight="bold"
            color="red.500"
            textShadow="0 0 10px rgba(245, 101, 101, 0.7)"
          >
            不正解...
          </Text>
        </Box>
      )}

      {/* バトル開始アニメーション */}
      {showBattleStartAnimation && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="1000"
          bg="rgba(0,0,0,0.7)"
        >
          <Box
            fontSize="6xl"
            fontWeight="bold"
            color="yellow.400"
            textShadow="0 0 20px rgba(255,255,0,0.5)"
            animation={`${battleStartAnimation} 2s ease-out forwards`}
          >
            バトル開始！
          </Box>
        </Box>
      )}

      <Box
        w="100%"
        maxW="1200px"
        bg="white"
        borderRadius="lg"
        boxShadow="xl"
        p={{ base: 3, md: 6 }}
        mx="auto"
        position="relative"
        zIndex="1"
      >
        {!isBattleStarted ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            position="relative"
            pb={16}
            pt={6}
          >
            <Heading 
              textAlign="center" 
              mb={8} 
              size="xl" 
              color="blue.600"
              textShadow="0 2px 4px rgba(0,0,0,0.1)"
              animation={`${floatAnimation} 3s ease-in-out infinite`}
            >
              バトル準備完了！
            </Heading>
            
            <Grid
              templateColumns={{base: "1fr", md: "1fr auto 1fr"}}
              gap={8}
              width="100%"
              mb={8}
              alignItems="center"
            >
              {/* プレイヤー側 */}
              <Box flex="1" position="relative">
                <VStack 
                  spacing={4} 
                  align="center"
                  bg="blue.50"
                  p={6}
                  borderRadius="lg"
                  boxShadow="lg"
                  animation={`${zoomPulse} 3s ease-in-out infinite`}
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                    borderRadius: "lg",
                    background: "linear-gradient(45deg, rgba(66,153,225,0.2) 0%, rgba(99,179,237,0.1) 100%)",
                    zIndex: "-1"
                  }}
                >
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">{player.name}</Text>
                  <Box 
                    width="80px" 
                    height="80px" 
                    borderRadius="full" 
                    overflow="hidden"
                    border="2px solid"
                    borderColor="blue.400"
                    boxShadow="0 0 0 2px rgba(66, 153, 225, 0.6)"
                    mb={2}
                  >
                    <img 
                      src={playerPhoto} 
                      alt={`${player.name}のアバター`}
                      width="100%" 
                      height="100%" 
                      style={{ objectFit: 'cover' }} 
                    />
                  </Box>
                  
                  {/* 画像選択コンポーネント */}
                  {showImageSelector ? (
                    <Box
                      position="fixed"
                      top="0"
                      left="0"
                      right="0"
                      bottom="0"
                      bg="rgba(0,0,0,0.8)"
                      zIndex="1000"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Box
                        bg="white"
                        p={4}
                        borderRadius="md"
                        boxShadow="xl"
                        maxW="400px"
                        w="90%"
                      >
                        <SimpleCamera onPhotoCapture={handlePhotoCapture} />
                        <Button 
                          mt={2} 
                          colorScheme="red" 
                          w="100%"
                          onClick={() => setShowImageSelector(false)}
                        >
                          キャンセル
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => setShowImageSelector(true)}
                    >
                      画像を選択
                    </Button>
                  )}
                  
                  <Text color="gray.600">スキル: {player.skills[0]?.name || "基本スキル"}</Text>
                  <Box width="100%">
                  <Text>HP: {player.hp}/{player.maxHp}</Text>
                  <Progress
                    value={(player.hp / player.maxHp) * 100}
                    width="100%"
                      colorScheme="blue"
                    borderRadius="full"
                      height="12px"
                      background="gray.100"
                    />
                  </Box>
                  <Badge colorScheme="blue" fontSize="md" p={2}>
                    選択レベル: {
                      currentDifficulty === 'easy' ? '初級' : 
                      currentDifficulty === 'medium' ? '中級' : '上級'
                    }
                  </Badge>
                </VStack>
              </Box>
              
              {/* VS部分 */}
              <Box position="relative">
                <Box
                  animation={`${shine} 2s ease-in-out infinite, ${popIn} 0.5s ease-out`}
                  transform="rotate(-3deg)"
                  transition="all 0.3s"
                  _hover={{ transform: 'scale(1.2) rotate(3deg)' }}
                  position="relative"
                  zIndex="2"
                >
                  <img
                    src="./vs.png"
                    alt="VS"
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 0 15px rgba(0,0,0,0.4))'
                    }}
                  />
                </Box>
                {/* エフェクト追加 */}
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  width="200px"
                  height="200px"
                  borderRadius="full"
                  background="radial-gradient(circle, rgba(255,224,130,0.3) 0%, rgba(255,255,255,0) 70%)"
                  zIndex="1"
                />
              </Box>
              
              {/* 敵側 */}
              <Box flex="1">
                <VStack 
                  spacing={4} 
                  align="center"
                  bg="red.50"
                  p={6}
                  borderRadius="lg"
                  boxShadow="lg"
                  animation={`${zoomPulse} 4s ease-in-out infinite`}
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: "0",
                    left: "0",
                    right: "0",
                    bottom: "0",
                    borderRadius: "lg",
                    background: "linear-gradient(45deg, rgba(245,101,101,0.2) 0%, rgba(229,62,62,0.1) 100%)",
                    zIndex: "-1"
                  }}
                >
                  <Text fontSize="2xl" fontWeight="bold" color="red.600">{enemy.name}</Text>
                  <Box 
                    p={3} 
                    bg="white" 
                    borderRadius="full" 
                    boxShadow="md"
                    position="relative"
                    overflow="hidden"
                    width="120px"
                    height="120px"
                  >
                    <Image 
                      src={getEnemyImage(currentDifficulty)}
                      alt={`${currentDifficulty}レベルの敵`}
                      fallbackSrc="/enemy-easy.png" // フォールバックとして初級敵画像を使用
                      width="100%"
                      height="100%"
                      objectFit="cover"
                      borderRadius="full"
                    />
                  </Box>
                  <Text color="gray.600">難易度チャレンジャー</Text>
                  <Box width="100%">
                  <Text>HP: {enemyHP}/{enemy.maxHp}</Text>
                  <Progress
                    value={(enemyHP / enemy.maxHp) * 100}
                    width="100%"
                    colorScheme="red"
                    borderRadius="full"
                      height="12px"
                      background="gray.100"
                    />
                  </Box>
                  <Badge colorScheme="red" fontSize="md" p={2}>
                    レベル: {
                      currentDifficulty === 'easy' ? '初級' : 
                      currentDifficulty === 'medium' ? '中級' : '上級'
                    }
                  </Badge>
                </VStack>
              </Box>
            </Grid>
            
            {/* バトル開始ボタン */}
            <Box
              position="relative"
              mt={4}
            >
              <Button
                colorScheme="yellow"
                size="lg"
                px={10}
                py={6}
                fontSize="xl"
                boxShadow="xl"
                _hover={{ transform: 'translateY(-2px)', boxShadow: '2xl' }}
                onClick={handleStartBattle}
                animation={`${glowEffect} 2s infinite`}
                position="relative"
                zIndex="2"
              >
                バトル開始！
              </Button>
              
              {/* 装飾的な背景要素 */}
              <Box
                position="absolute"
                bottom="-20px"
                left="50%"
                transform="translateX(-50%)"
                width="80%"
                height="15px"
                bg="rgba(0,0,0,0.1)"
                borderRadius="full"
                filter="blur(10px)"
              />
            </Box>
            
            {/* 戦術ヒント */}
            <Box 
              maxW="600px" 
              mt={10} 
              p={4} 
              bg="gray.50" 
              borderRadius="md" 
              boxShadow="sm"
            >
              <Text fontWeight="bold" mb={2} color="gray.700">戦術ヒント:</Text>
              <Text fontSize="sm" color="gray.600">
                問題に正しく答えるとダメージを与えられます。難しい問題ほど多くのダメージを与えられます。
                集中して問題を解き、敵のHPをゼロにしましょう！
              </Text>
            </Box>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
          >
            {currentProblem ? (
              <Box width="100%" bg="white" p={4} borderRadius="md">
                <Box mb={6}>
                  <HStack spacing={8} justify="space-between" align="center" mb={4}>
                    {/* プレイヤー情報 */}
                    <HStack spacing={3}>
                      <Box 
                        borderWidth="2px" 
                        borderColor="blue.400" 
                        borderRadius="full" 
                        overflow="hidden"
                        width="60px"
                        height="60px"
                        position="relative"
                      >
                        <Image 
                          src={playerPhoto}
                          alt={playerName}
                          width="100%"
                          height="100%"
                          objectFit="cover"
                        />
                      </Box>
                      <VStack spacing={0} align="start">
                        <Text fontWeight="bold" color="blue.600">{playerName}</Text>
                        <Text fontSize="sm">HP: 100/100</Text>
                      </VStack>
                    </HStack>

                    {/* VS表示 */}
                    <Text fontWeight="bold" fontSize="xl" color="orange.500">VS</Text>

                    {/* 敵情報 */}
                    <HStack spacing={3}>
                      <VStack spacing={0} align="end">
                        <Text fontWeight="bold" color="red.600">{enemy.name}</Text>
                        <Text fontSize="sm">HP: {enemyHP}/{enemy.maxHp}</Text>
                      </VStack>
                      <Box 
                        borderWidth="2px" 
                        borderColor="red.400" 
                        borderRadius="full" 
                        overflow="hidden"
                        width="60px"
                        height="60px"
                      >
                        <Image 
                          src={getEnemyImage(currentDifficulty)}
                          alt={enemy.name}
                          fallbackSrc="/enemy-easy.png"
                          width="100%"
                          height="100%"
                          objectFit="cover"
                        />
                      </Box>
                    </HStack>
                  </HStack>

                  {/* HPバー */}
                  <Grid templateColumns="1fr 1fr" gap={4} width="100%">
                  <Progress
                    value={100}
                    colorScheme="blue"
                    size="sm"
                    borderRadius="full"
                  />
                  <Progress
                    value={(enemyHP / enemy.maxHp) * 100}
                    colorScheme="red"
                    size="sm"
                    borderRadius="full"
                  />
                  </Grid>
                </Box>

                <CodeEditor
                  problem={currentProblem}
                  onSubmit={handleCodeSubmit}
                  onNext={handleNextProblem}
                  isLoading={isLoading}
                  answerSubmitted={answerSubmitted}
                />
              </Box>
            ) : isLoading ? (
              <LoadingProblem />
            ) : (
              <LoadingProblem />
            )}
          </Box>
        )}
      </Box>

      {isGameCleared && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="rgba(0, 0, 0, 0.8)"
          zIndex={1000}
        >
          <VStack spacing={6} alignItems="center" width="100%" maxW="800px">
            <Heading size="4xl" color="yellow.400" textAlign="center">
              ステージクリア！
            </Heading>
            <Text fontSize="2xl" color="white" textAlign="center">
              おめでとうございます！全ての問題をクリアしました！
            </Text>
            <Button
              colorScheme="blue"
              size="lg"
              onClick={() => window.location.reload()}
            >
              トップ画面に戻る
            </Button>
          </VStack>
        </Box>
      )}

      {isGameOver && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bg="rgba(0, 0, 0, 0.8)"
          zIndex={1000}
        >
          <VStack spacing={6}>
            <Heading size="4xl" color="red.400">
              ゲームオーバー
            </Heading>
            <VStack spacing={4}>
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => handleRetry(false)}
              >
                最初からやり直す
              </Button>
              <Button
                colorScheme="green"
                size="lg"
                onClick={() => handleRetry(true)}
              >
                続きから
              </Button>
            </VStack>
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default BattleField;