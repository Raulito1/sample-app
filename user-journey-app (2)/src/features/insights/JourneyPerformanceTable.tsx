import React from "react";
import { ArrowDownRight, ArrowUpRight, Layers } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

export type JourneyPerformance = {
  name: string;
  cohort: string;
  completion: {
    delta: string;
    trend: "up" | "down";
    tone: "positive" | "neutral";
  };
  friction: { value: string; tone: "positive" | "negative" };
  impact: string;
};

type JourneyPerformanceTableProps = {
  rows: JourneyPerformance[];
};

const JourneyPerformanceTable: React.FC<JourneyPerformanceTableProps> = ({
  rows,
}) => {
  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/80">
        <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Layers size={18} className="text-cyan-600 dark:text-cyan-400" />
          User Journey Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader className="bg-slate-50 text-xs font-mono uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
            <TableRow>
              <TableHead className="px-6 py-3">Journey Name</TableHead>
              <TableHead className="px-6 py-3">Top Cohort</TableHead>
              <TableHead className="px-6 py-3">Completion Time</TableHead>
              <TableHead className="px-6 py-3">Friction Change</TableHead>
              <TableHead className="px-6 py-3">Conversion Impact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm">
            {rows.map((row) => (
              <TableRow
                key={row.name}
                className="border-slate-200 transition-colors hover:bg-slate-100 dark:border-slate-800/50 dark:hover:bg-slate-800/30"
              >
                <TableCell className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                  {row.name}
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-600 dark:text-slate-300">
                  {row.cohort}
                </TableCell>
                <TableCell
                  className={`px-6 py-4 flex items-center gap-1 ${
                    row.completion.tone === "positive"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {row.completion.trend === "down" ? (
                    <ArrowDownRight size={14} />
                  ) : (
                    <ArrowUpRight size={14} />
                  )}
                  {row.completion.delta}
                </TableCell>
                <TableCell
                  className={`px-6 py-4 ${
                    row.friction.tone === "positive"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {row.friction.value}
                </TableCell>
                <TableCell className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                  {row.impact}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default JourneyPerformanceTable;
