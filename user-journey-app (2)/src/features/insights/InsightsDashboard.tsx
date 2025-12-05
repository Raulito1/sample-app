import React from "react";

import InsightCards, { Insight } from "./InsightCards";
import JourneyPerformanceTable, { JourneyPerformance } from "./JourneyPerformanceTable";
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
  // --- App Trends & Friction ---
  {
    id: 1,
    category: "App Opportunity",
    appName: "Technology",
    title: "Unused Trending Feature",
    description:
      "The 'GraphQL Explorer' component is trending within the Technology app (+45% MoM), but you have not initialized it yet.",
    metric: "High Relevance",
    type: "opportunity",
    icon: "Zap",
  },
  {
    id: 2,
    category: "App Friction",
    appName: "Product",
    title: "High Error Rate detected",
    description:
      "Product Managers are experiencing a 12% timeout rate on the 'Bulk CSV Export' feature during peak hours (14:00-16:00).",
    metric: "12% Failure",
    type: "critical",
    icon: "AlertTriangle",
  },
  {
    id: 3,
    category: "App Behavior",
    appName: "Design",
    title: "Spike in Friction",
    description:
      "Abnormal spike in 'Rage Clicks' detected on the 'Asset Library' upload modal within the Design app.",
    metric: "+200% Rage Clicks",
    type: "warning",
    icon: "MousePointerClick",
  },

  // --- Engagement & Anomalies ---
  {
    id: 4,
    category: "Engagement Alert",
    appName: "All Users",
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
    appName: "Product",
    title: "Spike in Feature Usage",
    description:
      "Unexpected +150% increase in 'Roadmap Visualizer' usage by Product app following the v2.4 release.",
    metric: "+150% Usage",
    type: "success",
    icon: "TrendingUp",
  },
  {
    id: 6,
    category: "User Pattern",
    appName: "Technology",
    title: "Common Interaction",
    description:
      "Users in your app often open the 'API Logs' immediately after login (09:00 AM). Suggested Action: Bookmark or Deep Link.",
    metric: "85% Probability",
    type: "info",
    icon: "Clock",
  },

  // --- Behavioral Patterns ---
  {
    id: 7,
    category: "Anti-Pattern",
    appName: "Global",
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
    appName: "Security",
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
    appName: "Global",
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
    appName: "Global",
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
    appName: "Technology",
    completion: { delta: "-15%", trend: "down", tone: "positive" },
    friction: { value: "-8%", tone: "positive" },
    impact: "High",
  },
  {
    name: "Retail KYC Review",
    appName: "Product",
    completion: { delta: "+2%", trend: "up", tone: "neutral" },
    friction: { value: "+5%", tone: "negative" },
    impact: "Med",
  },
  {
    name: "Document Verification",
    appName: "Design",
    completion: { delta: "-22%", trend: "down", tone: "positive" },
    friction: { value: "-12%", tone: "positive" },
    impact: "Very High",
  },
];

const InsightsDashboard: React.FC = () => (
  <div className="w-full max-w-7xl lg:max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1800px] mx-auto p-4 lg:p-6 xl:p-8 2xl:p-10 space-y-6 lg:space-y-8 2xl:space-y-10 animate-fade-in-up">
    <SummaryStats stats={SUMMARY_STATS} />

    <InsightCards insights={AGENT_INSIGHTS} />

    <JourneyPerformanceTable rows={JOURNEY_PERFORMANCE} />
  </div>
);

export default InsightsDashboard;
