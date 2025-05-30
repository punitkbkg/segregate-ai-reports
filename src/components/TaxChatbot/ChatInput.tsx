
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  inputType: string;
  selectOptions: string[];
  isTyping: boolean;
  onUserResponse: (response: string) => void;
  onComplete: () => void;
}

const ChatInput = ({ inputType, selectOptions, isTyping, onUserResponse, onComplete }: ChatInputProps) => {
  const [userInput, setUserInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim()) {
      onUserResponse(userInput);
      setUserInput("");
    }
  };

  const handleSelectResponse = (value: string) => {
    onUserResponse(value);
  };

  if (isTyping) return null;

  if (inputType === "select" && selectOptions.length > 0) {
    return (
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
    );
  }

  if (inputType === "confirmation") {
    return (
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
    );
  }

  if (inputType === "completion") {
    return (
      <Button onClick={onComplete} className="w-full" size="lg">
        Complete Tax Information Collection
      </Button>
    );
  }

  if (["text", "number", "date"].includes(inputType)) {
    return (
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
    );
  }

  return null;
};

export default ChatInput;
