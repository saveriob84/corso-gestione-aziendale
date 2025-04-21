
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AuthGuard from "@/components/layout/AuthGuard";
import SidebarLayout from "./components/layout/SidebarLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Corsi from "./pages/Corsi";
import DettaglioCorso from "./pages/DettaglioCorso";
import ArchivioComunicazioni from "./pages/ArchivioComunicazioni";
import Aziende from "./pages/Aziende";
import Partecipanti from "./pages/Partecipanti";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <AuthGuard>
                <SidebarLayout><Index /></SidebarLayout>
              </AuthGuard>
            } />
            <Route path="/corsi" element={
              <AuthGuard>
                <SidebarLayout><Corsi /></SidebarLayout>
              </AuthGuard>
            } />
            <Route path="/corsi/:id" element={
              <AuthGuard>
                <SidebarLayout><DettaglioCorso /></SidebarLayout>
              </AuthGuard>
            } />
            <Route path="/archivio" element={
              <AuthGuard>
                <SidebarLayout><ArchivioComunicazioni /></SidebarLayout>
              </AuthGuard>
            } />
            <Route path="/aziende" element={
              <AuthGuard>
                <SidebarLayout><Aziende /></SidebarLayout>
              </AuthGuard>
            } />
            <Route path="/partecipanti" element={
              <AuthGuard>
                <SidebarLayout><Partecipanti /></SidebarLayout>
              </AuthGuard>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
