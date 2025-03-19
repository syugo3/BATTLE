import React, { useState } from 'react';
import {
  Grid,
  GridItem,
  VStack,
  Text,
  Button,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Heading,
  Badge,
  Divider,
  HStack,
  Flex,
  FormControl,
  RadioGroup,
  Stack,
  Radio
} from '@chakra-ui/react';
import BattleField from './BattleField';

interface CharacterSelectProps {
  onSelect: (character: string, playerName: string, difficulty: 'easy' | 'medium' | 'hard') => void;
}

const characters = [
  {
    id: 'javascript',
    name: 'フロントエンドの基本',
    description: '基礎から応用まで幅広く学べる',
    hp: 100,
    skills: ['基本アルゴリズム', 'データ構造操作', '再帰関数']
  },
  {
    id: 'python',
    name: 'APIの作成方法',
    description: 'シンプルで強力な技を使用',
    hp: 120,
    skills: ['インデント斬り', 'ジェネレーター連打', 'リスト内包']
  },
  {
    id: 'rust',
    name: 'Firebase FunctionとDB(FireStore)',
    description: '堅牢な防御力が特徴',
    hp: 150,
    skills: ['所有権移転', 'ライフタイム制御', 'unsafe破壊']
  }
];

const CharacterSelect: React.FC<CharacterSelectProps> = ({ onSelect }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCharacter, setSelectedCharacter] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [playerName, setPlayerName] = useState<string>('');
  const [playerPhoto, setPlayerPhoto] = useState('');
  const [showBattleField, setShowBattleField] = useState(false);

  const handleCharacterClick = (characterId: string, difficulty: 'easy' | 'medium' | 'hard') => {
    setSelectedCharacter(characterId);
    setSelectedDifficulty(difficulty);
    onOpen();
  };

  const handleSubmit = () => {
    if (playerName.trim()) {
      onSelect(selectedCharacter, playerName, selectedDifficulty);
      onClose();
    }
  };

  const handlePhotoCapture = (photoDataUrl: string) => {
    setPlayerPhoto(photoDataUrl);
    localStorage.setItem('playerPhoto', photoDataUrl);
  };

  const handleVictory = () => {
    // 勝利時の処理
    console.log("勝利しました！");
    // その他の処理...
  };

  const handleDefeat = () => {
    // 敗北時の処理
    console.log("敗北しました...");
    // その他の処理...
  };

  return (
    <>
      {!showBattleField ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minH="100vh"
          w="100vw"
          m={0}
          p={0}
          bgGradient="linear(to-b, blue.500, purple.500)"
          position="relative"
          overflow="hidden"
        >
          {/* デコレーション要素 */}
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            height="200px"
            bgGradient="linear(to-b, whiteAlpha.200, transparent)"
            transform="skewY(-6deg)"
            transformOrigin="top left"
          />

          <VStack 
            spacing={6} 
            position="relative" 
            zIndex="1" 
            w="100%" 
            maxW={{ base: "100%", md: "1200px" }}
            px={{ base: 2, md: 4 }}
            mx="auto"
          >
            <Heading
              size="2xl"
              color="white"
              textAlign="center"
              textShadow="0 2px 4px rgba(0,0,0,0.3)"
              mb={2}
              px={2}
            >
              プログラミングバトル
            </Heading>
            <Text
              fontSize="xl"
              color="whiteAlpha.900"
              textAlign="center"
              mb={4}
              maxW="600px"
              px={2}
            >
              あなたの知識と技術で戦う、新しい学習体験
            </Text>

            <Box
              w="100%"
              maxW={{ base: "100%", md: "1200px" }}
              p={{ base: 3, md: 6 }}
              bg="white"
              borderRadius={{ base: "md", md: "xl" }}
              boxShadow="2xl"
              mx={2}
            >
              <VStack spacing={6} align="center" w="100%">
                <Heading size="lg" color="gray.700" mb={2}>
                  学習する項目とレベルを選んでください！
                </Heading>
                <Grid 
                  templateColumns={{
                    base: "1fr",
                    md: "repeat(3, 1fr)"
                  }}
                  gap={6}
                  width="100%"
                >
                  {characters.map((character) => (
                    <GridItem key={character.id}>
                      <Box
                        p={4}
                        borderWidth="2px"
                        borderRadius="xl"
                        borderColor="gray.200"
                        _hover={{ 
                          boxShadow: 'xl',
                          transform: 'translateY(-2px)',
                          transition: 'all 0.2s ease',
                          borderColor: 'blue.300'
                        }}
                        cursor="pointer"
                        bg="white"
                        height="100%"
                        display="flex"
                        flexDirection="column"
                      >
                        <VStack spacing={4} align="center" height="100%">
                          {/* タイトル */}
                          <Heading size="md" textAlign="center" color="gray.700">
                            {character.name}
                          </Heading>
                          
                          {/* HP表示 */}
                          <Badge 
                            colorScheme="green" 
                            p={2} 
                            borderRadius="md" 
                            textAlign="center"
                            fontSize="md"
                          >
                            HP: {character.hp}
                          </Badge>
                          
                          <Divider my={2} />
                          
                          {/* 難易度選択 */}
                          <Text 
                            fontWeight="bold" 
                            color="gray.700"
                            fontSize="md"
                            textAlign="center"
                          >
                            難易度を選択:
                          </Text>
                          
                          {/* 難易度ボタン - 縦並びに変更 */}
                          <VStack spacing={2} width="100%">
                            <Button
                              colorScheme="green"
                              size="md"
                              width="100%"
                              onClick={() => handleCharacterClick(character.id, 'easy')}
                              _hover={{
                                transform: 'translateY(-1px)',
                                boxShadow: 'md'
                              }}
                            >
                              初級
                            </Button>
                            <Button
                              colorScheme="blue"
                              size="md"
                              width="100%"
                              onClick={() => handleCharacterClick(character.id, 'medium')}
                              _hover={{
                                transform: 'translateY(-1px)',
                                boxShadow: 'md'
                              }}
                            >
                              中級
                            </Button>
                            <Button
                              colorScheme="purple"
                              size="md"
                              width="100%"
                              onClick={() => handleCharacterClick(character.id, 'hard')}
                              _hover={{
                                transform: 'translateY(-1px)',
                                boxShadow: 'md'
                              }}
                            >
                              上級
                            </Button>
                          </VStack>
                        </VStack>
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              </VStack>
            </Box>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay backdropFilter="blur(4px)" />
              <ModalContent mx={4}>
                <ModalHeader textAlign="center" fontSize="xl" pt={6}>
                  プレイヤー名を入力
                </ModalHeader>
                <ModalBody pb={5}>
                  <VStack spacing={3}>
                    <Input
                      placeholder="名前を入力してください"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                      size="lg"
                      autoFocus
                    />
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={handleSubmit} size="lg" width="160px">
                    バトル開始
                  </Button>
                  <Button variant="ghost" onClick={onClose}>キャンセル</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </VStack>
        </Box>
      ) : (
        <BattleField
          playerCharacter={selectedCharacter}
          playerName={playerName}
          initialPlayerPhoto={playerPhoto}
          initialDifficulty={selectedDifficulty}
          onVictory={handleVictory}
          onDefeat={handleDefeat}
        />
      )}
    </>
  );
};

export default CharacterSelect; 