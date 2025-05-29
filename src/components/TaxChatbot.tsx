
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, User, Send, ArrowLeft } from "lucide-react";

const TaxChatbot = ({ onComplete, propertyData }) => {
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [taxData, setTaxData] = useState({});
  const [inputType, setInputType] = useState("text");
  const [selectOptions, setSelectOptions] = useState([]);
  const messagesEndRef = useRef(null);

  const questions = [
    {
      id: "greeting",
      text: "Hi! I'm your tax information assistant. I'll help gather the details needed for your cost segregation analysis. This should only take a few minutes. Ready to get started?",
      type: "confirmation",
      options: ["Yes, let's begin", "I have questions first"]
    },
    {
      id: "depreciableBasis",
      text: "Great! Let's start with the financial details. What's the depreciable basis of this property? This is typically your purchase price minus the land value. For example, if you paid $500,000 and the land is worth $100,000, your depreciable basis would be $400,000.",
      type: "number",
      field: "depreciableBasis"
    },
    {
      id: "purchasePrice",
      text: "What was the total purchase price of the property? This helps us verify the calculations.",
      type: "number",
      field: "purchasePrice"
    },
    {
      id: "placedInService",
      text: "When was this property first placed in service for business or rental use? Please provide the date (MM/DD/YYYY).",
      type: "date",
      field: "placedInServiceDate"
    },
    {
      id: "propertyUse",
      text: "What's the primary use of this property?",
      type: "select",
      field: "propertyUse",
      options: [
        "Rental Property - Long Term",
        "Rental Property - Short Term (Airbnb/VRBO)",
        "Business Use",
        "Mixed Use (Business & Personal)",
        "Investment Property"
      ]
    },
    {
      id: "investmentType",
      text: "Since this is an investment property, how do you plan to use it?",
      type: "select",
      field: "investmentType",
      options: [
        "Hold for long-term rental income",
        "Short-term rental (vacation rental)",
        "Fix and flip",
        "Commercial lease"
      ],
      condition: (data) => data.propertyUse?.includes("Rental") || data.propertyUse?.includes("Investment")
    },
    {
      id: "improvements",
      text: "Have you made any significant improvements to the property after purchase? If yes, what was the total cost of these improvements?",
      type: "number",
      field: "improvementCosts",
      allowZero: true
    },
    {
      id: "acquisitionMethod",
      text: "How did you acquire this property?",
      type: "select",
      field: "acquisitionMethod",
      options: [
        "Purchase with cash",
        "Purchase with financing",
        "Inherited",
        "Gift",
        "Like-kind exchange (1031)"
      ]
    },
    {
      id: "taxBracket",
      text: "What's your approximate tax bracket? This helps estimate potential tax savings.",
      type: "select",
      field: "taxBracket",
      options: [
        "22% (Individual: $41K-$89K, Married: $83K-$178K)",
        "24% (Individual: $89K-$191K, Married: $178K-$340K)",
        "32% (Individual: $191K-$416K, Married: $340K-$431K)",
        "35% (Individual: $416K-$418K, Married: $431K-$647K)",
        "37% (Individual: $418K+, Married: $647K+)"
      ]
    },
    {
      id: "completion",
      text: "Perfect! I've collected all the necessary tax information for your cost segregation analysis. Here's a summary of what we discussed:",
      type: "summary"
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Start with greeting
    addBotMessage(questions[0].text, questions[0].type, questions[0].options);
  }, []);

  const addBotMessage = (text, type = "text", options = []) => {
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

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { 
      type: "user", 
      text, 
      timestamp: new Date() 
    }]);
  };

  const handleUserResponse = (response) => {
    addUserMessage(response);
    
    const currentQ = questions[currentQuestion];
    
    // Store the response if it has a field
    if (currentQ.field) {
      setTaxData(prev => ({
        ...prev,
        [currentQ.field]: response
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
      if (nextQ.condition && !nextQ.condition(taxData)) {
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
    
    if (nextQ.type === "summary") {
      showSummary();
    } else {
      addBotMessage(nextQ.text, nextQ.type, nextQ.options);
    }
  };

  const showSummary = () => {
    const summaryText = `Here's what we collected:
• Depreciable Basis: $${parseInt(taxData.depreciableBasis || 0).toLocaleString()}
• Purchase Price: $${parseInt(taxData.purchasePrice || 0).toLocaleString()}
• Placed in Service: ${taxData.placedInServiceDate || 'Not specified'}
• Property Use: ${taxData.propertyUse || 'Not specified'}
• Improvements: $${parseInt(taxData.improvementCosts || 0).toLocaleString()}
• Acquisition Method: ${taxData.acquisitionMethod || 'Not specified'}
• Tax Bracket: ${taxData.taxBracket || 'Not specified'}

Everything looks good! Click 'Complete' to proceed with your cost segregation analysis.`;

    addBotMessage(summaryText, "completion");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim()) {
      handleUserResponse(userInput);
      setUserInput("");
    }
  };

  const handleSelectResponse = (value) => {
    handleUserResponse(value);
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
            <div
              key={index}
              className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.type === "bot" && (
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-white border"
                }`}
              >
                <p className="whitespace-pre-line">{message.text}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              {message.type === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-white border p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {!isTyping && inputType === "select" && selectOptions.length > 0 && (
          <div className="space-y-2">
            {selectOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSelectResponse(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )}

        {!isTyping && inputType === "confirmation" && (
          <div className="flex gap-2">
            {selectOptions.map((option, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                onClick={() => handleSelectResponse(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        )}

        {!isTyping && inputType === "completion" && (
          <Button onClick={handleComplete} className="w-full" size="lg">
            Complete Tax Information Collection
          </Button>
        )}

        {!isTyping && ["text", "number", "date"].includes(inputType) && (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={
                inputType === "number" ? "Enter amount..." :
                inputType === "date" ? "MM/DD/YYYY" :
                "Type your response..."
              }
              type={inputType === "number" ? "number" : inputType === "date" ? "date" : "text"}
              className="flex-1"
            />
            <Button type="submit" disabled={!userInput.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxChatbot;
