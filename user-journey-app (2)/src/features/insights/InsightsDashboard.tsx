import React from "react";
import InsightCards, { Insight } from "./InsightCards";
import JourneyPerformanceTable, {
  JourneyPerformance,
} from "./JourneyPerformanceTable";
import SummaryStats, { SummaryStat } from "./SummaryStats";

const SUMMARY_STATS: SummaryStat[] = [
  {
    label: "New Users (Tech)",
    value: "+124",
    accent: { label: "+12%", tone: "positive" },
  },
  {
    label: "Avg Friction Score",
    value: "Low",
    accent: { label: "-5%", tone: "positive" },
  },
  {
    label: "Top Journey Vol",
    value: "Global Markets",
  },
  {
    label: "Active Anomalies",
    value: "3",
    accent: { label: "Active", tone: "neutral" },
  },
];

const AGENT_INSIGHTS: Insight[] = [
  // --- Cohort Trends & Friction ---
  {
    id: 1,
    category: "Cohort Opportunity",
    cohort: "Technology",
    title: "Unused Trending Feature",
    description:
      "The 'GraphQL Explorer' component is trending within the Technology cohort (+45% MoM), but you have not initialized it yet.",
    metric: "High Relevance",
    type: "opportunity",
    icon: "Zap",
  },
  {
    id: 2,
    category: "Cohort Friction",
    cohort: "Product",
    title: "High Error Rate detected",
    description:
      "Product Managers are experiencing a 12% timeout rate on the 'Bulk CSV Export' feature during peak hours (14:00-16:00).",
    metric: "12% Failure",
    type: "critical",
    icon: "AlertTriangle",
  },
  {
    id: 3,
    category: "Cohort Behavior",
    cohort: "Design",
    title: "Spike in Friction",
    description:
      "Abnormal spike in 'Rage Clicks' detected on the 'Asset Library' upload modal within the Design cohort.",
    metric: "+200% Rage Clicks",
    type: "warning",
    icon: "MousePointerClick",
  },

  // --- Engagement & Anomalies ---
  {
    id: 4,
    category: "Engagement Alert",
    cohort: "All Users",
    title: "Low Feature Engagement",
    description:
      "The 'Legacy Reporting' module has not seen more than 5 unique users per day since Oct 1st.",
    metric: "< 5 DAU",
    type: "neutral",
    icon: "Activity",
  },
  {
    id: 5,
    category: "Usage Anomaly",
    cohort: "Product",
    title: "Spike in Feature Usage",
    description:
      "Unexpected +150% increase in 'Roadmap Visualizer' usage by Product cohort following the v2.4 release.",
    metric: "+150% Usage",
    type: "success",
    icon: "TrendingUp",
  },
  {
    id: 6,
    category: "User Pattern",
    cohort: "Technology",
    title: "Common Interaction",
    description:
      "Users in your cohort often open the 'API Logs' immediately after login (09:00 AM). Suggested Action: Bookmark or Deep Link.",
    metric: "85% Probability",
    type: "info",
    icon: "Clock",
  },

  // --- Behavioral Patterns ---
  {
    id: 7,
    category: "Anti-Pattern",
    cohort: "Global",
    title: "Adopting Anti-Pattern",
    description:
      "Detected 'Rapid Refreshing' (spamming F5) on the Dashboard widget. Indicates potential data latency perception issues.",
    metric: "High Frequency",
    type: "warning",
    icon: "ShieldAlert",
  },
  {
    id: 8,
    category: "Best Practice",
    cohort: "Security",
    title: "Adherence to Best Practice",
    description:
      "98% of users are now following the 'Secure Session Logout' flow, up from 75% last month.",
    metric: "98% Adherence",
    type: "success",
    icon: "CheckCircle",
  },

  // --- User Journey Specifics ---
  {
    id: 9,
    category: "Journey Intelligence",
    cohort: "Global",
    title: "Conversion Driver",
    description:
      "The 'Document Auto-Scan' feature appeared in 82% of successful 'KYC Approval' conversion events.",
    metric: "82% Attribution",
    type: "success",
    icon: "Target",
  },
  {
    id: 10,
    category: "Journey Optimization",
    cohort: "Global",
    title: "Efficiency Gain",
    description:
      "Average time to complete 'New Client Onboarding' has decreased by 18% after the 'Quick-Fill' update.",
    metric: "-18% Duration",
    type: "success",
    icon: "TrendingDown",
  },
];

const JOURNEY_PERFORMANCE: JourneyPerformance[] = [
  {
    name: "Global Markets Onboarding",
    cohort: "Technology",
    completion: { delta: "-15%", trend: "down", tone: "positive" },
    friction: { value: "-8%", tone: "positive" },
    impact: "High",
  },
  {
    name: "Retail KYC Review",
    cohort: "Product",
    completion: { delta: "+2%", trend: "up", tone: "neutral" },
    friction: { value: "+5%", tone: "negative" },
    impact: "Med",
  },
  {
    name: "Document Verification",
    cohort: "Design",
    completion: { delta: "-22%", trend: "down", tone: "positive" },
    friction: { value: "-12%", tone: "positive" },
    impact: "Very High",
  },
];

const InsightsDashboard: React.FC = () => (
  <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in-up">
    <SummaryStats stats={SUMMARY_STATS} />

    <InsightCards insights={AGENT_INSIGHTS} />

    <JourneyPerformanceTable rows={JOURNEY_PERFORMANCE} />
  </div>
);

export default InsightsDashboard;
