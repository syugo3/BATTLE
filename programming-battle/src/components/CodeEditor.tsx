import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Button, RadioGroup, Radio, Alert, AlertIcon } from '@chakra-ui/react';
import { Problem } from '../types/problem';

interface CodeEditorProps {
  problem: Problem;
  onSubmit: (selectedChoiceId: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ problem, onSubmit }) => {
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  // 不正解時のフィードバックを一時的に表示
  useEffect(() => {
    if (showResult && !isCorrect) {
      const timer = setTimeout(() => {
        setShowResult(false);
        onSubmit(selectedChoice);
      }, 2000); // 2秒間表示するように延長
      return () => clearTimeout(timer);
    }
  }, [showResult, isCorrect, selectedChoice, onSubmit]);

  const handleSubmit = () => {
    if (!selectedChoice) return;
    
    const correct = problem.choices.find(c => c.id === selectedChoice)?.isCorrect || false;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (!correct) {
      // 不正解の場合のみ自動で次へ進む
      // 正解の場合は「次の問題へ」ボタンを押すまで待機
    }
  };

  const handleNext = () => {
    setShowResult(false);
    onSubmit(selectedChoice);
  };

  return (
    <VStack spacing={4} align="stretch">
      <Box borderWidth="1px" borderRadius="lg" p={4}>
        <Text fontSize="lg" fontWeight="bold" mb={2}>{problem.title}</Text>
        <Text mb={4}>{problem.description}</Text>
        
        <RadioGroup onChange={setSelectedChoice} value={selectedChoice} mb={4}>
          <VStack align="start" spacing={3}>
            {problem.choices.map((choice) => (
              <Radio 
                key={choice.id} 
                value={choice.id}
                isDisabled={showResult}
              >
                {choice.text}
              </Radio>
            ))}
          </VStack>
        </RadioGroup>

        {!showResult && (
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={!selectedChoice}
            width="100%"
          >
            回答する
          </Button>
        )}

        {showResult && (
          <VStack spacing={4} width="100%">
            <Alert
              status={isCorrect ? "success" : "error"}
              variant="subtle"
              borderRadius="md"
              p={4}
            >
              <AlertIcon />
              <Text>
                {isCorrect ? "正解！" : "不正解..."}
              </Text>
            </Alert>

            {isCorrect && (
              <>
                <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50" width="100%">
                  <Text fontWeight="bold" mb={2}>解説:</Text>
                  <Text>{problem.explanation}</Text>
                </Box>
                <Button
                  colorScheme="blue"
                  onClick={handleNext}
                  width="100%"
                  size="lg"
                  mt={2}
                >
                  次の問題へ
                </Button>
              </>
            )}
          </VStack>
        )}
      </Box>
    </VStack>
  );
};

export default CodeEditor; 