export interface StepMetric {
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
}

export interface JourneyMetrics {
  valueStream: string;
  userJourney: string;
  date: string;
  totals: {
    totalSequences: number;
    completedSequences: number;
    abandonedSequences: number;
    abandonRate: number;
    uniqueUsers: number;
    avgSequencesPerUser: number;
  };
  reasons: {
    userAbandoned: number;
    userSaved: number;
    incomplete: number;
    newStart: number;
  };
  length: {
    avgLength: number;
    medianLength: number;
    minLength: number;
    maxLength: number;
  };
  friction: {
    sequencesExperiencingFriction: number;
    uniqueUsersExperiencingFriction: number;
    avgUsersExperiencingFriction: number;
    avgFrictionEventsPerSequence: number;
    medianFrictionEventsPerSequence: number;
    minFrictionEventsPerSequence: number;
    maxFrictionEventsPerSequence: number;
    mostCommonError: string;
    mostCommonStepForError: string;
  };
  contextSwitching: {
    sequencesWithContextSwitches: number;
    uniqueUsersContextSwitching: number;
    avgUsersContextSwitching: number;
    avgContextSwitchesPerSequence: number;
    medianContextSwitchesPerSequence: number;
    minContextSwitchesPerSequence: number;
    maxContextSwitchesPerSequence: number;
    mostCommonContextSwitch: string;
    mostCommonStepForContextSwitch: string;
  };
  durations: {
    mostCommonLongestDurationStep: string;
    avgDuration: number;
    avgDurationOutliersRemoved: number;
    medianDuration: number;
    medianDurationOutliersRemoved: number;
    stdDuration: number;
    stdDurationOutliersRemoved: number;
    minDuration: number;
    minDurationOutliersRemoved: number;
    maxDuration: number;
    maxDurationOutliersRemoved: number;
    avgStepDuration: number;
    medianStepDuration: number;
    stdStepDuration: number;
    mostCommonSequenceLength: number;
    medianDurationAtStep: string;
  };
  pageDurations: { page: string; avgMs: number }[];
  highRiskPattern: {
    pattern: string[];
    abandonRate: number;
    totalOccurrences: number;
    rateByOccurrences: number;
  };
}

export interface SignatureData {
  action: string;
  env: string;
  landmarks?: { role?: string; name?: string }[];
  name?: string;
  region?: string;
  role?: string;
  regex?: string;
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

export interface Journey extends StepSignatures {
  id: string;
  title: string;
  description: string;
  valueStreamName?: string;
  journeyName?: string;
  metricsStartDate?: string;
  metrics?: JourneyMetrics;
  steps: JourneyStep[];
}
