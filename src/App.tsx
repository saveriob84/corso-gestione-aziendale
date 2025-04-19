
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarLayout from "./components/layout/SidebarLayout";
import Index from "./pages/Index";
import Corsi from "./pages/Corsi";
import DettaglioCorso from "./pages/DettaglioCorso";
import ArchivioComunicazioni from "./pages/ArchivioComunicazioni";
import Aziende from "./pages/Aziende";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SidebarLayout><Index /></SidebarLayout>} />
          <Route path="/corsi" element={<SidebarLayout><Corsi /></SidebarLayout>} />
          <Route path="/corsi/:id" element={<SidebarLayout><DettaglioCorso /></SidebarLayout>} />
          <Route path="/archivio" element={<SidebarLayout><ArchivioComunicazioni /></SidebarLayout>} />
          <Route path="/aziende" element={<SidebarLayout><Aziende /></SidebarLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
