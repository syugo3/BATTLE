import React, { useState } from 'react';
import { Box, Button, VStack, Text, Image } from '@chakra-ui/react';

// インターフェースを追加して型を定義
interface SimpleCameraProps {
  onPhotoCapture?: (photoUrl: string) => void;
}

// propsの型を指定
const SimpleCamera: React.FC<SimpleCameraProps> = ({ onPhotoCapture }) => {
  const [photoData, setPhotoData] = useState<string | null>(null);

  // ファイルアップロード処理
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const photoDataUrl = event.target?.result as string;
        setPhotoData(photoDataUrl);
        if (onPhotoCapture) onPhotoCapture(photoDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <VStack spacing={4} p={4} align="center" w="100%">
      <Text fontWeight="bold" fontSize="xl">プレイヤー画像</Text>
      
      {/* 選択された画像のプレビュー */}
      <Box 
        border="2px dashed gray" 
        borderRadius="md" 
        overflow="hidden" 
        w="100%" 
        maxW="300px" 
        h="200px"
        position="relative"
        bg="gray.50"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {photoData ? (
          <Image 
            src={photoData} 
            alt="選択した画像" 
            w="100%" 
            h="100%" 
            objectFit="cover"
          />
        ) : (
          <Text color="gray.500">画像が選択されていません</Text>
        )}
      </Box>
      
      {/* 画像アップロード機能 */}
      <Box w="100%" maxW="300px">
        <input 
          type="file" 
          accept="image/*"
          id="image-upload"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <label htmlFor="image-upload" style={{ width: '100%', display: 'block' }}>
          <Button 
            as="span" 
            colorScheme="blue" 
            cursor="pointer"
            w="100%"
            _hover={{ bg: 'blue.600' }}
          >
            画像を選択
          </Button>
        </label>
      </Box>
    </VStack>
  );
};

export default SimpleCamera; 