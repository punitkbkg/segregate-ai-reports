
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { generateQuestions } from "./TaxChatbot/questionsGenerator";
import ChatMessage from "./TaxChatbot/ChatMessage";
import TypingIndicator from "./TaxChatbot/TypingIndicator";
import ChatInput from "./TaxChatbot/ChatInput";
import CostAllocationReport from "./CostAllocationReport";
import { TaxData, TakeoffsData, Question, Message, PropertyType } from "./TaxChatbot/types";

interface TaxChatbotProps {
  onComplete: (data: TaxData & TakeoffsData) => void;
  propertyData: { propertyType?: string };
}

const TaxChatbot = ({ onComplete, propertyData }: TaxChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [collectedData, setCollectedData] = useState<TaxData & TakeoffsData>({});
  const [inputType, setInputType] = useState("text");
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentSection, setCurrentSection] = useState<'tax' | 'takeoffs'>('tax');
  const [chatCompleted, setChatCompleted] = useState(false);
  const [reportData, setReportData] = useState(null);
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
      setCollectedData(prev => ({
        ...prev,
        [currentQ.field!]: response
      }));
    }

    // Update current section
    if (currentQ?.section) {
      setCurrentSection(currentQ.section);
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
      if (nextQ?.condition && !nextQ.condition(collectedData)) {
        nextIndex++;
      } else {
        break;
      }
    }

    if (nextIndex >= questions.length) {
      // Complete the chat and show cost allocation report
      setChatCompleted(true);
      showSummary();
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
    const taxSummary = `Perfect! I've collected all the necessary information for your cost segregation analysis:

**Tax Information:**
• Depreciable Basis: $${parseInt(collectedData.depreciableBasis || '0').toLocaleString()}
• Purchase Price: $${parseInt(collectedData.purchasePrice || '0').toLocaleString()}
• Property Use: ${collectedData.propertyUse || 'Not specified'}
• Tax Bracket: ${collectedData.taxBracket || 'Not specified'}

**Property Takeoffs:**
• Foundation: ${collectedData.foundationMaterial || 'Not specified'}
• Wall Construction: ${collectedData.wallMaterial || 'Not specified'}
• HVAC System: ${collectedData.hvacSystemType || 'Not specified'}
• Electrical: ${collectedData.electricalSystemType || 'Not specified'}

Now you can generate a detailed cost allocation report based on this information!`;

    addBotMessage(taxSummary, "completion");
  };

  const handleComplete = () => {
    onComplete(collectedData);
  };

  const handleReportGenerated = (data: any) => {
    setReportData(data);
    // Automatically pass the complete data including report to parent
    onComplete({ ...collectedData, reportData: data });
  };

  if (chatCompleted) {
    return (
      <div className="space-y-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Information Collection Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        <CostAllocationReport
          taxData={collectedData}
          takeoffsData={collectedData}
          propertyData={propertyData}
          onReportGenerated={handleReportGenerated}
        />
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          {currentSection === 'tax' ? 'Tax Information Assistant' : 'Property Takeoffs Assistant'}
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
