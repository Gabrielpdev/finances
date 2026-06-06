import React from "react";
import { Label } from "./label";

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, ...rest }: IInput) => {
  return (
    <div className="flex flex-col w-full gap-1">
      {label && (
        <Label
          className={`w-full flex items-center capitalize border-r-2 text-blue-950 col-span-8 max-sm:col-span-7`}
          htmlFor={rest.id}
        >
          {label}
        </Label>
      )}
      <input
        id={rest.id}
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
        {...rest}
      />
    </div>
  );
};
