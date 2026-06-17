import React from "react";
import { SwitchProps, Root, SwitchThumb } from "@radix-ui/react-switch";
import { cn } from "@/lib/utils/cn";

interface ISwitch extends SwitchProps {
  label?: string;
  className?: string;
}

export const Switch = ({ label, className, ...rest }: ISwitch) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <Root
        {...rest}
        className="w-10 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-yellow-600 transition-colors"
      >
        <SwitchThumb className="block w-4 h-4 bg-white rounded-full transition-transform translate-x-1 data-[state=checked]:translate-x-5" />
      </Root>
    </div>
  );
};
