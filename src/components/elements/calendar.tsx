"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { TransactionsContext } from "@/providers/transactions";

export function DatePickerWithRange() {
  const { filterDate, setFilterDate } = React.useContext(TransactionsContext);
  return (
    <Field className="w-60  max-sm:w-full ">
      <FieldLabel htmlFor="date-picker-range">Selecionar Data</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            id="date-picker-range"
            className="bg-white justify-start px-2.5 font-normal shadow-[0_1px_2px] shadow-black outline-none"
          >
            <CalendarIcon />
            {filterDate?.from ? (
              filterDate.to ? (
                <>
                  {format(filterDate.from, "LLL dd, y")} -{" "}
                  {format(filterDate.to, "LLL dd, y")}
                </>
              ) : (
                format(filterDate.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={filterDate?.from}
            selected={filterDate}
            onSelect={setFilterDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
