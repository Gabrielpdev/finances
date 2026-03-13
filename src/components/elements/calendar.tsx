"use client";

import * as React from "react";
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { Button, buttonVariants } from "./button";
import { cn } from "@/lib/utils/cn";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  const defaultClassNames = getDefaultClassNames();

  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <label className="mb-2 block font-medium">Selecione a data:</label>
      <button
        onClick={() => setOpen(!open)}
        className="outline-none inline-flex gap-2 p-1 items-center justify-between w-[200px] rounded-sm bg-white shadow-[0_1px_2px] shadow-black focus:shadow-[0_0_0_2px] focus:shadow-black"
      >
        <span>Abrir calendário</span>
        <ChevronDownIcon className="h-4 w-4 opacity-50" />
      </button>

      {open && (
        <div className=" absolute z-10 rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade">
          <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn(
              "p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] group/calendar bg-background in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
              String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
              String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
              className,
            )}
            captionLayout={captionLayout}
            locale={locale}
            formatters={{
              formatMonthDropdown: (date) =>
                date.toLocaleString(locale?.code, { month: "short" }),
              ...formatters,
            }}
            classNames={{
              root: cn("w-fit", defaultClassNames.root),
              months: cn(
                "relative flex flex-col gap-4 md:flex-row",
                defaultClassNames.months,
              ),
              month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
              nav: cn(
                "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
                defaultClassNames.nav,
              ),
              button_previous: cn(
                buttonVariants({ variant: buttonVariant }),
                "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
                defaultClassNames.button_previous,
              ),
              button_next: cn(
                buttonVariants({ variant: buttonVariant }),
                "size-(--cell-size) p-0 select-none aria-disabled:opacity-50",
                defaultClassNames.button_next,
              ),
              month_caption: cn(
                "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
                defaultClassNames.month_caption,
              ),
              dropdowns: cn(
                "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
                defaultClassNames.dropdowns,
              ),
              dropdown_root: cn(
                "cn-calendar-dropdown-root relative rounded-(--cell-radius)",
                defaultClassNames.dropdown_root,
              ),
              dropdown: cn(
                "absolute inset-0 bg-popover opacity-0",
                defaultClassNames.dropdown,
              ),
              caption_label: cn(
                "font-medium select-none",
                captionLayout === "label"
                  ? "text-sm"
                  : "cn-calendar-caption-label flex items-center gap-1 rounded-(--cell-radius) text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground",
                defaultClassNames.caption_label,
              ),
              table: "w-full border-collapse",
              weekdays: cn("flex", defaultClassNames.weekdays),
              weekday: cn(
                "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none",
                defaultClassNames.weekday,
              ),
              week: cn("mt-2 flex w-full", defaultClassNames.week),
              week_number_header: cn(
                "w-(--cell-size) select-none",
                defaultClassNames.week_number_header,
              ),
              week_number: cn(
                "text-[0.8rem] text-muted-foreground select-none",
                defaultClassNames.week_number,
              ),
              day: cn(
                "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
                props.showWeekNumber
                  ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
                  : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
                defaultClassNames.day,
              ),
              range_start: cn(
                "relative isolate z-0 rounded-l-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:right-0 after:w-4 after:bg-muted",
                defaultClassNames.range_start,
              ),
              range_middle: cn("rounded-none", defaultClassNames.range_middle),
              range_end: cn(
                "relative isolate z-0 rounded-r-(--cell-radius) bg-muted after:absolute after:inset-y-0 after:left-0 after:w-4 after:bg-muted",
                defaultClassNames.range_end,
              ),
              today: cn(
                "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none",
                defaultClassNames.today,
              ),
              outside: cn(
                "text-muted-foreground aria-selected:text-muted-foreground",
                defaultClassNames.outside,
              ),
              disabled: cn(
                "text-muted-foreground opacity-50",
                defaultClassNames.disabled,
              ),
              hidden: cn("invisible", defaultClassNames.hidden),
              ...classNames,
            }}
            components={{
              Root: ({ className, rootRef, ...props }) => {
                return (
                  <div
                    data-slot="calendar"
                    ref={rootRef}
                    className={cn(className)}
                    {...props}
                  />
                );
              },
              Chevron: ({ className, orientation, ...props }) => {
                if (orientation === "left") {
                  return (
                    <ChevronLeftIcon
                      className={cn("cn-rtl-flip size-4", className)}
                      {...props}
                    />
                  );
                }

                if (orientation === "right") {
                  return (
                    <ChevronRightIcon
                      className={cn("cn-rtl-flip size-4", className)}
                      {...props}
                    />
                  );
                }

                return (
                  <ChevronDownIcon
                    className={cn("size-4", className)}
                    {...props}
                  />
                );
              },
              DayButton: ({ ...props }) => (
                <CalendarDayButton locale={locale} {...props} />
              ),
              WeekNumber: ({ children, ...props }) => {
                return (
                  <td {...props}>
                    <div className="flex size-(--cell-size) items-center justify-center text-center">
                      {children}
                    </div>
                  </td>
                );
              },
              ...components,
            }}
            {...props}
          />
        </div>
      )}
    </div>
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames();

  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="default"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(defaultClassNames.day, className)}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
