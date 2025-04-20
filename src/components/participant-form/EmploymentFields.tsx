
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ParticipantFormValues } from "@/types/participant";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface EmploymentFieldsProps {
  form: UseFormReturn<ParticipantFormValues>;
}

export const EmploymentFields: React.FC<EmploymentFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="titoloStudio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Titolo di studio</FormLabel>
            <FormControl>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona titolo di studio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="licenzaMedia">Licenza media</SelectItem>
                  <SelectItem value="diplomaSuperiore">Diploma superiore</SelectItem>
                  <SelectItem value="laurea">Laurea</SelectItem>
                  <SelectItem value="masterPost">Master post-laurea</SelectItem>
                  <SelectItem value="dottorato">Dottorato</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ccnl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CCNL di riferimento</FormLabel>
            <FormControl>
              <Input placeholder="es. Commercio" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contratto"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipologia contrattuale</FormLabel>
            <FormControl>
              <Select 
                value={field.value} 
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona tipologia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="determinato">Tempo determinato</SelectItem>
                  <SelectItem value="indeterminato">Tempo indeterminato</SelectItem>
                  <SelectItem value="apprendistato">Apprendistato</SelectItem>
                  <SelectItem value="stagionale">Stagionale</SelectItem>
                  <SelectItem value="collaborazione">Collaborazione</SelectItem>
                  <SelectItem value="partita-iva">Partita IVA</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="qualifica"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Qualifica professionale</FormLabel>
            <FormControl>
              <Input placeholder="es. Impiegato" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="annoAssunzione"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Anno di assunzione</FormLabel>
            <FormControl>
              <Input placeholder="es. 2020" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="exLege"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                Assunzione ai sensi ex lege 68/99
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </>
  );
};
