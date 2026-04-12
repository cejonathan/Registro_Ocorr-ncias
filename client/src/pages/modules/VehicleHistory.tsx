import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Truck } from "lucide-react";

export default function VehicleHistory() {
  const { data: vehicles, isLoading } = trpc.vehicles.list.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="pt-12 pb-12 text-center">
          <Truck className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
          <p className="text-foreground/60">Nenhuma viatura registrada ainda</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="border-border bg-card hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{vehicle.vehicleId}</p>
                    <p className="text-sm text-foreground/60">{vehicle.agentName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-accent">{vehicle.openingKm} km</p>
                  <p className="text-xs text-foreground/50">Abertura</p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Data/Hora</p>
                  <p className="text-sm font-medium text-foreground">
                    {format(new Date(vehicle.registeredAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-foreground/60 mb-1">Status</p>
                  <p className="text-sm font-medium text-accent">Registrado</p>
                </div>
              </div>

              {/* Observations */}
              {vehicle.observations && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-foreground/60 mb-1">Observações</p>
                  <p className="text-sm text-foreground/80">{vehicle.observations}</p>
                </div>
              )}

              {/* Sync Status */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <p className="text-xs text-foreground/60">
                  {vehicle.syncedToSheets ? "✓ Sincronizado com Google Sheets" : "⏳ Aguardando sincronização"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
