
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, BookOpen, Building, FileBox, LogOut, Menu, Users, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useAuth } from '@/hooks/useAuth';

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar button */}
      <div className="lg:hidden fixed right-4 top-4 z-50">
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          variant="outline"
          size="icon"
          className="rounded-full"
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-40 w-64 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Gestione Corsi</h1>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            <SidebarItem
              icon={<BarChart3 className="h-5 w-5" />}
              label="Dashboard"
              href="/"
              onClick={() => {
                navigate('/');
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={<BookOpen className="h-5 w-5" />}
              label="Gestione Corsi"
              href="/corsi"
              onClick={() => {
                navigate('/corsi');
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={<Users className="h-5 w-5" />}
              label="Partecipanti"
              href="/partecipanti"
              onClick={() => {
                navigate('/partecipanti');
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={<Building className="h-5 w-5" />}
              label="Aziende"
              href="/aziende"
              onClick={() => {
                navigate('/aziende');
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={<FileBox className="h-5 w-5" />}
              label="Archivio"
              href="/archivio"
              onClick={() => {
                navigate('/archivio');
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
            />
          </nav>
          <div className="p-4 border-t dark:border-gray-700">
            {user && (
              <div className="flex items-center justify-between">
                <div className="truncate">
                  <p className="text-sm font-medium">{user.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  title="Disconnetti"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 md:p-8 lg:ml-64">
        {children}
      </div>
    </div>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, href, onClick }: SidebarItemProps) => {
  const isActive = window.location.pathname === href;
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-colors ${
        isActive
          ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default Sidebar;
