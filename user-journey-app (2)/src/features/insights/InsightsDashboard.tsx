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
  {
    insightTitle: "User Engagement Spike in Mobile App",
    insightType: ["Engagement"],
    insightSubType: ["Spike"],
    appName: "Chase Mobile",
    liveboardLink: "https://liveboard.example.com/insight/12345",
    insightDescription:
      "There was a significant spike in user engagement on the Chase Mobile app, with a 45% increase in daily active users over the past week.",
  },
  {
    insightTitle: "High Friction in Onboarding Flow",
    insightType: ["Friction"],
    insightSubType: ["Error"],
    appName: "Connect Manager",
    liveboardLink: "https://liveboard.example.com/insight/12346",
    insightDescription:
      "Users are experiencing a 12% drop-off rate on the identity verification step of the onboarding flow, indicating high friction.",
  },
  {
    insightTitle: "Unusual Login Pattern Detected",
    insightType: ["Anomaly", "Pattern"],
    insightSubType: ["Alert"],
    appName: "AO Intake",
    liveboardLink: "https://liveboard.example.com/insight/12347",
    insightDescription:
      "Detected unusual login patterns from multiple geographic locations within short time intervals, suggesting potential account sharing.",
  },
  {
    insightTitle: "Feature Adoption Opportunity",
    insightType: ["Opportunity"],
    insightSubType: ["Trend"],
    appName: "Client Create",
    liveboardLink: "https://liveboard.example.com/insight/12348",
    insightDescription:
      "The 'Quick Fill' feature has only 23% adoption rate despite being available to all users. Consider adding onboarding tooltips.",
  },
  {
    insightTitle: "Journey Completion Rate Drop",
    insightType: ["Journey"],
    insightSubType: ["Drop"],
    appName: "Regulatory Tool",
    liveboardLink: "https://liveboard.example.com/insight/12349",
    insightDescription:
      "The 'Document Upload' journey completion rate has dropped by 18% since the last release. Users are abandoning at the file selection step.",
  },
  {
    insightTitle: "Session Duration Optimization",
    insightType: ["Engagement", "Opportunity"],
    insightSubType: ["Optimization"],
    appName: "Onboarding Admin Tool",
    liveboardLink: "https://liveboard.example.com/insight/12350",
    insightDescription:
      "Average session duration increased by 25% after implementing the new dashboard layout. Consider applying similar patterns to other tools.",
  },
  {
    insightTitle: "Error Rate Spike in API Calls",
    insightType: ["Friction", "Anomaly"],
    insightSubType: ["Spike", "Error"],
    appName: "Suitability Web",
    liveboardLink: "https://liveboard.example.com/insight/12351",
    insightDescription:
      "API error rates spiked to 8% during peak hours (2-4 PM EST), primarily affecting the risk assessment module.",
  },
  {
    insightTitle: "User Behavior Pattern Shift",
    insightType: ["Pattern"],
    insightSubType: ["Trend"],
    appName: "Deposit Rate Exception",
    liveboardLink: "https://liveboard.example.com/insight/12352",
    insightDescription:
      "Users are increasingly using keyboard shortcuts (+35% MoM), suggesting power user behavior is growing in this segment.",
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
