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
  Divider
} from '@chakra-ui/react';

interface CharacterSelectProps {
  onSelect: (character: string, playerName: string) => void;
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
  const [playerName, setPlayerName] = useState<string>('');

  const handleCharacterClick = (characterId: string) => {
    setSelectedCharacter(characterId);
    onOpen();
  };

  const handleSubmit = () => {
    if (playerName.trim()) {
      onSelect(selectedCharacter, playerName);
      onClose();
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minH="100vh"
      w="100%"
      bg="gray.50"
      py={8}
      px={0}
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

      <VStack spacing={6} position="relative" zIndex="1" w="100%">
        <Heading
          size="2xl"
          color="white"
          textAlign="center"
          textShadow="0 2px 4px rgba(0,0,0,0.3)"
          mb={2}
          px={4}
        >
          プログラミングバトル
        </Heading>
        <Text
          fontSize="xl"
          color="whiteAlpha.900"
          textAlign="center"
          mb={4}
          maxW="600px"
          px={4}
        >
          あなたの知識と技術で戦う、新しい学習体験
        </Text>

        <Box
          maxW="100%"
          w="100%"
          p={6}
          bg="white"
          borderRadius="none"
          boxShadow="2xl"
        >
          <VStack spacing={6} align="center" w="100%">
            <Heading size="lg" color="gray.700" mb={2}>
              学習する項目を選んでください
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
                      boxShadow: '2xl',
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease',
                      borderColor: 'blue.400'
                    }}
                    cursor="pointer"
                    bg="white"
                    onClick={() => handleCharacterClick(character.id)}
                    height="100%"
                    display="flex"
                    flexDirection="column"
                  >
                    <VStack spacing={3} align="stretch" height="100%">
                      <Heading size="md" textAlign="center" color="gray.700">
                        {character.name}
                      </Heading>
                      <Text 
                        textAlign="center" 
                        color="gray.600"
                        fontSize="sm"
                        minHeight="40px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        {character.description}
                      </Text>
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
                      <Text 
                        fontWeight="bold" 
                        color="gray.700"
                        fontSize="sm"
                        mb={1}
                      >
                        スキル:
                      </Text>
                      <VStack spacing={2} align="stretch" flex={1}>
                        {character.skills.map((skill) => (
                          <Text
                            key={skill}
                            fontSize="sm"
                            p={2}
                            bg="gray.50"
                            borderRadius="md"
                            color="gray.700"
                          >
                            {skill}
                          </Text>
                        ))}
                      </VStack>
                      <Button
                        colorScheme="blue"
                        size="md"
                        width="100%"
                        mt={2}
                        _hover={{
                          transform: 'translateY(-2px)',
                          boxShadow: 'lg'
                        }}
                      >
                        選択
                      </Button>
                    </VStack>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </VStack>
        </Box>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent mx={4}>
          <ModalHeader textAlign="center" fontSize="xl" pt={6}>
            プレイヤー名を入力
          </ModalHeader>
          <ModalBody pb={6}>
            <Input
              placeholder="名前を入力してください"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              size="lg"
              autoFocus
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit} size="lg" width="160px">
              バトル開始
            </Button>
            <Button variant="ghost" onClick={onClose}>キャンセル</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CharacterSelect; 