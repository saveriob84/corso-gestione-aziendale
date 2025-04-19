
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Archive, 
  Users, 
  Settings,
  ChevronRight,
  LogOut,
  Building
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, href, active }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-blue-100 dark:hover:bg-slate-800",
        active ? "bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-blue-500" : "text-slate-700 dark:text-slate-300"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
      {active && <ChevronRight className="ml-auto h-4 w-4" />}
    </Link>
  );
};

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4">
        <div className="flex flex-col h-full">
          <div className="mb-8 p-2">
            <h1 className="font-heading text-xl font-bold text-blue-600 dark:text-blue-500">
              Gestione Corsi
            </h1>
          </div>

          <nav className="space-y-1.5 flex-grow">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Dashboard" 
              href="/" 
              active={currentPath === "/"} 
            />
            <SidebarItem 
              icon={BookOpen} 
              label="Corsi" 
              href="/corsi" 
              active={currentPath.startsWith("/corsi")} 
            />
            <SidebarItem 
              icon={Building} 
              label="Aziende" 
              href="/aziende" 
              active={currentPath.startsWith("/aziende")} 
            />
            <SidebarItem 
              icon={Archive} 
              label="Archivio" 
              href="/archivio" 
              active={currentPath.startsWith("/archivio")} 
            />
            <SidebarItem 
              icon={Users} 
              label="Partecipanti" 
              href="/partecipanti" 
              active={currentPath.startsWith("/partecipanti")} 
            />
          </nav>

          <div className="pt-2 mt-auto border-t border-slate-200 dark:border-slate-800">
            <SidebarItem 
              icon={Settings} 
              label="Impostazioni" 
              href="/impostazioni" 
              active={currentPath.startsWith("/impostazioni")} 
            />
            <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 transition-all hover:bg-blue-100 dark:hover:bg-slate-800">
              <LogOut className="h-5 w-5" />
              <span>Esci</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;
