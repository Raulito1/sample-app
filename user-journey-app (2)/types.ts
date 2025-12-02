export interface StepMetric {
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
}

export interface SignatureData {
  action: string;
  env: string;
  name?: string;
  region?: string;
  role?: string;
  windowname?: string;
  xpath?: string;
  message?: string;
  data?: unknown[];
  capture?: string;
}

export interface StepSignatures {
  startSignature?: SignatureData[];
  endSignature?: SignatureData[];
  abandonSignature?: SignatureData[];
  saveSignature?: SignatureData[];
  uniqueSignature?: SignatureData[];
  reworkSignature?: SignatureData[];
  stageSignatures?: SignatureData[];
  groupingSignature?: SignatureData[];
}

export interface JourneyStep {
  id: string;
  title: string;
  description: string;
  details?: string; // Expanded explanation of the step
  metrics?: StepMetric[]; // Analytics data
  signatures?: StepSignatures; // Structured technical event tracking data
  iconName: string; // Used to map to Lucide icons
  phase: string; // e.g., "Discovery", "Action", "Retention"
}

export interface Journey {
  id: string;
  title: string;
  description: string;
  valueStreamName?: string;
  metricsStartDate?: string;
  steps: JourneyStep[];
}
