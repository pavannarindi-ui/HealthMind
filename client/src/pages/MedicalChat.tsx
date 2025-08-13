import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { chatRequestSchema, type ChatRequest } from "@shared/schema";
import { useVoiceAssistant } from "@/hooks/useVoiceAssistant";
import { Heart, ArrowLeft, Bot, User, Mic, Send, Volume2 } from "lucide-react";

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  isVoice: boolean;
  createdAt: string;
}

interface MedicalChatResponse {
  response: string;
  confidence: number;
  requiresUrgentCare: boolean;
  recommendations?: string[];
}

export default function MedicalChat() {
  const [messages, setMessages] = useState<Array<{
    type: "user" | "ai";
    content: string;
    timestamp: Date;
    requiresUrgentCare?: boolean;
    recommendations?: string[];
  }>>([
    {
      type: "ai",
      content: "Hello! I'm your AI medical assistant. How can I help you today? You can ask me about symptoms, medications, or general health questions.",
      timestamp: new Date(),
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isListening, startListening, stopListening, transcript, resetTranscript } = useVoiceAssistant();

  const form = useForm<ChatRequest>({
    resolver: zodResolver(chatRequestSchema),
    defaultValues: {
      message: "",
      isVoice: false,
      context: "",
    },
  });

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Update form when voice transcript changes
  useEffect(() => {
    if (transcript) {
      form.setValue("message", transcript);
    }
  }, [transcript, form]);

  const { data: chatHistory, isLoading: historyLoading } = useQuery({
    queryKey: ["/api/chat-history/user-1"],
  });

  const sendMessage = useMutation({
    mutationFn: async (data: ChatRequest) => {
      const response = await apiRequest("POST", "/api/medical-chat", data);
      return response.json();
    },
    onSuccess: (data: MedicalChatResponse, variables) => {
      // Add user message
      setMessages(prev => [...prev, {
        type: "user",
        content: variables.message,
        timestamp: new Date(),
      }]);

      // Add AI response
      setMessages(prev => [...prev, {
        type: "ai",
        content: data.response,
        timestamp: new Date(),
        requiresUrgentCare: data.requiresUrgentCare,
        recommendations: data.recommendations,
      }]);

      if (data.requiresUrgentCare) {
        toast({
          title: "Urgent Medical Attention Recommended",
          description: "Based on your symptoms, you should seek immediate medical care.",
          variant: "destructive",
        });
      }

      // Text-to-speech for AI responses (optional)
      if ('speechSynthesis' in window && data.response) {
        const utterance = new SpeechSynthesisUtterance(data.response);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    },
    onError: (error) => {
      toast({
        title: "Message Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ChatRequest) => {
    if (!data.message.trim()) return;
    
    sendMessage.mutate(data);
    form.reset();
    resetTranscript();
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="button-back">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Heart className="h-6 w-6 text-medical-blue" />
                <span className="text-lg font-bold text-slate-800">AI Medical Assistant</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-health-green">
              <div className="w-2 h-2 bg-health-green rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Online</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="h-[600px] flex flex-col" data-testid="medical-chat-main">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
              <Bot className="w-6 h-6 mr-2 text-medical-blue" />
              AI Medical Assistant
            </CardTitle>
            <p className="text-slate-600">Get instant medical guidance from our AI-powered assistant</p>
          </CardHeader>
          
          <CardContent className="flex flex-col flex-1 p-0">
            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4" data-testid="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start space-x-3 ${
                  message.type === "user" ? "justify-end" : ""
                }`}>
                  {message.type === "ai" && (
                    <div className="w-8 h-8 bg-medical-blue rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="text-white text-sm" />
                    </div>
                  )}
                  
                  <div className={`rounded-lg p-3 max-w-sm lg:max-w-md ${
                    message.type === "user" 
                      ? "bg-medical-blue text-white" 
                      : "bg-slate-100"
                  }`}>
                    <p className={`text-sm ${
                      message.type === "user" ? "text-white" : "text-slate-800"
                    }`}>
                      {message.content}
                    </p>
                    
                    {message.requiresUrgentCare && (
                      <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800 border border-red-200">
                        ⚠️ This may require urgent medical attention. Consider seeing a healthcare professional.
                      </div>
                    )}
                    
                    {message.recommendations && message.recommendations.length > 0 && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                        <strong>Recommendations:</strong>
                        <ul className="mt-1 space-y-1">
                          {message.recommendations.map((rec, idx) => (
                            <li key={idx}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs ${
                        message.type === "user" ? "text-blue-200" : "text-slate-500"
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      
                      {message.type === "ai" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => speakMessage(message.content)}
                          className="h-6 w-6 p-0 hover:bg-slate-200"
                          data-testid={`button-speak-${index}`}
                        >
                          <Volume2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {message.type === "user" && (
                    <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="text-slate-600 text-sm" />
                    </div>
                  )}
                </div>
              ))}
              
              {sendMessage.isPending && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-medical-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="text-white text-sm" />
                  </div>
                  <div className="bg-slate-100 rounded-lg p-3 max-w-sm">
                    <div className="flex items-center space-x-2">
                      <div className="animate-bounce w-2 h-2 bg-slate-400 rounded-full"></div>
                      <div className="animate-bounce w-2 h-2 bg-slate-400 rounded-full" style={{ animationDelay: '0.1s' }}></div>
                      <div className="animate-bounce w-2 h-2 bg-slate-400 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                      <span className="text-xs text-slate-500 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Chat Input */}
            <div className="border-t border-slate-200 p-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-3">
                  <Button
                    type="button"
                    variant={isListening ? "default" : "outline"}
                    size="icon"
                    onClick={handleVoiceToggle}
                    className={isListening ? "bg-red-500 hover:bg-red-600" : ""}
                    data-testid="button-voice-input"
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input 
                            {...field}
                            placeholder={isListening ? "Listening..." : "Type your medical question..."}
                            disabled={sendMessage.isPending || isListening}
                            data-testid="input-chat-message"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="bg-medical-blue hover:bg-medical-blue-dark"
                    disabled={sendMessage.isPending || isListening}
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </Form>
              
              <p className="text-xs text-slate-500 mt-2">
                💡 Try asking: "What are the symptoms of flu?" or "How to manage diabetes?"
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
