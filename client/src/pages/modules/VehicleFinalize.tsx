import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChevronLeft, Save } from "lucide-react";

interface VehicleRecord {
  id: string;
  vehicle: string;
  driver: string;
  support: string;
  date: string;
  initialKm: string;
  initialTime: string;
  createdAt: string;
}

interface VehicleFinalizeProps {
  onBack: () => void;
}

export default function VehicleFinalize({ onBack }: VehicleFinalizeProps) {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleRecord | null>(null);
  const [finalKm, setFinalKm] = useState("");
  const [finalTime, setFinalTime] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<VehicleRecord>>({});

  // Mock data - em produção, isso viria do backend
  const mockVehicles: VehicleRecord[] = [
    {
      id: "1",
      vehicle: "1389",
      driver: "DET 02",
      support: "DET 03",
      date: "2026-04-12",
      initialKm: "15000",
      initialTime: "08:00",
      createdAt: "2026-04-12T08:00:00Z",
    },
    {
      id: "2",
      vehicle: "1390",
      driver: "DET 06",
      support: "DET 07",
      date: "2026-04-12",
      initialKm: "25000",
      initialTime: "09:30",
      createdAt: "2026-04-12T09:30:00Z",
    },
  ];

  const handleSelectVehicle = (vehicle: VehicleRecord) => {
    setSelectedVehicle(vehicle);
    setFinalKm("");
    setFinalTime("");
    setEditData({});
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    if (!selectedVehicle) return;
    if (!isEditing) {
      setEditData(selectedVehicle);
    }
    setIsEditing(!isEditing);
  };

  const handleEditChange = (field: keyof VehicleRecord, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = () => {
    if (!selectedVehicle) return;
    setSelectedVehicle({
      ...selectedVehicle,
      ...editData,
    });
    setIsEditing(false);
    toast.success("Dados atualizados com sucesso!");
  };

  const handleFinalize = () => {
    if (!selectedVehicle) {
      toast.error("Selecione uma viatura");
      return;
    }

    if (!finalKm || !finalTime) {
      toast.error("Preencha KM FINAL e HORA FINAL");
      return;
    }

    const initialKmNum = parseInt(selectedVehicle.initialKm);
    const finalKmNum = parseInt(finalKm);

    if (finalKmNum < initialKmNum) {
      toast.error("KM FINAL não pode ser menor que KM INICIAL");
      return;
    }

    const kmDifference = finalKmNum - initialKmNum;

    console.log({
      vehicle: selectedVehicle.vehicle,
      driver: selectedVehicle.driver,
      support: selectedVehicle.support,
      date: selectedVehicle.date,
      initialKm: selectedVehicle.initialKm,
      initialTime: selectedVehicle.initialTime,
      finalKm: finalKm,
      finalTime: finalTime,
      kmDifference: kmDifference,
    });

    toast.success(`Viatura finalizada! KM percorridos: ${kmDifference}`);
    setSelectedVehicle(null);
    setFinalKm("");
    setFinalTime("");
  };

  if (!selectedVehicle) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg uppercase font-bold">Finalizar Viatura</CardTitle>
          <CardDescription>Selecione uma viatura aberta para finalizar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockVehicles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-foreground/60">Nenhuma viatura aberta</p>
              </div>
            ) : (
              mockVehicles.map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => handleSelectVehicle(vehicle)}
                  className="w-full p-4 text-left border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">Viatura: {vehicle.vehicle}</p>
                      <p className="text-sm text-foreground/70">Condutor: {vehicle.driver}</p>
                      <p className="text-sm text-foreground/70">Apoio: {vehicle.support}</p>
                      <p className="text-xs text-foreground/50">
                        {vehicle.date} às {vehicle.initialTime} - KM: {vehicle.initialKm}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full">
                        ABERTA
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-0 h-auto"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div>
            <CardTitle className="text-lg uppercase font-bold">Finalizar Viatura</CardTitle>
            <CardDescription>Viatura: {selectedVehicle.vehicle}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dados da Abertura */}
        <div className="bg-muted p-4 rounded-lg space-y-3">
          <h3 className="font-semibold uppercase text-sm">Dados da Abertura</h3>

          {isEditing ? (
            <div className="space-y-3">
              {/* Viatura */}
              <div className="space-y-1">
                <Label className="text-xs uppercase font-semibold">Viatura</Label>
                <Input
                  value={editData.vehicle || ""}
                  onChange={(e) => handleEditChange("vehicle", e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Condutor */}
              <div className="space-y-1">
                <Label className="text-xs uppercase font-semibold">Condutor</Label>
                <Input
                  value={editData.driver || ""}
                  onChange={(e) => handleEditChange("driver", e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Apoio */}
              <div className="space-y-1">
                <Label className="text-xs uppercase font-semibold">Apoio</Label>
                <Input
                  value={editData.support || ""}
                  onChange={(e) => handleEditChange("support", e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Data */}
              <div className="space-y-1">
                <Label className="text-xs uppercase font-semibold">Data</Label>
                <Input
                  type="date"
                  value={editData.date || ""}
                  onChange={(e) => handleEditChange("date", e.target.value)}
                  className="h-10"
                />
              </div>

              {/* KM Inicial */}
              <div className="space-y-1">
                <Label className="text-xs uppercase font-semibold">KM Inicial</Label>
                <Input
                  type="number"
                  value={editData.initialKm || ""}
                  onChange={(e) => handleEditChange("initialKm", e.target.value)}
                  className="h-10"
                />
              </div>

              {/* Hora Inicial */}
              <div className="space-y-1">
                <Label className="text-xs uppercase font-semibold">Hora Inicial</Label>
                <Input
                  type="time"
                  value={editData.initialTime || ""}
                  onChange={(e) => handleEditChange("initialTime", e.target.value)}
                  className="h-10"
                />
              </div>

              <Button
                onClick={handleSaveEdit}
                className="w-full h-10 uppercase font-semibold text-sm bg-accent hover:bg-accent/90"
              >
                Salvar Alterações
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-foreground/60 text-xs">Viatura</p>
                <p className="font-semibold">{selectedVehicle.vehicle}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-xs">Condutor</p>
                <p className="font-semibold">{selectedVehicle.driver}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-xs">Apoio</p>
                <p className="font-semibold">{selectedVehicle.support}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-xs">Data</p>
                <p className="font-semibold">{selectedVehicle.date}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-xs">KM Inicial</p>
                <p className="font-semibold">{selectedVehicle.initialKm}</p>
              </div>
              <div>
                <p className="text-foreground/60 text-xs">Hora Inicial</p>
                <p className="font-semibold">{selectedVehicle.initialTime}</p>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            onClick={handleEditToggle}
            className="w-full h-10 uppercase font-semibold text-sm"
          >
            {isEditing ? "Cancelar Edição" : "Editar Dados"}
          </Button>
        </div>

        {/* Dados de Finalização */}
        <div className="space-y-4">
          <h3 className="font-semibold uppercase text-sm">Finalizar Viatura</h3>

          {/* KM Final */}
          <div className="space-y-2">
            <Label htmlFor="finalKm" className="font-semibold uppercase text-sm">
              KM Final
            </Label>
            <Input
              id="finalKm"
              type="number"
              placeholder={selectedVehicle.initialKm}
              value={finalKm}
              onChange={(e) => setFinalKm(e.target.value)}
              className="h-12"
            />
          </div>

          {/* Hora Final */}
          <div className="space-y-2">
            <Label htmlFor="finalTime" className="font-semibold uppercase text-sm">
              Hora Final
            </Label>
            <Input
              id="finalTime"
              type="time"
              value={finalTime}
              onChange={(e) => setFinalTime(e.target.value)}
              className="h-12"
            />
          </div>

          {/* KM Percorridos (calculado) */}
          {finalKm && (
            <div className="bg-accent/10 p-4 rounded-lg">
              <p className="text-sm text-foreground/60">KM Percorridos</p>
              <p className="text-2xl font-bold text-accent">
                {parseInt(finalKm) - parseInt(selectedVehicle.initialKm)} km
              </p>
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="space-y-3">
          <Button
            onClick={handleFinalize}
            className="w-full h-12 text-base font-semibold uppercase bg-accent hover:bg-accent/90 rounded-lg flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            Finalizar Viatura
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedVehicle(null)}
            className="w-full h-12 text-base font-semibold uppercase rounded-lg"
          >
            Voltar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
