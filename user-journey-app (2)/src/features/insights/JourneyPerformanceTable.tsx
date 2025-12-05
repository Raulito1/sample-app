import { ArrowDownRight, ArrowUpRight, Layers } from "lucide-react";
import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
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

const JourneyPerformanceTable: React.FC<JourneyPerformanceTableProps> = ({ rows }) => {
  return (
    <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3 lg:px-6 lg:py-4 2xl:px-8 2xl:py-5 dark:border-slate-800 dark:bg-slate-900/80">
        <CardTitle className="flex items-center gap-2 lg:gap-3 text-base lg:text-lg 2xl:text-xl text-slate-900 dark:text-white">
          <Layers
            size={18}
            className="text-cyan-600 dark:text-cyan-400 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6"
          />
          User Journey Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader className="bg-slate-50 text-xs lg:text-sm 2xl:text-base font-mono uppercase text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
            <TableRow>
              <TableHead className="px-4 py-2 lg:px-6 lg:py-3 2xl:px-8 2xl:py-4">
                Journey Name
              </TableHead>
              <TableHead className="px-4 py-2 lg:px-6 lg:py-3 2xl:px-8 2xl:py-4">
                Top Cohort
              </TableHead>
              <TableHead className="px-4 py-2 lg:px-6 lg:py-3 2xl:px-8 2xl:py-4">
                Completion Time
              </TableHead>
              <TableHead className="px-4 py-2 lg:px-6 lg:py-3 2xl:px-8 2xl:py-4">
                Friction Change
              </TableHead>
              <TableHead className="px-4 py-2 lg:px-6 lg:py-3 2xl:px-8 2xl:py-4">
                Conversion Impact
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm lg:text-base 2xl:text-lg">
            {rows.map((row) => (
              <TableRow
                key={row.name}
                className="border-slate-200 transition-colors hover:bg-slate-100 dark:border-slate-800/50 dark:hover:bg-slate-800/30"
              >
                <TableCell className="px-4 py-3 lg:px-6 lg:py-4 2xl:px-8 2xl:py-5 font-medium text-slate-900 dark:text-white">
                  {row.name}
                </TableCell>
                <TableCell className="px-4 py-3 lg:px-6 lg:py-4 2xl:px-8 2xl:py-5 text-slate-600 dark:text-slate-300">
                  {row.cohort}
                </TableCell>
                <TableCell
                  className={`px-4 py-3 lg:px-6 lg:py-4 2xl:px-8 2xl:py-5 flex items-center gap-1 lg:gap-2 ${
                    row.completion.tone === "positive"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {row.completion.trend === "down" ? (
                    <ArrowDownRight size={14} className="lg:w-4 lg:h-4 2xl:w-5 2xl:h-5" />
                  ) : (
                    <ArrowUpRight size={14} className="lg:w-4 lg:h-4 2xl:w-5 2xl:h-5" />
                  )}
                  {row.completion.delta}
                </TableCell>
                <TableCell
                  className={`px-4 py-3 lg:px-6 lg:py-4 2xl:px-8 2xl:py-5 ${
                    row.friction.tone === "positive"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {row.friction.value}
                </TableCell>
                <TableCell className="px-4 py-3 lg:px-6 lg:py-4 2xl:px-8 2xl:py-5 font-bold text-slate-900 dark:text-white">
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
