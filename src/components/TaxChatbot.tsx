
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { generateQuestions } from "./TaxChatbot/questionsGenerator";
import ChatMessage from "./TaxChatbot/ChatMessage";
import TypingIndicator from "./TaxChatbot/TypingIndicator";
import ChatInput from "./TaxChatbot/ChatInput";
import { TaxData, Question, Message, PropertyType } from "./TaxChatbot/types";

interface TaxChatbotProps {
  onComplete: (data: TaxData) => void;
  propertyData: { propertyType?: string };
}

const TaxChatbot = ({ onComplete, propertyData }: TaxChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [taxData, setTaxData] = useState<TaxData>({});
  const [inputType, setInputType] = useState("text");
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize questions when component mounts
  useEffect(() => {
    const propertyType = (propertyData?.propertyType as PropertyType) || 'residential';
    const generatedQuestions = generateQuestions(propertyType);
    setQuestions(generatedQuestions);
    
    // Start with greeting
    addBotMessage(generatedQuestions[0].text, generatedQuestions[0].type, generatedQuestions[0].options);
  }, [propertyData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addBotMessage = (text: string, type = "text", options: string[] = []) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        type: "bot", 
        text, 
        timestamp: new Date(),
        inputType: type,
        options 
      }]);
      setInputType(type);
      setSelectOptions(options || []);
      setIsTyping(false);
    }, 1000);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { 
      type: "user", 
      text, 
      timestamp: new Date() 
    }]);
  };

  const handleUserResponse = (response: string) => {
    addUserMessage(response);
    
    const currentQ = questions[currentQuestion];
    
    // Store the response if it has a field
    if (currentQ?.field) {
      setTaxData(prev => ({
        ...prev,
        [currentQ.field!]: response
      }));
    }

    // Move to next question
    setTimeout(() => {
      moveToNextQuestion();
    }, 500);
  };

  const moveToNextQuestion = () => {
    let nextIndex = currentQuestion + 1;
    
    // Skip questions based on conditions
    while (nextIndex < questions.length) {
      const nextQ = questions[nextIndex];
      if (nextQ?.condition && !nextQ.condition(taxData)) {
        nextIndex++;
      } else {
        break;
      }
    }

    if (nextIndex >= questions.length) {
      // Complete the chat
      setTimeout(() => {
        onComplete(taxData);
      }, 1000);
      return;
    }

    setCurrentQuestion(nextIndex);
    const nextQ = questions[nextIndex];
    
    if (nextQ?.type === "summary") {
      showSummary();
    } else {
      addBotMessage(nextQ?.text, nextQ?.type, nextQ?.options);
    }
  };

  const showSummary = () => {
    const summaryText = `Here's what we collected:
• Depreciable Basis: $${parseInt(taxData.depreciableBasis || '0').toLocaleString()}
• Purchase Price: $${parseInt(taxData.purchasePrice || '0').toLocaleString()}
• Placed in Service: ${taxData.placedInServiceDate || 'Not specified'}
• Property Use: ${taxData.propertyUse || 'Not specified'}
• Improvements: $${parseInt(taxData.improvementCosts || '0').toLocaleString()}
• Acquisition Method: ${taxData.acquisitionMethod || 'Not specified'}
• Tax Bracket: ${taxData.taxBracket || 'Not specified'}

Everything looks good! Click 'Complete' to proceed with your cost segregation analysis.`;

    addBotMessage(summaryText, "completion");
  };

  const handleComplete = () => {
    onComplete(taxData);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Tax Information Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          inputType={inputType}
          selectOptions={selectOptions}
          isTyping={isTyping}
          onUserResponse={handleUserResponse}
          onComplete={handleComplete}
        />
      </CardContent>
    </Card>
  );
};

export default TaxChatbot;
