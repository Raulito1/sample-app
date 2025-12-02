import React from 'react';
import { AlertTriangle } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';

export type SummaryStat = {
  label: string;
  value: string;
  accent?: {
    label: string;
    tone: 'positive' | 'neutral';
  };
};

type SummaryStatsProps = {
  stats: SummaryStat[];
};

const SummaryStats: React.FC<SummaryStatsProps> = ({ stats }) => {
  const getAccentTone = (tone: 'positive' | 'neutral') =>
    tone === 'positive'
      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/20'
      : 'text-amber-500 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20';

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="bg-white px-4 py-4 dark:bg-slate-900 border-slate-200 dark:border-slate-800 backdrop-blur-sm"
        >
          <CardHeader className="px-0 py-0">
            <CardTitle className="text-xs font-mono uppercase tracking-wide text-slate-500">
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-white">
              {stat.value}
              {stat.accent ? (
                <span
                  className={`${getAccentTone(
                    stat.accent.tone
                  )} text-xs flex items-center rounded px-1`}
                >
                  {stat.accent.tone === 'neutral' && <AlertTriangle size={14} className="mr-1" />}
                  {stat.accent.label}
                </span>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryStats;
