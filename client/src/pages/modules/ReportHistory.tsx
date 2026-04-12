import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BarChart3, Truck, AlertCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TYPE_COLORS: Record<string, string> = {
  "Diário": "bg-blue-100 text-blue-800",
  "Semanal": "bg-purple-100 text-purple-800",
  "Mensal": "bg-green-100 text-green-800",
  "Customizado": "bg-orange-100 text-orange-800",
};

export default function ReportHistory() {
  const { data: reports, isLoading } = trpc.reports.list.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!reports || reports.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="pt-12 pb-12 text-center">
          <BarChart3 className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
          <p className="text-foreground/60">Nenhum relatório gerado ainda</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id} className="border-border bg-card hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <Badge className={`${TYPE_COLORS[report.reportType] || TYPE_COLORS["Customizado"]} mb-2`}>
                      {report.reportType}
                    </Badge>
                    <p className="text-sm text-foreground/70">
                      {format(new Date(report.periodStart), "dd/MM/yyyy", { locale: ptBR })} até{" "}
                      {format(new Date(report.periodEnd), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Truck className="w-4 h-4 text-accent" />
                    <span className="text-lg font-bold text-accent">{report.totalVehicles}</span>
                  </div>
                  <p className="text-xs text-foreground/60">Viaturas</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <AlertCircle className="w-4 h-4 text-accent" />
                    <span className="text-lg font-bold text-accent">{report.totalOccurrences}</span>
                  </div>
                  <p className="text-xs text-foreground/60">Ocorrências</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="w-4 h-4 text-accent" />
                    <span className="text-lg font-bold text-accent">{report.activeAgents}</span>
                  </div>
                  <p className="text-xs text-foreground/60">Agentes</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <p className="text-xs text-foreground/60">
                  Gerado em {format(new Date(report.generatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </p>
                <p className="text-xs text-foreground/60">
                  {report.syncedToSheets ? "✓ Sincronizado" : "⏳ Sincronizando"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
