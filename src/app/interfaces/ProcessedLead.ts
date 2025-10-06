export interface ProcessedLead {
    Name: string;
    Phone: string;
    Address: string;
    recommendedPackage: string;
    recommendedServices: string[];
    personalizedMessage: string;
    priority: 'high' | 'medium' | 'low';
    estimatedBudget: string;
    sent?: boolean;
}

export interface ApiResponse {
  success: boolean;
  total: number;
  statistics: {
    total: number;
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
    withPhone: number;
    withoutPhone: number;
  };
  data: ProcessedLead[];
}