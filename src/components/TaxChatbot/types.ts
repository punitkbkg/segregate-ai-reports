
export interface TaxData {
  depreciableBasis?: string;
  purchasePrice?: string;
  placedInServiceDate?: string;
  propertyUse?: string;
  improvementCosts?: string;
  acquisitionMethod?: string;
  taxBracket?: string;
}

export interface TakeoffsData {
  // Building components
  foundationMaterial?: string;
  foundationArea?: string;
  wallMaterial?: string;
  wallArea?: string;
  roofMaterial?: string;
  roofArea?: string;
  
  // MEP Systems
  electricalSystemType?: string;
  electricalCapacity?: string;
  plumbingSystemType?: string;
  hvacSystemType?: string;
  hvacZones?: string;
  
  // Finishes and fixtures
  flooringTypes?: string;
  lightingTypes?: string;
  specialEquipment?: string;
  
  // Commercial/Industrial specific
  loadingDockCount?: string;
  craneDetails?: string;
  specialtySystemsDetails?: string;
  
  // Landscaping and site work
  pavingArea?: string;
  landscapingDetails?: string;
  fencingDetails?: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'date' | 'select' | 'confirmation' | 'summary' | 'completion';
  field?: keyof (TaxData & TakeoffsData);
  options?: string[];
  allowZero?: boolean;
  condition?: (data: TaxData & TakeoffsData) => boolean;
  section?: 'tax' | 'takeoffs';
}

export interface Message {
  type: 'bot' | 'user';
  text: string;
  timestamp: Date;
  inputType?: string;
  options?: string[];
}

export type PropertyType = 'residential' | 'commercial' | 'industrial' | 'mixed-use';
