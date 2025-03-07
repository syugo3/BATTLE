import React, { useState, useEffect } from 'react';
import { Box, Grid, VStack, Text, Button, Progress, Heading } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import CodeEditor from './CodeEditor';
import { Problem } from '../types/problem';
import { problems } from '../data/problems';

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

interface BattleFieldProps {
  playerCharacter: string;
  playerName: string;
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

const BattleField: React.FC<BattleFieldProps> = ({
  playerCharacter,
  playerName,
  onVictory,
  onDefeat,
}) => {
  const getCharacterInitialHP = (characterId: string): number => {
    switch (characterId) {
      case 'javascript':
        return 100;
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
    const category = getCharacterCategory(playerCharacter);
    const categoryProblems = problems.filter(p => p.category === category);
    return categoryProblems.length * 10;
  };

  const initialPlayerHP = getCharacterInitialHP(playerCharacter);
  const initialEnemyHP = calculateEnemyHP();

  const [playerHP, setPlayerHP] = useState(initialPlayerHP);
  const [enemyHP, setEnemyHP] = useState(initialEnemyHP);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isGameCleared, setIsGameCleared] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState<string[]>([]);
  const [playerDamaged, setPlayerDamaged] = useState(false);
  const [enemyDamaged, setEnemyDamaged] = useState(false);

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

  const handleStartBattle = () => {
    setIsBattleStarted(true);
    setNextProblem();
  };

  const handleCodeSubmit = (selectedChoiceId: string) => {
    if (!currentProblem) return;

    const selectedChoice = currentProblem.choices.find(c => c.id === selectedChoiceId);
    handleProblemSolve(selectedChoice?.isCorrect || false);
  };

  const setNextProblem = () => {
    const category = getCharacterCategory(playerCharacter);
    const availableProblems = problems.filter(p => 
      p.category === category && 
      !solvedProblems.includes(p.id)
    );

    if (availableProblems.length > 0) {
      const randomProblem = availableProblems[Math.floor(Math.random() * availableProblems.length)];
      setCurrentProblem(randomProblem);
      setShowNextButton(false);
    } else {
      // 全問題解答済み
      setIsGameCleared(true);
      onVictory();
    }
  };

  const handleNextProblem = () => {
    setNextProblem();
  };

  const handleRetry = (continueFromCheckpoint: boolean) => {
    if (continueFromCheckpoint) {
      // 現在の敵から再開
      setPlayerHP(initialPlayerHP);
      setIsGameOver(false);
    } else {
      // 最初からやり直し
      setPlayerHP(initialPlayerHP);
      setEnemyHP(initialEnemyHP);
      setSolvedProblems([]);
      setCurrentProblem(null);
      setIsGameOver(false);
      setIsBattleStarted(false);
    }
  };

  const handleProblemSolve = (correct: boolean) => {
    if (correct) {
      // 正解の場合は敵にダメージ
      if (currentProblem) {
        setSolvedProblems([...solvedProblems, currentProblem.id]);
      }
      const damage = 10;
      const newEnemyHP = Math.max(0, enemyHP - damage);
      setEnemyHP(newEnemyHP);
      setEnemyDamaged(true);
      
      if (newEnemyHP <= 0) {
        setIsGameCleared(true);
        onVictory();
        return;
      }
      setShowNextButton(true);
    } else {
      // 不正解の場合はプレイヤーにダメージ
      const newPlayerHP = Math.max(0, playerHP - 5);
      setPlayerHP(newPlayerHP);
      setPlayerDamaged(true);
      
      if (newPlayerHP <= 0) {
        setIsGameOver(true);
        onDefeat();
        return;
      }
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
      bg="gray.50"
      overflow="auto"
      p={4}
    >
      <Box
        w="100%"
        maxW="1200px"
        bg="white"
        borderRadius="lg"
        boxShadow="lg"
        p={6}
        mx="auto"
      >
        {!isBattleStarted ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            position="relative"
            pb={16}
          >
            <Grid
              templateColumns="1fr auto 1fr"
              gap={8}
              width="100%"
              mb={8}
              alignItems="center"
            >
              <Box flex="1">
                <VStack spacing={4} align="center">
                  <Text fontSize="2xl" fontWeight="bold">{player.name}</Text>
                  <Text>HP: {player.hp}/{player.maxHp}</Text>
                  <Progress
                    value={(player.hp / player.maxHp) * 100}
                    width="100%"
                    colorScheme="green"
                    borderRadius="full"
                  />
                </VStack>
              </Box>
              <Box>
                <Box
                  animation={`${popIn} 0.5s ease-out, ${shine} 2s ease-in-out infinite`}
                  transform="rotate(-3deg)"
                  transition="all 0.3s"
                  _hover={{ transform: 'scale(1.1) rotate(3deg)' }}
                >
                  <img
                    src="/vs.png"
                    alt="VS"
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))'
                    }}
                  />
                </Box>
              </Box>
              <Box flex="1">
                <VStack spacing={4} align="center">
                  <Text fontSize="2xl" fontWeight="bold">{enemy.name}</Text>
                  <Text>HP: {enemyHP}/{enemy.maxHp}</Text>
                  <Progress
                    value={(enemyHP / enemy.maxHp) * 100}
                    width="100%"
                    colorScheme="red"
                    borderRadius="full"
                  />
                </VStack>
              </Box>
            </Grid>
            <Box
              position="absolute"
              bottom="0"
              left="50%"
              transform="translateX(-50%)"
            >
              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleStartBattle}
              >
                バトル開始！
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
          >
            <Grid templateColumns="1fr 1fr" gap={8} mb={8} width="100%">
              <VStack 
                align="center" 
                spacing={4} 
                w="100%"
                animation={playerDamaged ? `${damageShake} 0.5s ease-in-out` : 'none'}
              >
                <Text fontSize="2xl" fontWeight="bold">{player.name}</Text>
                <Box w="100%">
                  <Progress
                    value={(playerHP / player.maxHp) * 100}
                    colorScheme="green"
                    size="lg"
                    borderRadius="full"
                  />
                </Box>
                <Text fontSize="lg">HP: {playerHP}/{player.maxHp}</Text>
              </VStack>

              <VStack 
                align="center" 
                spacing={4} 
                w="100%"
                animation={enemyDamaged ? `${damageShake} 0.5s ease-in-out` : 'none'}
              >
                <Text fontSize="2xl" fontWeight="bold">{enemy.name}</Text>
                <Box w="100%">
                  <Progress
                    value={(enemyHP / enemy.maxHp) * 100}
                    colorScheme="red"
                    size="lg"
                    borderRadius="full"
                  />
                </Box>
                <Text fontSize="lg">HP: {enemyHP}/{enemy.maxHp}</Text>
              </VStack>
            </Grid>

            {currentProblem && !showNextButton && (
              <Box width="100%" bg="white" p={4} borderRadius="md">
                <CodeEditor
                  problem={currentProblem}
                  onSubmit={handleCodeSubmit}
                />
              </Box>
            )}

            {showNextButton && (
              <Box mt={6} textAlign="center">
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleNextProblem}
                >
                  次の問題へ
                </Button>
              </Box>
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