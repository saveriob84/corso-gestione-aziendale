
import React, { useState, useEffect } from 'react';
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
  const { control, watch, setValue } = useFormContext<ParticipantFormValues>();
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  // Monitor dei valori per debugging
  const nome = watch('nome');
  const cognome = watch('cognome');
  const dataNascita = watch('datanascita');
  
  useEffect(() => {
    console.log('PersonalInfoFields - nome:', nome);
    console.log('PersonalInfoFields - cognome:', cognome);
    console.log('PersonalInfoFields - dataNascita:', dataNascita);
  }, [nome, cognome, dataNascita]);
  
  return (
    <>
      <FormField
        control={control}
        name="nome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome</FormLabel>
            <FormControl>
              <Input 
                placeholder="es. Mario" 
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  console.log('Input nome changed:', e.target.value);
                  field.onChange(e);
                }}
              />
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
              <Input 
                placeholder="es. Rossi" 
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  console.log('Input cognome changed:', e.target.value);
                  field.onChange(e);
                }}
              />
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
              <Input 
                placeholder="es. RSSMRA80A01H501U" 
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  console.log('Input codicefiscale changed:', e.target.value);
                  field.onChange(e);
                }}
              />
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
              <Input 
                placeholder="es. Roma" 
                {...field}
                value={field.value || ''}
                onChange={(e) => {
                  console.log('Input luogonascita changed:', e.target.value);
                  field.onChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="datanascita"
        render={({ field }) => {
          console.log('PersonalInfoFields - datanascita field value:', field.value);
          return (
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
                      console.log('PersonalInfoFields - Calendar date selected:', date);
                      field.onChange(date);
                      setCalendarOpen(false);
                    }}
                    defaultMonth={field.value || new Date()}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="bg-background"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </>
  );
};
