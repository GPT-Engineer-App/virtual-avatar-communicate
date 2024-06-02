import React, { useRef, useEffect, useState } from "react";
import { Container, Box, VStack, Text, Button, HStack, IconButton } from "@chakra-ui/react";
import { FaVideo, FaMicrophone, FaMicrophoneSlash, FaVideoSlash } from "react-icons/fa";

const Index = () => {
  const videoRef = useRef(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  useEffect(() => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
        })
        .catch((err) => {
          console.error("Error accessing media devices.", err);
        });
    }
  }, []);

  const toggleVideo = () => {
    const stream = videoRef.current.srcObject;
    const videoTrack = stream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoOn(videoTrack.enabled);
  };

  const toggleAudio = () => {
    const stream = videoRef.current.srcObject;
    const audioTrack = stream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setIsAudioOn(audioTrack.enabled);
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl">Virtual Avatar Video Call</Text>
        <HStack spacing={4} width="100%" justifyContent="center">
          <Box width="50%" bg="gray.200" borderRadius="md" overflow="hidden">
            <video ref={videoRef} autoPlay playsInline width="100%" />
          </Box>
          <Box width="50%" bg="gray.200" borderRadius="md" display="flex" justifyContent="center" alignItems="center">
            <Text>Virtual Avatar Placeholder</Text>
          </Box>
        </HStack>
        <HStack spacing={4} mt={4}>
          <IconButton aria-label="Toggle Video" icon={isVideoOn ? <FaVideo /> : <FaVideoSlash />} onClick={toggleVideo} />
          <IconButton aria-label="Toggle Audio" icon={isAudioOn ? <FaMicrophone /> : <FaMicrophoneSlash />} onClick={toggleAudio} />
        </HStack>
      </VStack>
    </Container>
  );
};

export default Index;
