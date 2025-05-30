
import { Question, PropertyType, TaxData, TakeoffsData } from './types';

export const generateQuestions = (propertyType: PropertyType): Question[] => {
  const greetingVariations = [
    "Hi there! I'm your tax and property analysis assistant. Let's gather information for your cost segregation analysis. Ready to begin?",
    "Hello! I'm here to help collect tax details and property information for your analysis. This will take about 10-15 minutes. Shall we start?",
    "Welcome! I'll guide you through tax questions and property takeoffs for your cost segregation study. Let's get started!"
  ];

  const taxQuestions = generateTaxQuestions(propertyType);
  const takeoffsQuestions = generateTakeoffsQuestions(propertyType);

  const randomGreeting = greetingVariations[Math.floor(Math.random() * greetingVariations.length)];

  return [
    {
      id: "greeting",
      text: randomGreeting,
      type: "confirmation",
      options: ["Yes, let's begin", "I have questions first"],
      section: "tax"
    },
    ...taxQuestions,
    {
      id: "tax-completion",
      text: "Great! Now let's gather detailed property information for the cost segregation analysis. This will help us identify all depreciable components.",
      type: "confirmation",
      options: ["Continue to property details"],
      section: "takeoffs"
    },
    ...takeoffsQuestions,
    {
      id: "final-completion",
      text: "Perfect! I've collected all necessary information for your comprehensive cost segregation analysis.",
      type: "summary",
      section: "takeoffs"
    }
  ];
};

const generateTaxQuestions = (propertyType: PropertyType): Question[] => {
  const questions: Question[] = [];

  // Property-specific depreciable basis questions
  if (propertyType === 'residential') {
    const residentialBasisQuestions = [
      "For your residential property, what's the depreciable basis? This excludes land value and includes the building structure.",
      "What's the cost basis for depreciation on this residential rental? Remember to subtract the land portion.",
      "Let's establish the depreciable basis for your residential investment. What's the building value minus land?"
    ];
    questions.push({
      id: "depreciableBasis",
      text: residentialBasisQuestions[Math.floor(Math.random() * residentialBasisQuestions.length)],
      type: "number",
      field: "depreciableBasis",
      section: "tax"
    });
  } else if (propertyType === 'commercial') {
    const commercialBasisQuestions = [
      "For your commercial building, what's the depreciable basis? Include all building improvements but exclude land value.",
      "What's the cost basis for this commercial property that we'll use for depreciation calculations?",
      "Let's determine the depreciable basis for your commercial real estate. What's the total minus land value?"
    ];
    questions.push({
      id: "depreciableBasis",
      text: commercialBasisQuestions[Math.floor(Math.random() * commercialBasisQuestions.length)],
      type: "number",
      field: "depreciableBasis",
      section: "tax"
    });
  } else if (propertyType === 'industrial') {
    const industrialBasisQuestions = [
      "For your industrial facility, what's the depreciable basis? Include building, equipment, and improvements but exclude land.",
      "What's the total depreciable cost basis for this industrial property including all fixed assets?",
      "Let's establish the depreciable basis for your industrial facility. What's the building and equipment value?"
    ];
    questions.push({
      id: "depreciableBasis",
      text: industrialBasisQuestions[Math.floor(Math.random() * industrialBasisQuestions.length)],
      type: "number",
      field: "depreciableBasis",
      section: "tax"
    });
  }

  // Purchase price (consistent across types but with property-specific context)
  const purchasePriceQuestions = [
    "What was the total acquisition cost for this property? This helps validate our depreciable basis calculation.",
    "Could you share the complete purchase price? We use this to ensure accuracy in our analysis.",
    "What was the total amount paid to acquire this property including all closing costs?"
  ];
  questions.push({
    id: "purchasePrice",
    text: purchasePriceQuestions[Math.floor(Math.random() * purchasePriceQuestions.length)],
    type: "number",
    field: "purchasePrice",
    section: "tax"
  });

  // Property-specific use questions
  if (propertyType === 'residential') {
    questions.push({
      id: "propertyUse",
      text: "How do you use this residential property for income generation?",
      type: "select",
      field: "propertyUse",
      options: [
        "Single-family rental",
        "Multi-family rental (2-4 units)",
        "Short-term rental (Airbnb/VRBO)",
        "Section 8 housing",
        "Corporate housing",
        "Rent-to-own arrangement"
      ],
      section: "tax"
    });
  } else if (propertyType === 'commercial') {
    questions.push({
      id: "propertyUse",
      text: "What's the primary commercial use of this property?",
      type: "select",
      field: "propertyUse",
      options: [
        "Office building",
        "Retail center/shopping mall",
        "Restaurant/food service",
        "Medical/dental facility",
        "Hotel/hospitality",
        "Mixed-use commercial"
      ],
      section: "tax"
    });
  } else if (propertyType === 'industrial') {
    questions.push({
      id: "propertyUse",
      text: "What type of industrial operations does this facility support?",
      type: "select",
      field: "propertyUse",
      options: [
        "Manufacturing/production",
        "Warehouse/distribution",
        "Research and development",
        "Heavy machinery operations",
        "Food processing",
        "Chemical/pharmaceutical"
      ],
      section: "tax"
    });
  }

  // Placed in service date
  questions.push({
    id: "placedInService",
    text: "When was this property first placed in service for business use? (MM/DD/YYYY)",
    type: "date",
    field: "placedInServiceDate",
    section: "tax"
  });

  // Property-specific improvement questions
  if (propertyType === 'residential') {
    questions.push({
      id: "improvements",
      text: "Have you made any renovations to this residential property after purchase? Kitchen/bathroom upgrades, flooring, HVAC improvements?",
      type: "number",
      field: "improvementCosts",
      allowZero: true,
      section: "tax"
    });
  } else if (propertyType === 'commercial') {
    questions.push({
      id: "improvements",
      text: "Have you invested in any commercial build-outs, tenant improvements, or facility upgrades after acquisition?",
      type: "number",
      field: "improvementCosts",
      allowZero: true,
      section: "tax"
    });
  } else if (propertyType === 'industrial') {
    questions.push({
      id: "improvements",
      text: "Have you added any equipment, facility modifications, or industrial improvements after acquiring the property?",
      type: "number",
      field: "improvementCosts",
      allowZero: true,
      section: "tax"
    });
  }

  // Standard questions for all property types
  questions.push(
    {
      id: "acquisitionMethod",
      text: "How did you acquire this property?",
      type: "select",
      field: "acquisitionMethod",
      options: [
        "Cash purchase",
        "Financed purchase",
        "Inherited property",
        "Received as gift",
        "1031 like-kind exchange",
        "Partnership contribution"
      ],
      section: "tax"
    },
    {
      id: "taxBracket",
      text: "What's your current tax bracket? This helps estimate potential tax savings from cost segregation.",
      type: "select",
      field: "taxBracket",
      options: [
        "22% (Individual: $41K-$89K, Married: $83K-$178K)",
        "24% (Individual: $89K-$191K, Married: $178K-$340K)",
        "32% (Individual: $191K-$416K, Married: $340K-$431K)",
        "35% (Individual: $416K-$418K, Married: $431K-$647K)",
        "37% (Individual: $418K+, Married: $647K+)"
      ],
      section: "tax"
    }
  );

  return questions;
};

