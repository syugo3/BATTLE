import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Button, RadioGroup, Radio, Alert, AlertIcon, HStack, Heading, Badge } from '@chakra-ui/react';
import { Problem } from '../types/problem';

interface CodeEditorProps {
  problem: Problem;
  onSubmit: (selectedChoiceId: string) => void;
  onNext: () => void;
  isLoading: boolean;
  answerSubmitted?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  problem,
  onSubmit,
  onNext,
  isLoading,
  answerSubmitted = false
}) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState<string>('');
  
  // 選択された回答が正解かどうか判定
  const isCorrectAnswer = answerSubmitted && 
    problem.choices.find(c => c.id === selectedChoiceId)?.isCorrect;
  
  return (
    <Box width="100%">
      <Box borderWidth="1px" borderRadius="lg" p={4}>
        <HStack mb={4} justify="space-between" align="center">
          <Heading size="md" color="blue.700">
            {problem.title}
          </Heading>
          <Badge 
            colorScheme={
              problem.difficulty === 'easy' ? 'green' : 
              problem.difficulty === 'medium' ? 'blue' : 'purple'
            }
            p={2}
            borderRadius="md"
          >
            {problem.difficulty === 'easy' ? '初級' : 
             problem.difficulty === 'medium' ? '中級' : '上級'}
          </Badge>
        </HStack>

        <Box 
          bg="gray.50" 
          p={4} 
          borderRadius="md" 
          mb={4}
          borderLeft="4px solid" 
          borderColor="blue.400"
        >
          <Text fontSize="lg" fontWeight="medium" mb={3}>
            問題:
          </Text>
          <Text 
            whiteSpace="pre-wrap" 
            lineHeight="1.7"
            fontSize="md"
          >
            {problem.description}
          </Text>
        </Box>

        <Text fontSize="lg" fontWeight="medium" mb={3}>
          選択肢:
        </Text>
        <VStack spacing={3} align="stretch">
          {problem.choices.map((choice) => (
            <Box
              key={choice.id}
              p={3}
              borderWidth="1px"
              borderRadius="md"
              borderColor={selectedChoiceId === choice.id ? 
                (answerSubmitted && choice.isCorrect ? "green.400" : 
                 answerSubmitted && !choice.isCorrect ? "red.400" : "blue.400") 
                : "gray.200"}
              bg={selectedChoiceId === choice.id ? 
                (answerSubmitted && choice.isCorrect ? "green.50" : 
                 answerSubmitted && !choice.isCorrect ? "red.50" : "blue.50") 
                : "white"}
              cursor="pointer"
              onClick={() => !answerSubmitted && setSelectedChoiceId(choice.id)}
              _hover={{ bg: !answerSubmitted ? "gray.50" : "" }}
            >
              <Text>{choice.text}</Text>
            </Box>
          ))}
        </VStack>
        
        {/* 正解表示と解説 */}
        {answerSubmitted && (
          <VStack align="stretch" spacing={3} mt={4}>
            {/* 正解か不正解かの表示 */}
            <Box 
              p={3} 
              bg={isCorrectAnswer ? "green.100" : "red.100"} 
              borderRadius="md"
              borderLeft="4px solid" 
              borderLeftColor={isCorrectAnswer ? "green.500" : "red.500"}
            >
              <Text 
                fontWeight="bold" 
                color={isCorrectAnswer ? "green.700" : "red.700"}
              >
                {isCorrectAnswer ? "正解！" : "不正解..."}
              </Text>
            </Box>
            
            {/* 解説 */}
            <Box p={4} bg="gray.50" borderRadius="md">
              <Text fontWeight="bold" mb={2}>解説:</Text>
              <Text mb={4}>{problem.explanation}</Text>
              
              {/* 次の問題へボタン */}
              <Button
                colorScheme="green"
                onClick={onNext}
                mt={2}
              >
                次の問題へ
              </Button>
            </Box>
          </VStack>
        )}
        
        {/* 回答送信ボタン - 回答済みの場合は非表示 */}
        {!answerSubmitted && (
          <Button
            colorScheme="blue"
            onClick={() => onSubmit(selectedChoiceId)}
            isDisabled={!selectedChoiceId || isLoading}
            isLoading={isLoading}
            mt={4}
          >
            回答を送信
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CodeEditor; 