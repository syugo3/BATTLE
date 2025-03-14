import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Button, RadioGroup, Radio, Alert, AlertIcon } from '@chakra-ui/react';
import { Problem } from '../types/problem';

interface CodeEditorProps {
  problem: Problem;
  onSubmit: (selectedChoiceId: string) => void;
  onNext: () => void;
  isLoading?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ problem, onSubmit, onNext, isLoading }) => {
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

  const handleSubmit = async () => {
    if (!selectedChoice) return;
    
    const correct = problem.choices.find(c => c.id === selectedChoice)?.isCorrect || false;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (!correct) {
      // 不正解の場合は自動で次へ進む
      await onSubmit(selectedChoice);
    }
    // 正解の場合は結果を表示したまま待機（次へボタンを表示）
  };

  const handleNextClick = async () => {
    try {
      setShowResult(false);
      setSelectedChoice('');
      setIsCorrect(false);
      await onSubmit(selectedChoice);  // 正解時の結果を送信
      await onNext();  // 次の問題を生成
    } catch (error) {
      console.error('次の問題への移行中にエラーが発生しました:', error);
      // エラーが発生しても状態はリセット
      setShowResult(false);
      setSelectedChoice('');
      setIsCorrect(false);
    }
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
                  onClick={handleNextClick}
                  width="100%"
                  size="lg"
                  mt={2}
                  isLoading={isLoading}
                  loadingText="次の問題を生成中..."
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