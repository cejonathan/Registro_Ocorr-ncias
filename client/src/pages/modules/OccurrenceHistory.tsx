import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertCircle, MapPin, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const TYPE_COLORS: Record<string, string> = {
  "Acidente": "bg-red-100 text-red-800",
  "Infração": "bg-orange-100 text-orange-800",
  "Abordagem": "bg-blue-100 text-blue-800",
  "Fiscalização": "bg-purple-100 text-purple-800",
  "Atendimento": "bg-green-100 text-green-800",
  "Bloqueio": "bg-yellow-100 text-yellow-800",
  "Escolta": "bg-indigo-100 text-indigo-800",
  "Outro": "bg-gray-100 text-gray-800",
};

export default function OccurrenceHistory() {
  const { data: occurrences, isLoading } = trpc.occurrences.list.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!occurrences || occurrences.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="pt-12 pb-12 text-center">
          <AlertCircle className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
          <p className="text-foreground/60">Nenhuma ocorrência registrada ainda</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {occurrences.map((occurrence) => (
        <Card key={occurrence.id} className="border-border bg-card hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <Badge className={`${TYPE_COLORS[occurrence.occurrenceType] || TYPE_COLORS["Outro"]} mb-2`}>
                      {occurrence.occurrenceType}
                    </Badge>
                    <p className="text-sm text-foreground/80 line-clamp-2">{occurrence.description}</p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-foreground/50" />
                  <span className="text-foreground/70">{occurrence.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-foreground/50" />
                  <span className="text-foreground/70">{occurrence.agentName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-foreground/50">📅</span>
                  <span className="text-foreground/70">
                    {format(new Date(occurrence.registeredAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </span>
                </div>
              </div>

              {/* Sync Status */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <p className="text-xs text-foreground/60">
                  {occurrence.syncedToSheets ? "✓ Sincronizado com Google Sheets" : "⏳ Aguardando sincronização"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
