
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, CaptionProps } from "react-day-picker";
import { format } from "date-fns";
import { it } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  // Range di anni dal 1900 all'anno corrente
  const today = new Date();
  const years = React.useMemo(
    () =>
      Array.from(
        { length: today.getFullYear() - 1899 },
        (_, i) => today.getFullYear() - i
      ),
    [today]
  );

  const CustomCaption = (props: CaptionProps) => {
    const { displayMonth } = props;
    // Access these functions from props directly as they may be nested differently in the CaptionProps
    const goToMonth = props.onMonthChange;
    const previousMonth = () => {
      const prevMonth = new Date(displayMonth);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      goToMonth(prevMonth);
    };
    const nextMonth = () => {
      const nxtMonth = new Date(displayMonth);
      nxtMonth.setMonth(nxtMonth.getMonth() + 1);
      goToMonth(nxtMonth);
    };

    const handleYearSelect = (year: string) => {
      const newDate = new Date(displayMonth);
      newDate.setFullYear(parseInt(year, 10));
      goToMonth(newDate);
    };

    const handleMonthSelect = (monthIndex: string) => {
      const newDate = new Date(displayMonth);
      newDate.setMonth(parseInt(monthIndex, 10));
      goToMonth(newDate);
    };

    const monthNames = React.useMemo(
      () =>
        Array.from({ length: 12 }, (_, i) =>
          format(new Date(2000, i, 1), "MMMM", { locale: it })
        ),
      []
    );

    return (
      <div className="flex justify-between items-center px-2 pt-1">
        <button
          onClick={previousMonth}
          aria-label="Mese precedente"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {/* Select Anno */}
          <Select
            value={String(displayMonth.getFullYear())}
            onValueChange={handleYearSelect}
          >
            <SelectTrigger
              aria-label="Seleziona anno"
              className="h-7 w-[70px] text-sm"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {years.map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Select Mese */}
          <Select
            value={String(displayMonth.getMonth())}
            onValueChange={handleMonthSelect}
          >
            <SelectTrigger
              aria-label="Seleziona mese"
              className="h-7 w-[100px] text-sm"
            >
              <SelectValue placeholder={format(displayMonth, "MMMM", { locale: it })} />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {monthNames.map((month, index) => (
                <SelectItem key={index} value={String(index)}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <button
          onClick={nextMonth}
          aria-label="Mese successivo"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={it}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "flex items-center space-x-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell:
          "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        Caption: CustomCaption,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
