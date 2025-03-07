import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Text } from '@chakra-ui/react';

interface BattleAnimationProps {
  type: 'attack' | 'damage' | 'heal' | 'status';
  message: string;
  onComplete?: () => void;
}

const BattleAnimation: React.FC<BattleAnimationProps> = ({
  type,
  message,
  onComplete
}) => {
  const variants = {
    attack: {
      initial: { x: 0, opacity: 0 },
      animate: { x: [0, 100, -50, 0], opacity: [0, 1, 1, 0] },
      transition: { duration: 1 }
    },
    damage: {
      initial: { scale: 1, opacity: 0 },
      animate: { scale: [1, 1.2, 0.8, 1], opacity: [0, 1, 1, 0] },
      transition: { duration: 0.5 }
    },
    heal: {
      initial: { y: 0, opacity: 0 },
      animate: { y: [0, -30], opacity: [0, 1, 0] },
      transition: { duration: 0.8 }
    },
    status: {
      initial: { opacity: 0, scale: 0.5 },
      animate: { opacity: [0, 1, 0], scale: [0.5, 1.2, 1] },
      transition: { duration: 1.2 }
    }
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      <motion.div
        initial={variants[type].initial}
        animate={variants[type].animate}
        transition={variants[type].transition}
        exit={{ opacity: 0 }}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={1000}
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color={type === 'heal' ? 'green.500' : type === 'damage' ? 'red.500' : 'blue.500'}
            textShadow="0 0 10px white"
          >
            {message}
          </Text>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default BattleAnimation; 