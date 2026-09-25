"use client";

import { cn } from "@/lib/utils";

export interface IBarChartProps {
  data: IBarChartData[];
}

export interface IBarChartData {
  name: string;
  value: number;
  fill: string;
  goal?: number;
}

const SimpleHorizontalBarChart = ({ data }: IBarChartProps) => {
  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col p-4 ">
      {data.map((entry) => {
        const percentage = (entry.value / (entry.goal || totalValue)) * 100;

        return (
          <div
            key={entry.name}
            className="grid grid-cols-4 gap-4 items-center mb-2"
          >
            <span className="ml-2 font-medium w-fit max-sm:text-sm">
              {entry.name}:
            </span>

            <div className="relative col-span-2 h-6 w-full flex-1 overflow-hidden rounded-md bg-muted">
              <div
                className="h-6 rounded-md absolute top-0 left-0"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: entry.fill,
                }}
              ></div>
            </div>

            <span className={cn("max-sm:text-xs")}>
              <span
                className={cn({
                  "font-semibold text-expense": percentage >= 100,
                })}
              >
                {percentage.toFixed(2)}%
              </span>
              {/* <span>( R$ {entry.goal?.toLocaleString() || 0} )</span> */}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SimpleHorizontalBarChart;
