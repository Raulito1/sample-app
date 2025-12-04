import { Journey, JourneyMetrics, StepSignatures } from "./types";

export const ANIMATION_DELAY_MS = 800; // Time between each step appearing

const USPB_INTAKE_SIGNATURES: StepSignatures = {
  startSignature: [
    {
      action: "click",
      env: "PROD",
      landmarks: [
        {
          role: "",
          name: "",
        },
      ],
      name: "",
      region: "NAMR",
      role: "button",
      windowname: "OnBoardingWindow",
      xpath: "",
    },
  ],

  endSignature: [
    {
      action: "click",
      env: "PROD",
      name: "",
      region: "NAMR",
      role: "button",
      windowname: "OnBoardingWindow",
    },
  ],

  abandonSignature: [
    {
      action: "click",
      env: "PROD",
      name: "Yes",
      region: "NAMR",
      role: "button",
      windowname: "OnBoardingWindow",
      xpath: "",
    },
  ],

  saveSignature: [
    {
      action: "click",
      env: "PROD",
      name: "Continue",
      region: "NAMR",
      role: "button",
      windowname: "",
      xpath: "",
    },
  ],

  uniqueSignature: [
    {
      action: "console-info",
      env: "PROD",
      message: "PB Intake Onboarding App",
      data: [{}],
      region: "NAMR",
      windowname: "",
      capture: "data",
    },
  ],

  reworkSignature: [],

  stageSignatures: [],

  groupingSignature: [
    {
      action: "change",
      env: "PROD",
      landmarks: [
        {
          name: "What products would the client like.*",
          role: "tabpanel",
        },
      ],
      name: "(.*)",
      region: "NAMR",
      role: "checkbox",
      windowname: "",
      regex: "landmarks",
      capture: "name",
    },
  ],
};

const USPB_INTAKE_METRICS: JourneyMetrics = {
  valueStream: "Onboarding",
  userJourney: "Intake",
  date: "20251006",
  totals: {
    totalSequences: 853,
    completedSequences: 329,
    abandonedSequences: 494,
    abandonRate: 0.6,
    uniqueUsers: 331,
    avgSequencesPerUser: 2.6,
  },
  reasons: {
    userAbandoned: 59,
    userSaved: 210,
    incomplete: 217,
    newStart: 8,
  },
  length: {
    avgLength: 135,
    medianLength: 104,
    minLength: 2,
    maxLength: 1026,
  },
  friction: {
    sequencesExperiencingFriction: 800,
    uniqueUsersExperiencingFriction: 330,
    avgUsersExperiencingFriction: 99.7,
    avgFrictionEventsPerSequence: 59,
    medianFrictionEventsPerSequence: 34,
    minFrictionEventsPerSequence: 0,
    maxFrictionEventsPerSequence: 4974,
    mostCommonError: "There is no data to display",
    mostCommonStepForError: "",
  },
  contextSwitching: {
    sequencesWithContextSwitches: 736,
    uniqueUsersContextSwitching: 328,
    avgUsersContextSwitching: 99.1,
    avgContextSwitchesPerSequence: 12,
    medianContextSwitchesPerSequence: 6,
    minContextSwitchesPerSequence: 0,
    maxContextSwitchesPerSequence: 208,
    mostCommonContextSwitch: "",
    mostCommonStepForContextSwitch: "",
  },
  durations: {
    mostCommonLongestDurationStep: "",
    avgDuration: 2987,
    avgDurationOutliersRemoved: 1399,
    medianDuration: 927,
    medianDurationOutliersRemoved: 684,
    stdDuration: 5645,
    stdDurationOutliersRemoved: 1536,
    minDuration: 16.246,
    minDurationOutliersRemoved: 16.246,
    maxDuration: 56583.262,
    maxDurationOutliersRemoved: 6450.471,
    avgStepDuration: 19,
    medianStepDuration: 2,
    stdStepDuration: 370,
    mostCommonSequenceLength: 5,
    medianDurationAtStep: "",
  },
  pageDurations: [
    { page: "", avgMs: 3654.96 },
    { page: "", avgMs: 3421.69 },
    { page: "AO Intake", avgMs: 2796.98 },
    { page: "Onboarding Admin Tool", avgMs: 1262.03 },
    { page: "Alternatives Redemptions", avgMs: 767.38 },
    { page: "Client Create", avgMs: 356.94 },
    { page: "Regulatory Tool", avgMs: 276.56 },
    { page: "Add Authorities and Limits", avgMs: 193.86 },
    { page: "Deposit Rate Exception", avgMs: 168.15 },
    { page: "Suitability Web Component React", avgMs: 124.48 },
    { page: "Pbao Beneficiary", avgMs: 103.11 },
    { page: "Modify Phone/Email", avgMs: 96.29 },
    { page: "Modify Demographics", avgMs: 75.25 },
    { page: "Address Change", avgMs: 53.12 },
    { page: "Coverage COB", avgMs: 29.56 },
    { page: "Reg Volcker", avgMs: 24.83 },
    { page: "", avgMs: 18.61 },
    { page: "Onglobal Preacceptance", avgMs: 6.95 },
  ],
  highRiskPattern: {
    pattern: ["focus OnBoardingWindow"],
    abandonRate: 0.72,
    totalOccurrences: 4105,
    rateByOccurrences: 2938,
  },
};

export const SAMPLE_JOURNEYS: Journey[] = [
  {
    id: "uspb-onboarding-intake",
    title: "Intake",
    journeyName: "Intake",
    description:
      "USPB Onboarding Intake journey mock data aligned to signature schema with each signature as a step.",
    valueStreamName: "USPB Onboarding",
    metricsStartDate: "20250901",
    metrics: USPB_INTAKE_METRICS,
    ...USPB_INTAKE_SIGNATURES,
    steps: [
      {
        id: "step-start",
        title: "Start",
        description: "Start signature",
        iconName: "Power",
        phase: "Intake",
        signatures: { startSignature: USPB_INTAKE_SIGNATURES.startSignature },
      },
      {
        id: "step-end",
        title: "End",
        description: "End signature",
        iconName: "CheckCircle",
        phase: "Intake",
        signatures: { endSignature: USPB_INTAKE_SIGNATURES.endSignature },
      },
      {
        id: "step-abandon",
        title: "Abandon",
        description: "Abandon signature",
        iconName: "LogOut",
        phase: "Intake",
        signatures: { abandonSignature: USPB_INTAKE_SIGNATURES.abandonSignature },
      },
      {
        id: "step-save",
        title: "Save",
        description: "Save signature",
        iconName: "Save",
        phase: "Intake",
        signatures: { saveSignature: USPB_INTAKE_SIGNATURES.saveSignature },
      },
      {
        id: "step-unique",
        title: "Unique",
        description: "Unique signature",
        iconName: "Fingerprint",
        phase: "Intake",
        signatures: { uniqueSignature: USPB_INTAKE_SIGNATURES.uniqueSignature },
      },
      {
        id: "step-grouping",
        title: "Grouping",
        description: "Grouping signature",
        iconName: "LayoutGrid",
        phase: "Intake",
        signatures: { groupingSignature: USPB_INTAKE_SIGNATURES.groupingSignature },
      },
    ],
  },
];

export const SUGGESTED_TOPICS = [
  "New Employee Onboarding",
  "SaaS Free Trial to Paid",
  "Customer Support Ticket Resolution",
  "Mobile App First Launch",
  "Online Course Completion",
];
