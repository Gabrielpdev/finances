import * as React from "react";
import { DropdownMenu } from "radix-ui";
import { CheckIcon } from "@radix-ui/react-icons";
import { TbTriangleInvertedFilled, TbX } from "react-icons/tb";

export type IOptions = {
  value: string;
  label: string;
};

interface MultiSelectProps {
  selected: string[];
  onSelect: (value: string[]) => void;
  options: string[];
  label?: string;
  title?: string;
  disabled?: boolean;
  isLoading?: boolean;
  defaultValue?: string;
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
}: MultiSelectProps) => {
  function handleSelectMultiple(e: any, value: string) {
    e.preventDefault();

    if (value === "Todos") {
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
    <div>
      <label className="mb-2 block font-medium">{label}</label>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          disabled={isLoading || disabled}
          defaultValue={defaultValue}
          asChild
        >
          <button className="inline-flex gap-2 p-1 items-center justify-between w-[200px] rounded-sm bg-white shadow-[0_1px_2px] shadow-black outline-none focus:shadow-[0_0_0_2px] focus:shadow-black">
            <span className="truncate">
              {(selected.length > 0 && selected.length !== options.length
                ? selected.join(", ")
                : "Todos") || title}
            </span>
            <TbTriangleInvertedFilled size={15} className="flex-shrink-0" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
            sideOffset={5}
          >
            <div className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
              <DropdownMenu.CheckboxItem
                checked={selected?.length === options.length}
                onSelect={(e) => handleSelectMultiple(e, "Todos")}
              >
                <DropdownMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
                  <CheckIcon />
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
                  className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
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
