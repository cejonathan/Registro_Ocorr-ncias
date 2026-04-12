import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";

const REPORT_TYPES = [
  "Diário",
  "Semanal",
  "Mensal",
  "Customizado",
];

export default function ReportGenerate() {
  const [formData, setFormData] = useState({
    reportType: "",
    periodStart: new Date().toISOString().split("T")[0],
    periodEnd: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createReport = trpc.reports.create.useMutation({
    onSuccess: () => {
      toast.success("Relatório gerado com sucesso!");
      setFormData({
        reportType: "",
        periodStart: new Date().toISOString().split("T")[0],
        periodEnd: new Date().toISOString().split("T")[0],
      });
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao gerar relatório");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reportType || !formData.periodStart || !formData.periodEnd) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (new Date(formData.periodStart) > new Date(formData.periodEnd)) {
      toast.error("A data inicial não pode ser maior que a data final");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReport.mutateAsync({
        reportType: formData.reportType,
        periodStart: new Date(formData.periodStart),
        periodEnd: new Date(formData.periodEnd),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Gerar Relatório</CardTitle>
        <CardDescription>Crie um novo relatório operacional</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type */}
          <div className="space-y-2">
            <Label htmlFor="reportType" className="text-base font-medium">
              Tipo de Relatório *
            </Label>
            <Select value={formData.reportType} onValueChange={(value) => setFormData({ ...formData, reportType: value })}>
              <SelectTrigger className="h-12 text-base rounded-lg">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Period Start */}
          <div className="space-y-2">
            <Label htmlFor="periodStart" className="text-base font-medium">
              Data Inicial *
            </Label>
            <Input
              id="periodStart"
              type="date"
              value={formData.periodStart}
              onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
              className="h-12 text-base rounded-lg"
            />
          </div>

          {/* Period End */}
          <div className="space-y-2">
            <Label htmlFor="periodEnd" className="text-base font-medium">
              Data Final *
            </Label>
            <Input
              id="periodEnd"
              type="date"
              value={formData.periodEnd}
              onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
              className="h-12 text-base rounded-lg"
            />
          </div>

          {/* Info Card */}
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-foreground/70">
              <strong>Nota:</strong> O relatório incluirá todas as viaturas, ocorrências e agentes ativos no período selecionado.
            </p>
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
                Gerando...
              </>
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Gerar Relatório
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
