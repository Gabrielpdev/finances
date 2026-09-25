import React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, IInput>(
  ({ label, className, ...rest }, ref) => {
    return (
      <div className="flex flex-col w-full gap-1">
        {label && (
          <Label
            className="w-full flex items-center capitalize text-foreground"
            htmlFor={rest.id}
          >
            {label}
          </Label>
        )}
        <input
          ref={ref}
          id={rest.id}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
            className,
          )}
          {...rest}
        />
      </div>
    );
  },
);

Input.displayName = "Input";
