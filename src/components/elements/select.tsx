import * as React from "react";
import { DropdownMenu } from "radix-ui";
import { CheckIcon } from "@radix-ui/react-icons";
import { TbTriangleInvertedFilled, TbX } from "react-icons/tb";

export type IOptions = {
  value: string;
  label: string;
};

interface SelectProps {
  selected: string;
  onSelect: (value: string) => void;
  options: string[];
  label?: string;
  title?: string;
  disabled?: boolean;
  isLoading?: boolean;
  defaultValue?: string;
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
    <div>
      <label className="mb-2 block font-medium">{label}</label>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          disabled={isLoading || disabled}
          defaultValue={defaultValue}
          asChild
        >
          <button className="inline-flex gap-2 p-1 items-center justify-between w-[200px] rounded-sm bg-white shadow-[0_1px_2px] shadow-black outline-none focus:shadow-[0_0_0_2px] focus:shadow-black">
            <span className="truncate">{selected || title}</span>
            <TbTriangleInvertedFilled size={15} className="flex-shrink-0" />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[220px] rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
            sideOffset={5}
          >
            {options.map((option) => {
              const isSelected = selected === option;

              return (
                <div
                  key={option}
                  className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
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
