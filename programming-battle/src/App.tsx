import React, { useState } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import CharacterSelect from './components/CharacterSelect';
import BattleField from './components/BattleField';
import Game from './components/Game'

function App() {
  const [gameState, setGameState] = useState({
    isStarted: false,
    character: '',
    playerName: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard'
  });

  const handleCharacterSelect = (character: string, playerName: string, difficulty: 'easy' | 'medium' | 'hard') => {
    setGameState({
      isStarted: true,
      character,
      playerName,
      difficulty
    });
  };

  const handleVictory = () => {
    // 勝利処理
  };

  const handleDefeat = () => {
    // 敗北処理
  };

  return (
    <ChakraProvider>
      <Box width="100vw" overflow="hidden">
        {!gameState.isStarted ? (
          <CharacterSelect onSelect={handleCharacterSelect} />
        ) : (
          <BattleField
            playerCharacter={gameState.character}
            playerName={gameState.playerName}
            initialDifficulty={gameState.difficulty}
            onVictory={handleVictory}
            onDefeat={handleDefeat}
          />
        )}
      </Box>
    </ChakraProvider>
  );
}

export default App;
