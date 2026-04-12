import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const VEHICLE_OPTIONS = [
  "Sem Viatura",
  "1389",
  "1390",
  "1391",
  "1392",
  "1393",
  "1394",
  "1395",
  "MH 01",
  "MH 02",
  "MH 03",
  "MH 04",
  "MH 05",
  "MH 06",
  "MH 07",
  "MH 08",
  "Outros",
];

const AGENT_OPTIONS = [
  "DET 02",
  "DET 03",
  "DET 06",
  "DET 07",
  "DET 08",
  "DET 10",
  "DET 12",
  "DET 17",
  "DET 18",
  "DET 20",
  "DET 22",
  "DET 35",
  "DET 41",
  "DET 44",
  "DET 46",
  "DET 47",
  "DET 49",
  "DET 54",
  "DET 55",
  "DET 59",
  "DET 61",
  "DET 62",
  "DET 65",
  "DET 67",
  "DET 68",
  "DET 74",
  "DET 75",
  "DET 86",
  "DET 89",
  "DET 90",
  "Outros",
];

const CODE_OPTIONS = [
  "1 - Acompanhamento de alunos",
  "2 - Apoio em obras",
  "3 - Apoio em eventos",
  "4 - Apoio ao agente de trânsito",
  "5 - Acompanhamento de veículos (escolta)",
  "6 - Fiscalização de caminhão",
  "7 - COI",
  "8 - Ação educativa",
  "9 - Autorização de caçamba/caminhão",
  "10 - Apoio órgão público/EDP/Telefonia",
  "11 - Monitoramento",
  "12 - Sinistro de trânsito sem vítima",
  "13 - Sinistro de trânsito com vítima",
  "14 - Animais na pista",
  "15 - Trabalho administrativo",
  "16 - Transporte interno",
  "17 - Solicitação de munícipe",
  "18 - Operação em semáforo",
  "19 - Fiscalização em circulação",
  "20 - Apoio a veículo quebrado",
  "21 - Travessia de alunos",
  "22 - Apoio a feira livre",
  "23 - Desvio de trânsito",
  "24 - Deslocamento ao centro do servidor",
  "25 - Apoio a eventos religiosos",
  "26 - Aferição de radar",
  "27 - Autorizar veículos a passar no vermelho",
  "28 - Manutenção da VTR",
  "29 - Obra SAAE",
  "30 - Remoção de veículo",
  "31 - Remoção de veículo abandonado",
  "32 - Apoio a pintura",
  "33 - Apoio a poda de árvore",
  "34 - Apoio a troca de poste/Recolha de fios caídos",
  "35 - Deslocamento para diretoria de trânsito",
  "36 - Deslocamento para limpar VTR",
  "37 - Blitz",
  "38 - Fiscalização em extensão",
  "39 - Controle de fluxo",
  "40 - Fiscalização em ponto fixo",
  "41 - Posturas",
  "42 - Vistoria",
  "Outros",
];

export default function OccurrenceRegister() {
  const [formData, setFormData] = useState({
    vehicle: "",
    vehicleCustom: "",
    driver: "",
    driverCustom: "",
    support: "",
    supportCustom: "",
    code: "",
    codeCustom: "",
  });

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vehicle || !formData.driver || !formData.support || !formData.code) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.vehicle === "Outros" && !formData.vehicleCustom) {
      toast.error("Especifique a viatura");
      return;
    }

    if (formData.driver === "Outros" && !formData.driverCustom) {
      toast.error("Especifique o condutor");
      return;
    }

    if (formData.support === "Outros" && !formData.supportCustom) {
      toast.error("Especifique o apoio");
      return;
    }

    if (formData.code === "Outros" && !formData.codeCustom) {
      toast.error("Especifique o código");
      return;
    }

    const finalVehicle = formData.vehicle === "Outros" ? formData.vehicleCustom : formData.vehicle;
    const finalDriver = formData.driver === "Outros" ? formData.driverCustom : formData.driver;
    const finalSupport = formData.support === "Outros" ? formData.supportCustom : formData.support;
    const finalCode = formData.code === "Outros" ? formData.codeCustom : formData.code;

    console.log({
      vehicle: finalVehicle,
      driver: finalDriver,
      support: finalSupport,
      code: finalCode,
    });

    toast.success("Ocorrência registrada com sucesso!");
    setFormData({
      vehicle: "",
      vehicleCustom: "",
      driver: "",
      driverCustom: "",
      support: "",
      supportCustom: "",
      code: "",
      codeCustom: "",
    });
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg uppercase font-bold">Registrar Ocorrências</CardTitle>
        <CardDescription>Registre uma nova ocorrência de trânsito</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Viatura */}
          <div className="space-y-2">
            <Label htmlFor="vehicle" className="font-semibold uppercase text-sm">
              Viatura
            </Label>
            <Select value={formData.vehicle} onValueChange={(val) => handleSelectChange("vehicle", val)}>
              <SelectTrigger id="vehicle" className="h-12">
                <SelectValue placeholder="Selecione a viatura" />
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.vehicle === "Outros" && (
              <Input
                placeholder="Especifique a viatura"
                value={formData.vehicleCustom}
                onChange={(e) => handleInputChange("vehicleCustom", e.target.value)}
                className="h-10 mt-2"
              />
            )}
          </div>

          {/* Condutor */}
          <div className="space-y-2">
            <Label htmlFor="driver" className="font-semibold uppercase text-sm">
              Condutor
            </Label>
            <Select value={formData.driver} onValueChange={(val) => handleSelectChange("driver", val)}>
              <SelectTrigger id="driver" className="h-12">
                <SelectValue placeholder="Selecione o condutor" />
              </SelectTrigger>
              <SelectContent>
                {AGENT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.driver === "Outros" && (
              <Input
                placeholder="Especifique o condutor"
                value={formData.driverCustom}
                onChange={(e) => handleInputChange("driverCustom", e.target.value)}
                className="h-10 mt-2"
              />
            )}
          </div>

          {/* Apoio */}
          <div className="space-y-2">
            <Label htmlFor="support" className="font-semibold uppercase text-sm">
              Apoio
            </Label>
            <Select value={formData.support} onValueChange={(val) => handleSelectChange("support", val)}>
              <SelectTrigger id="support" className="h-12">
                <SelectValue placeholder="Selecione o apoio" />
              </SelectTrigger>
              <SelectContent>
                {AGENT_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.support === "Outros" && (
              <Input
                placeholder="Especifique o apoio"
                value={formData.supportCustom}
                onChange={(e) => handleInputChange("supportCustom", e.target.value)}
                className="h-10 mt-2"
              />
            )}
          </div>

          {/* Código */}
          <div className="space-y-2">
            <Label htmlFor="code" className="font-semibold uppercase text-sm">
              Código
            </Label>
            <Select value={formData.code} onValueChange={(val) => handleSelectChange("code", val)}>
              <SelectTrigger id="code" className="h-12">
                <SelectValue placeholder="Selecione o código" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {CODE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.code === "Outros" && (
              <Input
                placeholder="Especifique o código"
                value={formData.codeCustom}
                onChange={(e) => handleInputChange("codeCustom", e.target.value)}
                className="h-10 mt-2"
              />
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold uppercase bg-accent hover:bg-accent/90 rounded-lg"
          >
            Registrar Ocorrência
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
