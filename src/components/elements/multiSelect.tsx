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

interface MultiSelectProps extends VariantProps<typeof buttonVariants> {
  selected: string[];
  onSelect: (value: string[]) => void;
  options: string[];
  label?: string;
  title?: string;
  disabled?: boolean;
  isLoading?: boolean;
  defaultValue?: string;
  className?: string;
}

const MultiSelect = ({
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
}: MultiSelectProps) => {
  function handleSelectMultiple(e: any, value: string) {
    e.preventDefault();

    if (value === "Todos") {
      if (selected.length === options.length) {
        onSelect([]);
        return;
      }
      onSelect(options);
      return;
    }

    const isAlreadySelected = selected?.some((multiple) => multiple === value);
    if (isAlreadySelected) {
      onSelect(selected?.filter((multiple) => multiple !== value));
      return;
    }

    const optionSelected = options?.find((option) => option === value);

    if (!selected?.length && optionSelected) {
      onSelect([optionSelected]);
      return;
    }

    if (optionSelected) {
      onSelect([...selected, optionSelected]);
    }
  }

  return (
    <div className="flex flex-col max-sm:w-full">
      <label className="mb-2 block font-medium">{label}</label>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          disabled={isLoading || disabled}
          defaultValue={defaultValue}
          asChild
        >
          <button
            className={cn(
              buttonVariants({ variant, size, className }),
              "w-60 max-sm:w-full justify-between",
            )}
          >
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <span className="truncate">
                  {(selected.length > 0 && selected.length !== options.length
                    ? selected.join(", ")
                    : "Todos") || title}
                </span>
                <TbTriangleInvertedFilled size={13} className="shrink-0" />
              </>
            )}
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[220px] rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
            sideOffset={5}
          >
            <div className="group relative flex h-8 select-none items-center rounded-sm pl-7 pr-1 text-sm leading-none text-popover-foreground outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground">
              <DropdownMenu.CheckboxItem
                checked={selected?.length === options.length}
                onSelect={(e) => handleSelectMultiple(e, "Todos")}
              >
                <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex items-center justify-center">
                  <CheckIcon className="size-3.5" />
                </DropdownMenu.ItemIndicator>
                <span className="text-ellipsis max-w-xs">{"Todos"}</span>
              </DropdownMenu.CheckboxItem>
            </div>

            {options.map((option) => {
              const isSelected = selected?.some(
                (multiple) => multiple === option,
              );

              return (
                <div
                  key={option}
                  className="group relative flex h-8 select-none items-center rounded-sm pl-7 pr-1 text-sm leading-none text-popover-foreground outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                >
                  <DropdownMenu.CheckboxItem
                    checked={isSelected}
                    onSelect={(e) => handleSelectMultiple(e, option)}
                  >
                    <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                      <CheckIcon />
                    </DropdownMenu.ItemIndicator>
                    <span className="text-ellipsis max-w-xs">{option}</span>
                  </DropdownMenu.CheckboxItem>

                  {isSelected && (
                    <button
                      onClick={(e) => handleSelectMultiple(e, option)}
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

export default MultiSelect;
