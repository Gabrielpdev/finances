"use client";
export interface IBarChartProps {
  data: IBarChartData[];
}

export interface IBarChartData {
  name: string;
  value: number;
  fill: string;
}

const SimpleHorizontalBarChart = ({ data }: IBarChartProps) => {
  const totalValue = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="flex flex-col p-4 w-full max-w-md">
      {data.map((entry) => (
        <div
          key={entry.name}
          className="grid grid-cols-4 gap-4 items-center mb-2"
        >
          <span className="ml-2 font-medium">{entry.name}:</span>

          <div className="flex-1 col-span-2 w-full h-6 bg-gray-200 rounded-md overflow-hidden relative">
            <div
              className="h-6 rounded-md absolute top-0 left-0"
              style={{
                width: `${(entry.value / totalValue) * 100}%`,
                backgroundColor: entry.fill,
              }}
            ></div>
          </div>

          <span className="">
            {((entry.value / totalValue) * 100).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default SimpleHorizontalBarChart;
