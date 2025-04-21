
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  change: number;
}

const StatCard = ({ title, value, change }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">
        {title}
      </CardTitle>
      <LayoutDashboard className="h-4 w-4 text-blue-600" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {change > 0 ? '+' : ''}{change} rispetto al mese scorso
      </p>
    </CardContent>
  </Card>
);

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Corsi Attivi" value={12} change={2} />
      <StatCard title="Partecipanti Totali" value={103} change={15} />
      <StatCard title="Aziende Partner" value={24} change={3} />
    </div>
  );
};

