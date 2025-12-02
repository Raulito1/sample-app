import { Journey } from "./types";

export const ANIMATION_DELAY_MS = 800; // Time between each step appearing

export const SAMPLE_JOURNEYS: Journey[] = [
  {
    id: "kyc-journey-1",
    title: "Global Markets Onboarding",
    description: "End-to-end KYC Review process for EMEA region.",
    valueStreamName: "Global Markets Onboarding",
    metricsStartDate: "20250901",
    steps: [
      {
        id: "step-start",
        title: "Start KYC Review",
        description: "Analyst initiates the review process.",
        details:
          "The user begins the KYC review from the main dashboard. This initializes the session and loads the client context.",
        iconName: "Play",
        phase: "Initiation",
        signatures: {
          startSignature: [
            {
              action: "click",
              env: "PROD",
              name: "Start KYC",
              region: "EMEA",
              role: "button",
              windowname: "KYCReviewWindow",
              xpath: "/html/body/div[1]/app-root/div/kyc-review/div/button[1]",
            },
          ],
        },
        metrics: [
          { label: "Load Time", value: "1.2s", trend: "neutral" },
          { label: "Daily Starts", value: "1,240", trend: "up" },
        ],
      },
      {
        id: "step-client-type",
        title: "Client Classification",
        description: "Select client entity type.",
        details:
          "User segments the client (e.g., Financial Institution, Corporate). This drives the subsequent requirements logic.",
        iconName: "Users",
        phase: "Data Capture",
        signatures: {
          groupingSignature: [
            {
              action: "change",
              env: "PROD",
              name: "Client Type",
              region: "EMEA",
              role: "dropdown",
              windowname: "KYCReviewWindow",
              capture: "name",
            },
          ],
        },
        metrics: [
          { label: "Selection Time", value: "4.5s", trend: "down" },
          { label: "Error Rate", value: "0.8%", trend: "up" },
        ],
      },
      {
        id: "step-save",
        title: "Save Progress",
        description: "Intermediate save of review data.",
        details:
          "Ensures data persistence during long review sessions. Frequent auto-saves or manual saves occur here.",
        iconName: "Save",
        phase: "Processing",
        signatures: {
          saveSignature: [
            {
              action: "click",
              env: "PROD",
              name: "Save Progress",
              region: "EMEA",
              role: "button",
              windowname: "KYCReviewWindow",
            },
            {
              action: "click",
              env: "PROD",
              name: "Auto-Save Trigger",
              region: "EMEA",
              role: "system",
              windowname: "BackgroundWorker",
            },
          ],
        },
        metrics: [
          { label: "Avg Saves/Session", value: "3.5", trend: "neutral" },
          { label: "Data Integrity", value: "100%", trend: "up" },
        ],
      },
      {
        id: "step-ticket",
        title: "Ticket Generation",
        description: "System generates review ticket.",
        details:
          "A unique ticket ID is created in the backend system for audit trails and tracking purposes.",
        iconName: "FileText",
        phase: "Processing",
        signatures: {
          uniqueSignature: [
            {
              action: "console-info",
              env: "PROD",
              message: "KYC Review Ticket Created",
              region: "EMEA",
              windowname: "KYCReviewWindow",
              capture: "data",
              data: [{ ticketId: "(KYC-\\d+)" }],
            },
          ],
        },
        metrics: [
          { label: "API Latency", value: "240ms", trend: "down" },
          { label: "Tickets/Hour", value: "85", trend: "up" },
        ],
      },
      {
        id: "step-validation",
        title: "Pre-Check Validation",
        description: "Automated compliance checks run.",
        details:
          "System validates entered data against external watchlists and internal policy rules before allowing submission.",
        iconName: "Shield",
        phase: "Validation",
        signatures: {
          stageSignatures: [
            {
              action: "console-info",
              env: "PROD",
              message: "Validation Stage Initiated",
              region: "EMEA",
              windowname: "KYCReviewWindow",
            },
            {
              action: "api-call",
              env: "PROD",
              name: "Watchlist Check",
              region: "EMEA",
              role: "service",
            },
          ],
        },
        metrics: [
          { label: "Auto-Pass Rate", value: "64%", trend: "up" },
          { label: "False Positives", value: "12%", trend: "down" },
        ],
      },
      {
        id: "step-rework",
        title: "Amend / Rework",
        description: "Corrections made based on validation.",
        details:
          "If validation fails, the user must revisit previous sections to correct data or add missing documents.",
        iconName: "Wrench",
        phase: "Correction",
        signatures: {
          reworkSignature: [
            {
              action: "click",
              env: "PROD",
              name: "Edit Client Details",
              region: "EMEA",
              role: "button",
              windowname: "KYCReviewWindow",
              xpath:
                "/html/body/div[1]/app-root/div/kyc-review/div/button[edit]",
            },
          ],
        },
        metrics: [
          { label: "Rework Rate", value: "15%", trend: "down" },
          { label: "Time to Fix", value: "2m", trend: "neutral" },
        ],
      },
      {
        id: "step-complete",
        title: "Complete Review",
        description: "Final submission of the KYC package.",
        details:
          "The analyst signs off on the review. This triggers downstream compliance checks and notifications.",
        iconName: "CheckCircle",
        phase: "Completion",
        signatures: {
          endSignature: [
            {
              action: "click",
              env: "PROD",
              name: "Complete Review",
              region: "EMEA",
              role: "button",
              windowname: "KYCReviewWindow",
              xpath: "/html/body/div[1]/app-root/div/kyc-review/div/button[1]",
            },
          ],
        },
        metrics: [
          { label: "Completion Rate", value: "92%", trend: "up" },
          { label: "Avg Handle Time", value: "14m", trend: "down" },
        ],
      },
      {
        id: "step-abandon",
        title: "Exit / Abandon",
        description: "User exits before completion.",
        details:
          'Tracking premature exits helps identify friction points or need for "Save for Later" functionality.',
        iconName: "LogOut",
        phase: "Termination",
        signatures: {
          abandonSignature: [
            {
              action: "click",
              env: "PROD",
              name: "Exit",
              region: "EMEA",
              role: "button",
              windowname: "KYCReviewWindow",
              xpath: "/html/body/div[1]/app-root/div/kyc-review/div/button[3]",
            },
          ],
        },
        metrics: [
          { label: "Drop-off Rate", value: "8%", trend: "down" },
          { label: "Return Rate", value: "65%", trend: "up" },
        ],
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
