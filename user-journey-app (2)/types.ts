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
export interface JourneyStep {
  id: string;
  title: string; // The user journey name (e.g., "Intake")
  description: string;
  details?: string;
  iconName: string;
  phase: string;
  metrics?: JourneyMetrics; // Full journey metrics for this step/user journey
}

export interface Journey {
  id: string;
  title: string; // Value Stream name (e.g., "USPB Onboarding")
  description: string;
  valueStreamName?: string;
  metricsStartDate?: string;
  steps: JourneyStep[]; // Each step is a user journey within this value stream
}
