
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ParticipantFormValues } from "@/types/participant";

interface CredentialFieldsProps {
  form: UseFormReturn<ParticipantFormValues>;
}

export const CredentialFields: React.FC<CredentialFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input 
                placeholder="es. mario.rossi" 
                {...field} 
                onInput={(e) => {
                  field.onChange(e);
                  e.stopPropagation();
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="••••••••" 
                {...field} 
                onInput={(e) => {
                  field.onChange(e);
                  e.stopPropagation();
                }}
              />
            </FormControl>
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
              <Input 
                placeholder="es. +39 333 1234567" 
                {...field} 
                onInput={(e) => {
                  field.onChange(e);
                  e.stopPropagation();
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
