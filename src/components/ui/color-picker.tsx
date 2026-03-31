"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const PRESET_COLORS = [
  "#FF0000", // Red
  "#FF7F00", // Orange
  "#FFFF00", // Yellow
  "#00FF00", // Green
  "#0000FF", // Blue
  "#4B0082", // Indigo
  "#9400D3", // Violet
  "#FF1493", // Deep Pink
  "#00CED1", // Dark Turquoise
  "#32CD32", // Lime Green
  "#FFD700", // Gold
  "#FF6347", // Tomato
  "#20B2AA", // Light Sea Green
  "#E6E6FA", // Lavender
  "#2F4F4F", // Dark Slate Gray
  "#FFFFFF", // White
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
  triggerClassName?: string;
}

export function ColorPicker({
  value,
  onChange,
  className,
  triggerClassName,
}: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleColorChange = (color: string) => {
    onChange(color);
    setInputValue(color);
    // setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    // Validate hex color format
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center justify-start gap-2 rounded-md bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden",
            triggerClassName,
          )}
        >
          <div
            className={cn("h-6 w-6 rounded border border-border", className)}
            style={{ backgroundColor: value }}
          />
          <span className="font-mono text-xs uppercase">{value}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-white shadow-md rounded-md">
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Custom Color
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="#000000"
                className={cn(
                  "flex-1 rounded-md border border-input bg-background px-3 py-2 font-mono text-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden",
                )}
              />
              <input
                type="color"
                value={value}
                onChange={(e) => handleColorChange(e.target.value)}
                className="h-10 w-14 cursor-pointer rounded-md "
              />
            </div>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium">
              Preset Colors
            </label>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorChange(color)}
                  className={cn(
                    "h-8 w-8 rounded-md border-2 transition-transform hover:scale-110",
                    value === color
                      ? "border-foreground"
                      : "border-transparent",
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
