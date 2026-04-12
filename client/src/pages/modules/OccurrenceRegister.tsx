import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

const OCCURRENCE_TYPES = [
  "Acidente",
  "Infração",
  "Abordagem",
  "Fiscalização",
  "Atendimento",
  "Bloqueio",
  "Escolta",
  "Outro",
];

export default function OccurrenceRegister() {
  const [formData, setFormData] = useState({
    occurrenceType: "",
    location: "",
    description: "",
    agentName: "",
    registeredAt: new Date().toISOString().slice(0, 16),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createOccurrence = trpc.occurrences.create.useMutation({
    onSuccess: () => {
      toast.success("Ocorrência registrada com sucesso!");
      setFormData({
        occurrenceType: "",
        location: "",
        description: "",
        agentName: "",
        registeredAt: new Date().toISOString().slice(0, 16),
      });
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao registrar ocorrência");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.occurrenceType || !formData.location || !formData.description || !formData.agentName) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setIsSubmitting(true);
    try {
      await createOccurrence.mutateAsync({
        occurrenceType: formData.occurrenceType,
        location: formData.location,
        description: formData.description,
        agentName: formData.agentName,
        registeredAt: new Date(formData.registeredAt),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Registrar Ocorrência</CardTitle>
        <CardDescription>Registre uma nova ocorrência de trânsito</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Occurrence Type */}
          <div className="space-y-2">
            <Label htmlFor="occurrenceType" className="text-base font-medium">
              Tipo de Ocorrência *
            </Label>
            <Select value={formData.occurrenceType} onValueChange={(value) => setFormData({ ...formData, occurrenceType: value })}>
              <SelectTrigger className="h-12 text-base rounded-lg">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {OCCURRENCE_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-base font-medium">
              Local *
            </Label>
            <Input
              id="location"
              placeholder="Ex: Av. Paulista, 1000"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="h-12 text-base rounded-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base font-medium">
              Descrição *
            </Label>
            <Textarea
              id="description"
              placeholder="Descreva detalhadamente a ocorrência"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-24 text-base rounded-lg"
            />
          </div>

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
                Registrar Ocorrência
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
