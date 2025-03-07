import { ChakraProvider, Box } from '@chakra-ui/react'
import Game from './components/Game'

function App() {
  return (
    <ChakraProvider>
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minH="100vh" 
        bg="gray.50"
      >
        <Box 
          width="100%" 
          maxW="1200px" 
          mx="auto"
        >
          <Game />
        </Box>
      </Box>
    </ChakraProvider>
  )
}

export default App
