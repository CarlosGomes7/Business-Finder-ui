export interface Business {
    id: string;
    name: string;
    address: string;
    phone?: string;
    website?: string;
    rating?: number;
    totalRatings?: number;
    hasWebsite: boolean;
    types: string[];
    location: { lat: number; lng: number };
}

export interface SearchResults {
    total: number;
    withoutWebsite: number;
    withWebsite: number;
    businesses: {
        withoutWebsite: Business[];
        withWebsite: Business[];
        all: Business[];
    };
}

export interface BusinessType {
  value: string;
  label: string;
}