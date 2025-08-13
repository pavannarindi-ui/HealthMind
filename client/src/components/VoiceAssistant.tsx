import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff } from "lucide-react";

interface VoiceAssistantProps {
  onVoiceCommand?: (command: string) => void;
  className?: string;
}

export default function VoiceAssistant({ onVoiceCommand, className = "" }: VoiceAssistantProps) {
  const [isActivated, setIsActivated] = useState(false);
  const { toast } = useToast();
  const { isListening, startListening, stopListening, transcript, resetTranscript } = useVoiceAssistant();

  const handleVoiceToggle = async () => {
    try {
      if (isListening) {
        stopListening();
        setIsActivated(false);
        
        // Process the transcript if available
        if (transcript && onVoiceCommand) {
          onVoiceCommand(transcript);
        }
        
        resetTranscript();
      } else {
        await startListening();
        setIsActivated(true);
        
        toast({
          title: "Voice Assistant Activated",
          description: "Say 'Hey MediCare' or start speaking your medical question.",
        });
      }
    } catch (error) {
      toast({
        title: "Voice Assistant Error",
        description: "Unable to access microphone. Please check your browser permissions.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      <Button
        onClick={handleVoiceToggle}
        className={`px-6 py-3 rounded-lg transition-all flex items-center space-x-2 ${
          isListening 
            ? "bg-red-500 hover:bg-red-600 text-white" 
            : "bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
        }`}
        data-testid="button-voice-assistant"
      >
        {isListening ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
        <span>{isListening ? "Stop Listening" : "Voice Assistant"}</span>
        {isListening && (
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" data-testid="voice-indicator" />
        )}
      </Button>
      
      <div className="text-sm text-blue-100">
        {isListening ? (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>Listening...</span>
          </div>
        ) : (
          <p>Say "Hey MediCare" to activate</p>
        )}
      </div>
      
      {/* Live transcript display */}
      {transcript && isListening && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/30">
          <p className="text-sm text-slate-800">
            <strong>You said:</strong> {transcript}
          </p>
        </div>
      )}
    </div>
  );
}
