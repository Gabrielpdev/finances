"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  MouseHandlerDataParam,
} from "recharts";

export interface IBarChartProps {
  data: IBarChartData[];
  onSelectBar: (category: MouseHandlerDataParam) => void;
}

export interface IBarChartData {
  name: string;
  value: number;
  fill: string;
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value?: number;
    payload: IBarChartData;
  }>;
};

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold" }}>
          {payload[0].payload.name}
        </p>
        <p style={{ margin: "4px 0 0 0", color: "#8884d8" }}>
          {payload[0].value?.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </div>
    );
  }
  return null;
};

const SimpleBarChart = ({ data, onSelectBar }: IBarChartProps) => {
  return (
    <BarChart
      style={{
        width: "100%",
        maxHeight: "70vh",
        aspectRatio: 1.618,
        padding: "10px",
      }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 0,
        left: 0,
        bottom: 5,
      }}
      onClick={(props) => onSelectBar(props)}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis dataKey="value" />
      <Tooltip content={<CustomTooltip />} />
      <Bar dataKey="value" fill="#8884d8" radius={[10, 10, 0, 0]} />
    </BarChart>
  );
};

export default SimpleBarChart;
