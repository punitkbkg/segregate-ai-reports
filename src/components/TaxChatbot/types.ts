
export interface TaxData {
  depreciableBasis?: string;
  purchasePrice?: string;
  placedInServiceDate?: string;
  propertyUse?: string;
  improvementCosts?: string;
  acquisitionMethod?: string;
  taxBracket?: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'text' | 'number' | 'date' | 'select' | 'confirmation' | 'summary' | 'completion';
  field?: keyof TaxData;
  options?: string[];
  allowZero?: boolean;
  condition?: (data: TaxData) => boolean;
}

export interface Message {
  type: 'bot' | 'user';
  text: string;
  timestamp: Date;
  inputType?: string;
  options?: string[];
}

export type PropertyType = 'residential' | 'commercial' | 'industrial';