const generateTakeoffsQuestions = (propertyType: PropertyType): Question[] => {
  const questions: Question[] = [];

  // Foundation questions (all property types)
  questions.push({
    id: "foundationMaterial",
    text: "What type of foundation does the building have?",
    type: "select",
    field: "foundationMaterial",
    options: propertyType === 'industrial' 
      ? ["Concrete slab", "Deep foundation with piers", "Reinforced concrete with footings", "Steel reinforced foundation"]
      : ["Concrete slab", "Crawl space", "Full basement", "Pier and beam"],
    section: "takeoffs"
  });

  if (propertyType !== 'residential') {
    questions.push({
      id: "foundationArea",
      text: "What's the approximate foundation area in square feet?",
      type: "number",
      field: "foundationArea",
      section: "takeoffs"
    });
  }

  // Wall construction
  if (propertyType === 'residential') {
    questions.push({
      id: "wallMaterial",
      text: "What's the primary exterior wall construction?",
      type: "select",
      field: "wallMaterial",
      options: ["Wood frame with siding", "Brick veneer", "Stucco", "Stone", "Mixed materials"],
      section: "takeoffs"
    });
  } else if (propertyType === 'commercial') {
    questions.push({
      id: "wallMaterial",
      text: "What's the primary wall construction for this commercial building?",
      type: "select",
      field: "wallMaterial",
      options: ["Steel frame with curtain wall", "Masonry/brick", "Concrete block", "Precast concrete", "Tilt-up concrete"],
      section: "takeoffs"
    });
  } else if (propertyType === 'industrial') {
    questions.push({
      id: "wallMaterial",
      text: "What's the wall construction for this industrial facility?",
      type: "select",
      field: "wallMaterial",
      options: ["Steel frame with metal siding", "Precast concrete panels", "Tilt-up concrete", "Masonry block", "Insulated metal panels"],
      section: "takeoffs"
    });
  }

  // Roofing
  questions.push({
    id: "roofMaterial",
    text: `What type of roofing system does this ${propertyType} property have?`,
    type: "select",
    field: "roofMaterial",
    options: propertyType === 'residential' 
      ? ["Asphalt shingles", "Metal roofing", "Tile roofing", "Slate", "Flat/built-up roof"]
      : propertyType === 'industrial'
      ? ["Single-ply membrane", "Built-up roof (BUR)", "Metal roofing", "Modified bitumen", "Spray foam roof"]
      : ["Single-ply membrane (TPO/EPDM)", "Built-up roof", "Modified bitumen", "Metal roofing", "Green roof system"],
    section: "takeoffs"
  });

  // HVAC Systems
  if (propertyType === 'residential') {
    questions.push({
      id: "hvacSystemType",
      text: "What heating and cooling systems are installed?",
      type: "select",
      field: "hvacSystemType",
      options: ["Central air with furnace", "Heat pump system", "Ductless mini-split", "Radiant heating", "Window/wall units"],
      section: "takeoffs"
    });
  } else if (propertyType === 'commercial') {
    questions.push({
      id: "hvacSystemType",
      text: "What type of HVAC system serves this commercial building?",
      type: "select",
      field: "hvacSystemType",
      options: ["Rooftop units (RTU)", "Central chiller/boiler", "Variable Air Volume (VAV)", "Heat pump system", "Split system units"],
      section: "takeoffs"
    });
    questions.push({
      id: "hvacZones",
      text: "How many HVAC zones does the building have?",
      type: "number",
      field: "hvacZones",
      section: "takeoffs"
    });
  } else if (propertyType === 'industrial') {
    questions.push({
      id: "hvacSystemType",
      text: "What HVAC systems are installed in this industrial facility?",
      type: "select",
      field: "hvacSystemType",
      options: ["Industrial air handlers", "Process ventilation", "Warehouse heating units", "Clean room systems", "Basic ventilation only"],
      section: "takeoffs"
    });
  }

  // Electrical systems
  questions.push({
    id: "electricalSystemType",
    text: `What's the electrical service capacity for this ${propertyType} property?`,
    type: "select",
    field: "electricalSystemType",
    options: propertyType === 'residential' 
      ? ["100 amp service", "200 amp service", "400 amp service", "Upgraded panel with subpanels"]
      : propertyType === 'industrial'
      ? ["480V three-phase service", "High voltage distribution", "Multiple transformers", "Emergency backup systems"]
      : ["208V three-phase", "480V service", "Emergency generator backup", "Uninterruptible power supply (UPS)"],
    section: "takeoffs"
  });

  // Property-specific specialized questions
  if (propertyType === 'industrial') {
    questions.push(
      {
        id: "loadingDockCount",
        text: "How many loading docks does the facility have?",
        type: "number",
        field: "loadingDockCount",
        allowZero: true,
        section: "takeoffs"
      },
      {
        id: "craneDetails",
        text: "Are there any overhead cranes or specialized lifting equipment?",
        type: "text",
        field: "craneDetails",
        section: "takeoffs"
      },
      {
        id: "specialtySystemsDetails",
        text: "Describe any specialty systems (compressed air, process piping, chemical handling, etc.)",
        type: "text",
        field: "specialtySystemsDetails",
        section: "takeoffs"
      }
    );
  }

  if (propertyType === 'commercial') {
    questions.push({
      id: "specialEquipment",
      text: "What specialized equipment or systems are permanently installed? (elevators, escalators, commercial kitchen, etc.)",
      type: "text",
      field: "specialEquipment",
      section: "takeoffs"
    });
  }

  // Flooring and finishes
  questions.push({
    id: "flooringTypes",
    text: `What are the primary flooring types in this ${propertyType} property?`,
    type: "text",
    field: "flooringTypes",
    section: "takeoffs"
  });

  // Lighting
  questions.push({
    id: "lightingTypes",
    text: "What types of lighting systems are installed throughout the property?",
    type: "select",
    field: "lightingTypes",
    options: propertyType === 'industrial'
      ? ["High-bay LED fixtures", "Fluorescent industrial", "Metal halide", "Emergency/safety lighting", "Mixed lighting types"]
      : propertyType === 'commercial'
      ? ["LED troffer fixtures", "Track lighting", "Decorative fixtures", "Emergency lighting", "Mixed commercial lighting"]
      : ["Recessed can lights", "Pendant fixtures", "Ceiling fans with lights", "Under-cabinet lighting", "Mixed residential lighting"],
    section: "takeoffs"
  });

  // Site work and landscaping
  questions.push(
    {
      id: "pavingArea",
      text: "What's the approximate area of paved surfaces (parking lots, driveways, walkways)?",
      type: "number",
      field: "pavingArea",
      section: "takeoffs"
    },
    {
      id: "landscapingDetails",
      text: "Describe the landscaping features (irrigation systems, trees, decorative elements, etc.)",
      type: "text",
      field: "landscapingDetails",
      section: "takeoffs"
    },
    {
      id: "fencingDetails",
      text: "What type of fencing or security features are present around the property?",
      type: "text",
      field: "fencingDetails",
      section: "takeoffs"
    }
  );

  return questions;
};
