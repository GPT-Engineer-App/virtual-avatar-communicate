import React, { useRef, useEffect, useState } from "react";
import { Container, Box, VStack, Text, Button, HStack, IconButton, useToast } from "@chakra-ui/react";
import { FaVideo, FaMicrophone, FaMicrophoneSlash, FaVideoSlash } from "react-icons/fa";

const Index = () => {
  const [aiResponse, setAiResponse] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const toast = useToast();

  const handleSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast({
        title: "Speech Recognition not supported",
        description: "Your browser does not support speech recognition.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    const handleAIResponse = async (text) => {
      const response = await fetch("https://api.example.com/ai-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: text }),
      });
      const data = await response.json();
      console.log("AI Response Data:", data);
      return data.answer;
    };

    recognition.onresult = async (event) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const finalTranscript = event.results[i][0].transcript;
          setTranscribedText((prev) => prev + finalTranscript);
          const response = await handleAIResponse(finalTranscript);
          setAiResponse(response);
        }
      }
      setTranscribedText((prev) => prev + interimTranscript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event);
      toast({
        title: "Speech Recognition Error",
        description: event.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };
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
          <Button onClick={handleSpeechRecognition}>{isListening ? "Stop Listening" : "Start Listening"}</Button>
          <IconButton aria-label="Toggle Video" icon={isVideoOn ? <FaVideo /> : <FaVideoSlash />} onClick={toggleVideo} />
          <IconButton aria-label="Toggle Audio" icon={isAudioOn ? <FaMicrophone /> : <FaMicrophoneSlash />} onClick={toggleAudio} />
        </HStack>
      </VStack>
      <Box mt={4} p={4} bg="gray.100" borderRadius="md" width="100%">
        <Text fontSize="lg">Transcribed Text:</Text>
        <Text>{transcribedText}</Text>
      </Box>
      <Box mt={4} p={4} bg="gray.100" borderRadius="md" width="100%">
        <Text fontSize="lg">AI Response:</Text>
        <Text>{aiResponse}</Text>
      </Box>
    </Container>
  );
};

export default Index;
