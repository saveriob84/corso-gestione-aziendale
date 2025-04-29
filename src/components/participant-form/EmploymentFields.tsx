
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { ParticipantFormValues } from "@/types/participant";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export const EmploymentFields: React.FC = () => {
  const { control, watch } = useFormContext<ParticipantFormValues>();
  
  const titolostudio = watch('titolostudio');
  const contratto = watch('contratto');
  const exLege = watch('exLege');
  
  useEffect(() => {
    console.log('EmploymentFields - titolostudio:', titolostudio);
    console.log('EmploymentFields - contratto:', contratto);
    console.log('EmploymentFields - exLege:', exLege);
  }, [titolostudio, contratto, exLege]);
  
  return (
    <>
      <FormField
        control={control}
        name="titolostudio"
        render={({ field }) => {
          console.log('EmploymentFields - titolostudio field value:', field.value);
          return (
            <FormItem>
              <FormLabel>Titolo di studio</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange}
                  value={field.value || ''}
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
          );
        }}
      />

      <FormField
        control={control}
        name="ccnl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CCNL di riferimento</FormLabel>
            <FormControl>
              <Input 
                placeholder="es. Commercio" 
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="contratto"
        render={({ field }) => {
          console.log('EmploymentFields - contratto field value:', field.value);
          return (
            <FormItem>
              <FormLabel>Tipologia contrattuale</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={field.onChange}
                  value={field.value || ''}
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
          );
        }}
      />

      <FormField
        control={control}
        name="qualifica"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Qualifica professionale</FormLabel>
            <FormControl>
              <Input 
                placeholder="es. Impiegato" 
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="annoassunzione"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Anno di assunzione</FormLabel>
            <FormControl>
              <Input 
                placeholder="es. 2020" 
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="exLege"
        render={({ field }) => {
          console.log('EmploymentFields - exLege field value:', field.value);
          return (
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
          );
        }}
      />
    </>
  );
};
