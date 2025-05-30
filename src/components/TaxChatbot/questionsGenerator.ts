
import { Question, PropertyType } from './types';

export const generateQuestions = (propertyType: PropertyType): Question[] => {
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
