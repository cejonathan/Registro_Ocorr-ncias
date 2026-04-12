import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, AlertCircle, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery({ date: new Date() });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Painel de Controle</h2>
        <p className="text-foreground/60 capitalize">{today}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Vehicles */}
        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
              <Truck className="w-4 h-4 text-accent" />
              Viaturas Registradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats?.totalVehicles || 0}</div>
            <p className="text-xs text-foreground/50 mt-1">Hoje</p>
          </CardContent>
        </Card>

        {/* Total Occurrences */}
        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent" />
              Ocorrências Registradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats?.totalOccurrences || 0}</div>
            <p className="text-xs text-foreground/50 mt-1">Hoje</p>
          </CardContent>
        </Card>

        {/* Active Agents */}
        <Card className="border-border bg-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground/70 flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" />
              Agentes Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats?.activeAgents.size || 0}</div>
            <p className="text-xs text-foreground/50 mt-1">Hoje</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Info */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Resumo do Dia</CardTitle>
          <CardDescription>Informações operacionais em tempo real</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="text-foreground/70">Viaturas em operação</span>
            <span className="font-semibold text-accent">{stats?.totalVehicles || 0}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="text-foreground/70">Ocorrências processadas</span>
            <span className="font-semibold text-accent">{stats?.totalOccurrences || 0}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="text-foreground/70">Equipe em campo</span>
            <span className="font-semibold text-accent">{stats?.activeAgents.size || 0} agentes</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
