import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, VStack, Text, Image, Flex, useToast } from '@chakra-ui/react';

interface CameraCaptureProps {
  onPhotoCapture: (photoDataUrl: string) => void;
  compact?: boolean;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  onPhotoCapture, 
  compact = false
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [photoData, setPhotoData] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const toast = useToast();

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      console.log("カメラ起動を試みています...");
      
      // ブラウザがUserMediaに対応しているか確認
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("このブラウザはカメラAPIに対応していません");
        toast({
          title: "カメラが使用できません",
          description: "このブラウザはカメラAPIに対応していないか、HTTPSが必要です",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" }
      });
      
      console.log("カメラの起動に成功しました", mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraOpen(true);
      }
    } catch (err: unknown) {
      // errがErrorインスタンスであることを確認
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('カメラの起動に失敗しました:', errorMessage);
      toast({
        title: "カメラの起動に失敗しました",
        description: `エラー: ${errorMessage}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const size = Math.min(canvas.width, canvas.height);
      const x = (canvas.width - size) / 2;
      const y = (canvas.height - size) / 2;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const squareCanvas = document.createElement('canvas');
      squareCanvas.width = size;
      squareCanvas.height = size;
      const squareCtx = squareCanvas.getContext('2d');
      if (!squareCtx) return;
      
      squareCtx.drawImage(
        canvas, 
        x, y, size, size,
        0, 0, size, size
      );
      
      const photoDataUrl = squareCanvas.toDataURL('image/png');
      setPhotoData(photoDataUrl);
      onPhotoCapture(photoDataUrl);
      stopCamera();
      
      toast({
        title: "写真を撮影しました",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error('写真撮影中にエラーが発生しました:', err);
      toast({
        title: "写真撮影に失敗しました",
        status: "error",
        duration: 3000,
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraOpen(false);
    }
  };

  return (
    <VStack 
      spacing={compact ? 2 : 4} 
      p={compact ? 2 : 4} 
      align="center" 
      w={compact ? "auto" : "100%"} 
      maxW={compact ? "300px" : "500px"} 
      mx="auto"
    >
      {!isCameraOpen && !photoData ? (
        <Button 
          colorScheme="blue" 
          onClick={startCamera}
          size={compact ? "sm" : "lg"}
          w={compact ? "auto" : "100%"}
        >
          {compact ? "写真撮影" : "カメラを起動"}
        </Button>
      ) : null}

      {isCameraOpen && (
        <Box w="100%">
          <Box 
            borderWidth="2px" 
            borderColor="blue.400" 
            borderRadius="lg" 
            overflow="hidden" 
            w="100%" 
            p={1}
            position="relative"
          >
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              style={{ width: '100%', borderRadius: '0.5rem' }} 
            />
            <Box 
              position="absolute" 
              top="50%" 
              left="50%" 
              transform="translate(-50%, -50%)" 
              border="2px dashed white" 
              width="80%" 
              height="80%" 
              pointerEvents="none"
            />
          </Box>
          
          <Flex mt={4} justify="space-between">
            <Button colorScheme="red" onClick={stopCamera}>
              キャンセル
            </Button>
            <Button colorScheme="green" onClick={capturePhoto}>
              撮影する
            </Button>
          </Flex>
        </Box>
      )}

      {photoData && (
        <Box w="100%">
          <Text fontWeight="bold" mb={2} textAlign="center">プレーヤー画像:</Text>
          <Box 
            borderWidth="2px" 
            borderColor="green.400" 
            borderRadius="full" 
            overflow="hidden" 
            w="150px" 
            h="150px" 
            mx="auto"
            boxShadow="md"
          >
            <Image 
              src={photoData} 
              alt="あなたの写真" 
              w="100%" 
              h="100%" 
              objectFit="cover" 
            />
          </Box>
          <Button 
            colorScheme="blue" 
            onClick={() => { setPhotoData(''); startCamera(); }}
            mt={4}
            w="100%"
          >
            再撮影
          </Button>
        </Box>
      )}
    </VStack>
  );
};

export default CameraCapture; 