export type VastuZoneName =
  | 'North-East (NE / Ishanya)'
  | 'East (Purva)'
  | 'South-East (SE / Agni)'
  | 'South (Dakshin)'
  | 'South-West (SW / Nairutya)'
  | 'West (Paschim)'
  | 'North-West (NW / Vayavya)'
  | 'North (Uttar)'
  | 'Center (Brahma Sthan)';

export type ElementType = 'Water' | 'Fire' | 'Earth' | 'Air' | 'Space';

export interface RoomAssessment {
  id: string;
  roomName: string;
  detectedZone: VastuZoneName;
  idealZone: string;
  status: 'compliant' | 'neutral' | 'defective';
  score: number; // 0 - 100
  element: ElementType;
  rulingDeity: string;
  findings: string;
  energyImpact: string;
  recommendedRemedy?: string;
  structuralRecommendation?: string;
  compatibleActivities?: string[];
  prohibitedActivities?: string[];
  coordinates?: { x: number; y: number }; // percentage position on floor plan
}

export interface StructuralRemedy {
  actionType: 'Activity Relocation' | 'Wall/Door Realignment' | 'Level & Slope Alteration' | 'Structural Beam Encasement' | 'Plumbing / Wet Stack Reroute' | 'Fenestration Adjustment';
  currentActivity?: string; // e.g. "Cooking / Stove Fire Zone" or "Toilet / Sewage Drainage"
  recommendedActivity: string; // which type of activity place
  prohibitedActivity: string; // incompatible activities
  structuralSteps: string[]; // civil/architectural actions
  civilConsiderations: string; // masonry, plumbing, non-loadbearing notes
  renovationUrgency: 'High (Immediate Renovation Priority)' | 'Medium (Phase 2 Remodeling)' | 'Optional Architectural Upgrade';
}

export interface VastuDosha {
  id: string;
  title: string;
  severity: 'critical' | 'moderate' | 'minor';
  zone: VastuZoneName;
  elementImbalance: string;
  description: string;
  lifeImpact: string; // Wealth, Health, Mental Peace, Career, Relationships
  remedyCategory: 'non-structural' | 'rearrangement' | 'color_elemental' | 'structural';
  remedyTitle: string;
  actionableSteps: string[];
  remedyMaterials: string[]; // e.g. "Brass Helix", "Himalayan Rock Salt", "Lead Wire"
  structuralRemedy?: StructuralRemedy;
}

export interface ZoneActivityPlacementRule {
  zoneKey: string;
  zoneName: string;
  direction: string;
  element: string;
  rulingDeity: string;
  primaryEnergy: string;
  auspiciousActivities: {
    activity: string;
    description: string;
    auspiciousGrade: 'Param Shubh (Most Ideal)' | 'Shubh (Auspicious)';
  }[];
  prohibitedActivities: {
    activity: string;
    doshaConsequence: string;
    severity: 'Severe Dosha' | 'Moderate Imbalance';
  }[];
  structuralCureIfMisplaced: string;
}

export interface ElementBalance {
  element: ElementType;
  sanskritName: string;
  percentage: number; // 0 - 100
  status: 'balanced' | 'deficient' | 'excessive';
  zoneRepresented: string;
  significance: string;
}

export interface EnergyFlowRecommendation {
  id: string;
  category: 'Wealth & Prosperity' | 'Health & Vitality' | 'Peace & Harmony' | 'Career Growth';
  action: string;
  priority: 'High' | 'Medium' | 'Low';
  effort: 'Simple (No Construction)' | 'Furniture Shift' | 'Minor Adjustment';
}

export interface VastuAnalysisReport {
  overallScore: number; // 0 - 100
  vastuGrade: 'A+ (Param Shubh)' | 'A (Shubh / Auspicious)' | 'B+ (Madhyam / Acceptable)' | 'C (Shodhan Required)';
  orientation: string; // e.g. "North Facing", "East Facing"
  placeName?: string;
  pranaEnergyVerdict: string;
  executiveSummary: string;
  roomAssessments: RoomAssessment[];
  detectedDoshas: VastuDosha[];
  elementBalances: ElementBalance[];
  energyFlowRecommendations: EnergyFlowRecommendation[];
  quickWins: string[];
  brahmasthanStatus: {
    isOpen: boolean;
    verdict: string;
    advice: string;
  };
  entranceStatus: {
    zone: string;
    padaVerdict: string;
    recommendation: string;
  };
  zoneActivityMatrix?: ZoneActivityPlacementRule[];
}

export interface SampleFloorPlan {
  id: string;
  title: string;
  tagline: string;
  type: string;
  imageSrc: string;
  facing: string;
  roomsCount: string;
  description: string;
}
