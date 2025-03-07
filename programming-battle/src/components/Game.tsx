import React, { useState } from 'react';
import { Box, Heading, Button, Text } from '@chakra-ui/react';
import BattleField from './BattleField';
import CharacterSelect from './CharacterSelect';

const Game: React.FC = () => {
  const [gameState, setGameState] = useState<'select' | 'battle' | 'victory' | 'defeat'>('select');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');

  const handleCharacterSelect = (character: string, name: string) => {
    setSelectedCharacter(character);
    setPlayerName(name);
    setGameState('battle');
  };

  const handleVictory = () => {
    setGameState('victory');
  };

  const handleDefeat = () => {
    setGameState('defeat');
  };

  const handleReturnToSelect = () => {
    setGameState('select');
    setSelectedCharacter('');
    setPlayerName('');
  };

  return (
    <Box>
      {gameState === 'select' && (
        <CharacterSelect onSelect={handleCharacterSelect} />
      )}
      {gameState === 'battle' && (
        <BattleField
          playerCharacter={selectedCharacter}
          playerName={playerName}
          onVictory={handleVictory}
          onDefeat={handleDefeat}
        />
      )}
      {gameState === 'victory' && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minH="100vh"
          bg="gray.800"
          color="white"
        >
          <Heading mb={6}>おめでとうございます！</Heading>
          <Text fontSize="xl" mb={8}>全ての敵を倒し、ゲームをクリアしました！</Text>
          <Button colorScheme="blue" onClick={handleReturnToSelect}>
            タイトルに戻る
          </Button>
        </Box>
      )}
      {gameState === 'defeat' && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minH="100vh"
          bg="gray.800"
          color="white"
        >
          <Heading mb={6} color="red.400">ゲームオーバー</Heading>
          <Text fontSize="xl" mb={8}>残念ながら敗北してしまいました...</Text>
          <Button colorScheme="blue" onClick={handleReturnToSelect}>
            タイトルに戻る
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Game; 