// src/types/PlantData.ts

export type SeasonType = "spring" | "summer" | "fall" | "winter";
export type LightRequirement = "full_sun" | "partial_sun" | "partial_shade" | "full_shade";
export type WaterAmount = "low" | "medium" | "high";
export type SoilType = "clay" | "loam" | "sand" | "silt";
export type DrainageLevel = "poor" | "medium" | "good" | "excellent";
export type FertilityLevel = "low" | "medium" | "high";
export type PlantType = "annual" | "perennial" | "biennial" | "bulb";
export type GrowthRate = "slow" | "medium" | "fast";
export type PlantingMethod = "seed" | "cutting" | "bulb" | "transplant";
export type FertilizerType = "organic" | "synthetic" | "both";
export type PruningFrequency = "weekly" | "monthly" | "seasonal" | "annual";
export type PruningMethod = "deadhead" | "pinching" | "cutting" | "shaping";
export type SupportType = "stake" | "trellis" | "cage" | "wall";
export type DifficultyLevel = "beginner" | "intermediate" | "advanced" | "expert";
export type GrowingLocation = "indoor" | "outdoor" | "greenhouse" | "balcony";
export type ProblemSeverity = "minor" | "moderate" | "severe";
export type DiseaseType = "fungal" | "bacterial" | "viral" | "nutritional";
export type HealthStatus = "healthy" | "stressed" | "diseased" | "dying";
export type PlantLocation = "leaves" | "stems" | "flowers" | "roots" | "overall";
export type ToleranceLevel = "low" | "medium" | "high";

export interface PlantCharacteristics {
  type: PlantType;
  lifespan: number;              // years, -1 for indefinite
  maxHeight: number;             // cm
  maxWidth: number;              // cm
  growthRate: GrowthRate;
  hardiness: {
    minTemperature: number;      // °C
    maxTemperature: number;      // °C
    zones: number[];             // USDA zones [9,10,11]
  };
}

export interface LightRequirements {
  requirement: LightRequirement;
  hoursMin: number;              // minimum hours of direct sunlight
  hoursMax: number;              // maximum hours of direct sunlight
}

export interface WaterRequirements {
  frequency: number;             // days between watering
  amount: WaterAmount;
  seasonal: {
    spring: number;              // days between watering
    summer: number;
    fall: number;
    winter: number;
  };
  drainageRequired: boolean;
}

export interface SoilRequirements {
  ph: [number, number];          // [6.0, 7.5] pH range
  type: SoilType[];
  drainage: DrainageLevel;
  fertilityRequired: FertilityLevel;
}

export interface TemperatureRequirements {
  optimal: [number, number];     // [18, 24] °C
  minimum: number;               // °C
  maximum: number;               // °C
  frostTolerant: boolean;
}

export interface HumidityRequirements {
  optimal: [number, number];     // [40, 60] percentage
  tolerance: ToleranceLevel;
}

export interface GrowingRequirements {
  light: LightRequirements;
  water: WaterRequirements;
  soil: SoilRequirements;
  temperature: TemperatureRequirements;
  humidity: HumidityRequirements;
}

export interface PlantingInfo {
  method: PlantingMethod[];
  seasons: SeasonType[];
  indoorStart: boolean;
  outdoorDirect: boolean;
  seedDepth: number | null;      // cm, null if not applicable
  spacing: number;               // cm between plants
}

export interface PlantTimeline {
  germination: number;           // days
  seedling: number;              // days
  vegetative: number;            // days
  flowering: number;             // days from planting
  fruiting?: number;             // days from planting
  harvest?: number;              // days from planting
}

export interface FertilizingInfo {
  required: boolean;
  frequency: number;             // weeks
  seasons: SeasonType[];
  type: FertilizerType;
  npkRatio?: string;             // "10-10-10"
}

export interface PruningInfo {
  required: boolean;
  frequency: PruningFrequency;
  seasons: SeasonType[];
  method: PruningMethod;
}

export interface SupportInfo {
  required: boolean;
  type?: SupportType;
}

export interface CareInfo {
  fertilizing: FertilizingInfo;
  pruning: PruningInfo;
  support: SupportInfo;
}

export interface CultivationInfo {
  planting: PlantingInfo;
  timeline: PlantTimeline;
  care: CareInfo;
}

export interface FloweringInfo {
  occurs: boolean;
  seasons: SeasonType[];
  duration: number;              // days
  repeatBloomer: boolean;
}

export interface FruitingInfo {
  occurs: boolean;
  seasons?: SeasonType[];
  edible?: boolean;
}

export interface DormancyInfo {
  occurs: boolean;
  seasons?: SeasonType[];
}

export interface LifecycleInfo {
  activeSeasons: SeasonType[];
  flowering: FloweringInfo;
  fruiting: FruitingInfo;
  dormancy: DormancyInfo;
}

export interface Problem {
  name: string;
  symptoms: string[];
  causes: string[];
  solutions: string[];
  prevention: string[];
  severity: ProblemSeverity;
  commonInSeasons?: SeasonType[];
}

export interface Pest {
  name: string;
  scientificName?: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  severity: ProblemSeverity;
}

export interface Disease {
  name: string;
  type: DiseaseType;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
  severity: ProblemSeverity;
}

export interface VisualIndicator {
  description: string;
  healthStatus: HealthStatus;
  colorPattern: string;         // hex color or description
  location: PlantLocation;
  meaning: string;
}

export interface HealthInfo {
  commonProblems: Problem[];
  pests: Pest[];
  diseases: Disease[];
  visualIndicators: VisualIndicator[];
}

export interface PlantProperties {
  edible: boolean;
  medicinal: boolean;
  toxic: boolean;
  aromatic: boolean;
  airPurifying?: boolean;
  petSafe: boolean;
}

export interface DifficultyInfo {
  level: DifficultyLevel;
  factors: string[];            // ["requires_specific_ph", "sensitive_to_overwater"]
}

export interface SpaceInfo {
  suitableFor: GrowingLocation[];
  containerGrowing: boolean;
  minimumContainerSize?: number; // liters
}

export interface PlantMetadata {
  articlePath: string;          // "/hibiscus/"
  images: string[];
  lastUpdated: string;          // ISO date
  verified: boolean;
}

// Main interface
export interface PlantData {
  // Basic identification
  id: string;                   // "hibiscus-rosa-sinensis"
  commonName: string;           // "Hibiscus"
  scientificName: string;       // "Hibiscus rosa-sinensis"
  family: string;               // "Malvaceae"
  category: string;             // "flowering-shrub"
  
  // Plant characteristics
  characteristics: PlantCharacteristics;
  
  // Growing requirements
  growing: GrowingRequirements;
  
  // Planting and care timeline
  cultivation: CultivationInfo;
  
  // Lifecycle and seasons
  lifecycle: LifecycleInfo;
  
  // Health and problems
  health: HealthInfo;
  
  // Additional properties
  properties: PlantProperties;
  
  // Growing difficulty and space
  difficulty: DifficultyInfo;
  space: SpaceInfo;
  
  // Reference to existing content
  metadata: PlantMetadata;
}

// Helper types for common operations
export type PlantId = string;
export type CategoryId = string;

// Validation helpers
export const isValidSeason = (season: string): season is SeasonType => {
  return ["spring", "summer", "fall", "winter"].includes(season);
};

export const isValidDifficultyLevel = (level: string): level is DifficultyLevel => {
  return ["beginner", "intermediate", "advanced", "expert"].includes(level);
};

// Export default for convenience
export default PlantData;