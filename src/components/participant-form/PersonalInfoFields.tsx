
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { ParticipantFormValues } from "@/types/participant";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const PersonalInfoFields: React.FC = () => {
  const { control } = useFormContext<ParticipantFormValues>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  return (
    <>
      <FormField
        control={control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input placeholder="es. Mario" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="cognome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cognome</FormLabel>
            <FormControl>
              <Input placeholder="es. Rossi" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="codicefiscale"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Codice Fiscale</FormLabel>
            <FormControl>
              <Input placeholder="es. RSSMRA80A01H501U" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="luogonascita"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Luogo di nascita</FormLabel>
            <FormControl>
              <Input placeholder="es. Roma" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="datanascita"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Data di nascita</FormLabel>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                    type="button"
                  >
                    {field.value ? (
                      format(field.value, "dd/MM/yyyy", { locale: it })
                    ) : (
                      <span>Seleziona data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(date) => {
                    field.onChange(date);
                    setCalendarOpen(false);
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="bg-background pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
