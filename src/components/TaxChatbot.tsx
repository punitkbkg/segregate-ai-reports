
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
  const [questions, setQuestions] = useState([]);
  const messagesEndRef = useRef(null);

  // Generate dynamic questions based on property type
  const generateQuestions = (propertyType) => {
    const greetingVariations = [
      "Hi there! I'm your tax assistant. Let's gather some information for your cost segregation analysis. Ready to begin?",
      "Hello! I'm here to help collect tax details for your property analysis. This will just take a few minutes. Shall we start?",
      "Welcome! I'll be guiding you through some tax questions for your cost segregation study. Let's get started!"
    ];

    const depreciableBasisVariations = {
      residential: [
        "Let's start with the financial details. What's the depreciable basis of your residential property? This is typically your purchase price minus the land value.",
        "For residential properties, we need the depreciable basis. This is usually what you paid for the property minus the value of the land underneath.",
        "What's the cost basis you'll use for depreciation on this residential property? Remember to exclude the land value from your total purchase price."
      ],
      commercial: [
        "For commercial properties, what's your depreciable basis? This includes the building and improvements, but excludes land value.",
        "Let's discuss the depreciable basis for your commercial property. What's the building value excluding land?",
        "What's the depreciable cost basis for this commercial building? This should be your acquisition cost minus land value."
      ],
      industrial: [
        "For industrial properties, what's your depreciable basis? This includes all building improvements and equipment, excluding land.",
        "What's the depreciable basis for your industrial facility? Include building and fixed equipment, but exclude land value.",
        "Let's determine the depreciable basis for your industrial property. What's the total cost minus land value?"
      ]
    };

    const propertyUseVariations = {
      residential: [
        "How do you plan to use this residential property?",
        "What's your intended use for this residential property?",
        "Tell me about how you'll be using this residential property:"
      ],
      commercial: [
        "What type of commercial use is planned for this property?",
        "How will this commercial property be utilized?",
        "What's the primary business use for this commercial property?"
      ],
      industrial: [
        "What type of industrial operations will take place here?",
        "How will this industrial facility be used?",
        "What's the primary industrial use for this property?"
      ]
    };

    const useOptions = {
      residential: [
        "Long-term rental property",
        "Short-term rental (Airbnb/VRBO)",
        "Primary residence with home office",
        "Investment property - hold and rent",
        "Fix and flip project"
      ],
      commercial: [
        "Office building",
        "Retail space",
        "Restaurant/Food service",
        "Medical/Healthcare facility",
        "Mixed-use commercial"
      ],
      industrial: [
        "Manufacturing facility",
        "Warehouse/Distribution",
        "Research and development",
        "Heavy machinery operations",
        "Storage facility"
      ]
    };

    const randomGreeting = greetingVariations[Math.floor(Math.random() * greetingVariations.length)];
    const randomDepreciableBasis = depreciableBasisVariations[propertyType] ? 
      depreciableBasisVariations[propertyType][Math.floor(Math.random() * depreciableBasisVariations[propertyType].length)] :
      depreciableBasisVariations.residential[0];
    const randomPropertyUse = propertyUseVariations[propertyType] ?
      propertyUseVariations[propertyType][Math.floor(Math.random() * propertyUseVariations[propertyType].length)] :
      propertyUseVariations.residential[0];

    return [
      {
        id: "greeting",
        text: randomGreeting,
        type: "confirmation",
        options: ["Yes, let's begin", "I have questions first"]
      },
      {
        id: "depreciableBasis",
        text: randomDepreciableBasis,
        type: "number",
        field: "depreciableBasis"
      },
      {
        id: "purchasePrice",
        text: Math.random() > 0.5 ? 
          "What was the total purchase price of the property? This helps us verify our calculations." :
          "Could you share the total acquisition cost? We use this to validate the depreciable basis.",
        type: "number",
        field: "purchasePrice"
      },
      {
        id: "placedInService",
        text: Math.random() > 0.5 ?
          "When was this property first placed in service for business or rental use? Please provide the date (MM/DD/YYYY)." :
          "What date did you first start using this property for business purposes? (MM/DD/YYYY format please)",
        type: "date",
        field: "placedInServiceDate"
      },
      {
        id: "propertyUse",
        text: randomPropertyUse,
        type: "select",
        field: "propertyUse",
        options: useOptions[propertyType] || useOptions.residential
      },
      {
        id: "improvements",
        text: Math.random() > 0.5 ?
          "Have you made any significant improvements to the property after purchase? If yes, what was the total cost?" :
          "Did you invest in any major renovations or improvements after acquiring the property? What was the total investment?",
        type: "number",
        field: "improvementCosts",
        allowZero: true
      },
      {
        id: "acquisitionMethod",
        text: Math.random() > 0.5 ?
          "How did you acquire this property?" :
          "What was the method of acquisition for this property?",
        type: "select",
        field: "acquisitionMethod",
        options: [
          "Cash purchase",
          "Financed purchase",
          "Inherited property",
          "Received as gift",
          "1031 like-kind exchange",
          "Partnership contribution"
        ]
      },
      {
        id: "taxBracket",
        text: Math.random() > 0.5 ?
          "What's your approximate tax bracket? This helps estimate potential tax savings." :
          "To estimate your tax benefits, what's your current tax bracket?",
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
  };

  // Initialize questions when component mounts
  useEffect(() => {
    const propertyType = propertyData?.propertyType || 'residential';
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
    if (currentQ?.field) {
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
