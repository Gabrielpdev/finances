import { cn } from "@/lib/utils";
import Image from "next/image";

interface CardProp {
  title: string;
  value: string;
  type: "in" | "out" | "balance";
}

export default function Card({ title, value, type }: CardProp) {
  return (
    <div
      className={cn(
        "h-36 w-full flex rounded-xl border shadow-sm max-sm:h-28 bg-background",
        type === "in" ? "border-income/80" : "border-expense/80",
      )}
    >
      <div
        className={cn(
          "w-full flex flex-col justify-between gap-4 rounded-xl border p-5",
          type === "in" ? "bg-income/30" : "bg-expense/30",
        )}
      >
        <div className="max-w-6xl w-full flex items-start justify-between">
          <span className="font-medium text-card-foreground">{title}</span>

          {type === "out" && (
            <Image
              src="/outs.svg"
              alt="saidas"
              width={32}
              height={32}
              className="max-sm:w-6 max-sm:h-6"
            />
          )}
          {type === "in" && (
            <Image
              src="/ins.svg"
              alt="entradas"
              width={32}
              height={32}
              className="max-sm:w-6 max-sm:h-6"
            />
          )}
        </div>

        <div className="text-3xl font-semibold tracking-tight text-card-foreground max-sm:text-xl">
          {value}
        </div>
      </div>
    </div>
  );
}
