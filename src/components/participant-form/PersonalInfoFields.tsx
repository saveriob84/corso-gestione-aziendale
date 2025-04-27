
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ParticipantFormValues } from "@/types/participant";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface PersonalInfoFieldsProps {
  form: UseFormReturn<ParticipantFormValues>;
}

export const PersonalInfoFields: React.FC<PersonalInfoFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
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
        control={form.control}
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
        control={form.control}
        name="codicefiscale"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Codice Fiscale</FormLabel>
            <FormControl>
              <Input 
                placeholder="es. RSSMRA80A01H501U" 
                {...field}
                value={field.value as string}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
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
        control={form.control}
        name="datanascita"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Data di nascita</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal pointer-events-auto",
                      !field.value && "text-muted-foreground"
                    )}
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
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  defaultMonth={field.value || new Date()}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="numerocellulare"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Numero di cellulare</FormLabel>
            <FormControl>
              <Input placeholder="es. +39 123 456 7890" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
