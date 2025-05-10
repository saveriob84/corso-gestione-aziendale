import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

interface CompanyFormValues {
  id: string;
  ragioneSociale: string;
  partitaIva: string;
  indirizzo: string;
  comune: string;
  cap: string;
  provincia: string;
  telefono: string;
  email: string;
  referente: string;
  codiceAteco: string;
}

interface CompanyFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<CompanyFormValues>;
  isEditing?: boolean;
  onCompanyAdded?: (newCompany: CompanyFormValues) => void;
}

const CompanyFormDialog: React.FC<CompanyFormDialogProps> = ({
  isOpen,
  onClose,
  initialData = {},
  isEditing = false,
  onCompanyAdded
}) => {
  const [existingCompanies, setExistingCompanies] = useState<CompanyFormValues[]>([]);
  
  useEffect(() => {
    const storedCompanies = localStorage.getItem('companies');
    if (storedCompanies) {
      setExistingCompanies(JSON.parse(storedCompanies));
    }
  }, []);
  
  const form = useForm<CompanyFormValues>({
    defaultValues: {
      id: initialData.id || uuidv4(),
      ragioneSociale: initialData.ragioneSociale || "",
      partitaIva: initialData.partitaIva || "",
      indirizzo: initialData.indirizzo || "",
      comune: initialData.comune || "",
      cap: initialData.cap || "",
      provincia: initialData.provincia || "",
      telefono: initialData.telefono || "",
      email: initialData.email || "",
      referente: initialData.referente || "",
      codiceAteco: initialData.codiceAteco || "",
    }
  });

  const onSubmit = (data: CompanyFormValues) => {
    const duplicateCompany = existingCompanies.find(
      company => company.partitaIva === data.partitaIva && company.id !== initialData.id
    );
    
    if (duplicateCompany) {
      toast.error("Esiste già un'azienda con questa Partita IVA");
      return;
    }
    
    const companyToSave = {
      ...data,
      id: isEditing && initialData.id ? initialData.id : data.id || uuidv4()
    };
    
    let updatedCompanies;
    if (isEditing && initialData.id) {
      updatedCompanies = existingCompanies.map(company => 
        company.id === initialData.id ? companyToSave : company
      );
    } else {
      updatedCompanies = [...existingCompanies, companyToSave];
    }
    
    localStorage.setItem('companies', JSON.stringify(updatedCompanies));
    
    toast.success(isEditing 
      ? "Azienda aggiornata con successo" 
      : "Azienda aggiunta con successo"
    );
    
    if (onCompanyAdded && !isEditing) {
      onCompanyAdded(companyToSave);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifica Azienda' : 'Aggiungi Azienda'}</DialogTitle>
          <DialogDescription>Inserisci i dati dell'azienda</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ragioneSociale"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ragione sociale</FormLabel>
                    <FormControl>
                      <Input placeholder="es. TechSolutions Srl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="partitaIva"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Partita IVA</FormLabel>
                    <FormControl>
                      <Input placeholder="es. IT12345678901" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="indirizzo"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Indirizzo</FormLabel>
                    <FormControl>
                      <Input placeholder="es. Via Roma 123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="comune"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comune</FormLabel>
                    <FormControl>
                      <Input placeholder="es. Milano" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cap"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CAP</FormLabel>
                      <FormControl>
                        <Input placeholder="es. 20100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="provincia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provincia</FormLabel>
                      <FormControl>
                        <Input placeholder="es. MI" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefono</FormLabel>
                    <FormControl>
                      <Input placeholder="es. 02 12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="es. info@azienda.it" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="referente"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referente aziendale (opzionale)</FormLabel>
                    <FormControl>
                      <Input placeholder="es. Dott. Mario Bianchi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="codiceAteco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Macrosettore (codice ATECO)</FormLabel>
                    <FormControl>
                      <Input placeholder="es. 62.01.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Annulla</Button>
              <Button type="submit">{isEditing ? 'Aggiorna' : 'Aggiungi'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyFormDialog;
