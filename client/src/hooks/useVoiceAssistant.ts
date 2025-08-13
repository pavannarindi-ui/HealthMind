import { useState, useCallback, useRef } from "react";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useToast } from "@/hooks/use-toast";

interface UseVoiceAssistantReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => Promise<void>;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
  speakText: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

export function useVoiceAssistant(): UseVoiceAssistantReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const handleSpeechResult = useCallback((transcript: string) => {
    // Check for activation phrases
    const activationPhrases = ["hey medicare", "hey medical", "medical assistant"];
    const lowerTranscript = transcript.toLowerCase();
    
    if (activationPhrases.some(phrase => lowerTranscript.includes(phrase))) {
      toast({
        title: "Voice Assistant Activated",
        description: "I'm listening for your medical question...",
      });
    }
  }, [toast]);

  const handleSpeechError = useCallback((error: string) => {
    let errorMessage = "Speech recognition error occurred.";
    
    switch (error) {
      case "not-allowed":
        errorMessage = "Microphone access denied. Please enable microphone permissions.";
        break;
      case "no-speech":
        errorMessage = "No speech detected. Please try again.";
        break;
      case "network":
        errorMessage = "Network error occurred. Please check your connection.";
        break;
      case "audio-capture":
        errorMessage = "No microphone found. Please connect a microphone.";
        break;
      default:
        errorMessage = `Speech recognition error: ${error}`;
    }
    
    toast({
      title: "Voice Assistant Error",
      description: errorMessage,
      variant: "destructive",
    });
  }, [toast]);

  const {
    isListening,
    transcript,
    startListening: startSpeechRecognition,
    stopListening: stopSpeechRecognition,
    resetTranscript,
    isSupported
  } = useSpeechRecognition({
    continuous: true,
    interimResults: true,
    lang: "en-US",
    onResult: handleSpeechResult,
    onError: handleSpeechError,
  });

  const startListening = useCallback(async (): Promise<void> => {
    try {
      await startSpeechRecognition();
    } catch (error) {
      toast({
        title: "Voice Assistant Unavailable",
        description: (error as Error).message,
        variant: "destructive",
      });
      throw error;
    }
  }, [startSpeechRecognition, toast]);

  const stopListening = useCallback(() => {
    stopSpeechRecognition();
  }, [stopSpeechRecognition]);

  const speakText = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Text-to-Speech Unavailable",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive",
      });
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Limit text to approximately 10 seconds of speech (roughly 80-100 words)
    const words = text.split(' ');
    const maxWords = 80; // Approximately 10 seconds at normal speech rate
    const limitedText = words.length > maxWords 
      ? words.slice(0, maxWords).join(' ') + '...' 
      : text;

    const utterance = new SpeechSynthesisUtterance(limitedText);
    
    // Configure speech settings for faster delivery within 10 seconds
    utterance.rate = 1.0; // Slightly faster to fit within time limit
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    // Try to use a more natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') || 
      voice.lang === 'en-US'
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Set up timeout to enforce 10-second limit
    let timeoutId: NodeJS.Timeout;

    utterance.onstart = () => {
      setIsSpeaking(true);
      // Force stop after 10 seconds
      timeoutId = setTimeout(() => {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
          speechSynthesisRef.current = null;
        }
      }, 10000);
    };

    utterance.onend = () => {
      clearTimeout(timeoutId);
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    };

    utterance.onerror = (event) => {
      clearTimeout(timeoutId);
      console.error("Speech synthesis error:", event.error);
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [toast]);

  const stopSpeaking = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    }
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported,
    speakText,
    stopSpeaking,
    isSpeaking,
  };
}
