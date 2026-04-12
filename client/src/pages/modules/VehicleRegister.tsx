import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

export default function VehicleRegister() {
  const [formData, setFormData] = useState({
    agentName: "",
    vehicleId: "",
    openingKm: "",
    registeredAt: new Date().toISOString().slice(0, 16),
    observations: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createVehicle = trpc.vehicles.create.useMutation({
    onSuccess: () => {
      toast.success("Viatura registrada com sucesso!");
      setFormData({
        agentName: "",
        vehicleId: "",
        openingKm: "",
        registeredAt: new Date().toISOString().slice(0, 16),
        observations: "",
      });
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao registrar viatura");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agentName || !formData.vehicleId || !formData.openingKm) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      await createVehicle.mutateAsync({
        agentName: formData.agentName,
        vehicleId: formData.vehicleId,
        openingKm: parseInt(formData.openingKm),
        registeredAt: new Date(formData.registeredAt),
        observations: formData.observations || undefined,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Registrar Viatura</CardTitle>
        <CardDescription>Registre a abertura de km da viatura</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agent Name */}
          <div className="space-y-2">
            <Label htmlFor="agentName" className="text-base font-medium">
              Nome do Agente *
            </Label>
            <Input
              id="agentName"
              placeholder="Digite o nome do agente"
              value={formData.agentName}
              onChange={(e) => setFormData({ ...formData, agentName: e.target.value })}
              className="h-12 text-base rounded-lg"
            />
          </div>

          {/* Vehicle ID */}
          <div className="space-y-2">
            <Label htmlFor="vehicleId" className="text-base font-medium">
              ID da Viatura *
            </Label>
            <Input
              id="vehicleId"
              placeholder="Ex: VT-001"
              value={formData.vehicleId}
              onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
              className="h-12 text-base rounded-lg"
            />
          </div>

          {/* Opening KM */}
          <div className="space-y-2">
            <Label htmlFor="openingKm" className="text-base font-medium">
              KM de Abertura *
            </Label>
            <Input
              id="openingKm"
              type="number"
              placeholder="Ex: 15000"
              value={formData.openingKm}
              onChange={(e) => setFormData({ ...formData, openingKm: e.target.value })}
              className="h-12 text-base rounded-lg"
            />
          </div>

          {/* Date and Time */}
          <div className="space-y-2">
            <Label htmlFor="registeredAt" className="text-base font-medium">
              Data e Hora *
            </Label>
            <Input
              id="registeredAt"
              type="datetime-local"
              value={formData.registeredAt}
              onChange={(e) => setFormData({ ...formData, registeredAt: e.target.value })}
              className="h-12 text-base rounded-lg"
            />
          </div>

          {/* Observations */}
          <div className="space-y-2">
            <Label htmlFor="observations" className="text-base font-medium">
              Observações
            </Label>
            <Textarea
              id="observations"
              placeholder="Adicione observações se necessário"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              className="min-h-24 text-base rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 text-base font-semibold rounded-lg bg-accent hover:bg-accent/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Registrar Viatura
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
