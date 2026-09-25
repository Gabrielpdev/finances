import * as React from "react";
import { DropdownMenu } from "radix-ui";
import { CheckIcon } from "@radix-ui/react-icons";
import { TbTriangleInvertedFilled, TbX } from "react-icons/tb";
import { Loading } from "@/components/loading";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

export type IOptions = {
  value: string;
  label: string;
};

interface SelectProps extends VariantProps<typeof buttonVariants> {
  selected: string;
  onSelect: (value: string) => void;
  options: string[];
  label?: string;
  title?: string;
  disabled?: boolean;
  isLoading?: boolean;
  defaultValue?: string;
  className?: string;
}

const Select = ({
  title,
  label,
  options,
  disabled,
  selected,
  onSelect,
  isLoading,
  defaultValue,
  className,
  variant = "outline",
  size = "lg",
}: SelectProps) => {
  function handleSelect(value: string) {
    const isAlreadySelected = selected === value;
    if (isAlreadySelected) {
      onSelect("");
      return;
    }

    const optionSelected = options?.find((option) => option === value);

    if (!selected?.length && optionSelected) {
      onSelect(optionSelected);
      return;
    }

    if (optionSelected) {
      onSelect(optionSelected);
    }
  }

  return (
    <div className={cn("flex flex-col max-sm:w-full", className)}>
      {label && <label className="mb-2 block font-medium">{label}</label>}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          disabled={isLoading || disabled}
          defaultValue={defaultValue}
          className={cn(
            buttonVariants({ variant, size, className }),
            "w-60 max-sm:w-full",
          )}
        >
          {isLoading ? (
            <Loading />
          ) : (
            <div className="flex w-full items-center justify-between text-sm">
              <span className="truncate">{selected || title}</span>
              <TbTriangleInvertedFilled size={13} className="shrink-0" />
            </div>
          )}
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[220px] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
            sideOffset={5}
          >
            {options.map((option) => {
              const isSelected = selected === option;

              return (
                <div
                  key={option}
                  className="group relative flex h-8 select-none items-center rounded-sm pl-7 pr-1 text-sm leading-none text-popover-foreground outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                >
                  <DropdownMenu.CheckboxItem
                    checked={isSelected}
                    onSelect={() => handleSelect(option)}
                  >
                    <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                      <CheckIcon />
                    </DropdownMenu.ItemIndicator>
                    <span className="text-ellipsis max-w-xs">{option}</span>
                  </DropdownMenu.CheckboxItem>

                  {isSelected && (
                    <button
                      onClick={() => handleSelect(option)}
                      className="absolute right-0 inline-flex w-[25px] items-center justify-center"
                    >
                      <TbX />
                    </button>
                  )}
                </div>
              );
            })}

            <DropdownMenu.Arrow className="fill-white" />
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
};

export default Select;
