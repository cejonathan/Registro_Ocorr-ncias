import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";

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

const SECTOR_OPTIONS = [
  "Setor 1",
  "Setor 2",
  "Setor 3",
  "Setor 4",
  "Setor 5",
  "Setor 6",
  "Setor 7",
  "Setor 8",
  "Setor 9",
  "Setor 10",
  "Setor 11",
  "Setor 12",
  "Setor 13",
  "Setor 14",
  "Setor 15",
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

interface OccurrenceRecord {
  id: string;
  vehicle: string;
  driver: string;
  support: string;
  sector: string;
  code: string;
  date: string;
  initialTime: string;
  observation: string;
  media: string[];
}

export default function OccurrenceRegister() {
  const [formData, setFormData] = useState({
    vehicle: "",
    vehicleCustom: "",
    driver: "",
    driverCustom: "",
    support: "",
    supportCustom: "",
    sector: "",
    sectorCustom: "",
    code: "",
    codeCustom: "",
    date: new Date().toISOString().split("T")[0],
    initialTime: new Date().toTimeString().slice(0, 5),
    observation: "",
  });

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [openOccurrence, setOpenOccurrence] = useState<OccurrenceRecord | null>(null);
  const [finalTime, setFinalTime] = useState("");

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

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files));
      toast.success(`${e.target.files.length} arquivo(s) selecionado(s)`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.vehicle || !formData.driver || !formData.support || !formData.sector || !formData.code) {
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

    if (formData.sector === "Outros" && !formData.sectorCustom) {
      toast.error("Especifique o setor");
      return;
    }

    if (formData.code === "Outros" && !formData.codeCustom) {
      toast.error("Especifique o código");
      return;
    }

    const finalVehicle = formData.vehicle === "Outros" ? formData.vehicleCustom : formData.vehicle;
    const finalDriver = formData.driver === "Outros" ? formData.driverCustom : formData.driver;
    const finalSupport = formData.support === "Outros" ? formData.supportCustom : formData.support;
    const finalSector = formData.sector === "Outros" ? formData.sectorCustom : formData.sector;
    const finalCode = formData.code === "Outros" ? formData.codeCustom : formData.code;

    const newRecord: OccurrenceRecord = {
      id: Date.now().toString(),
      vehicle: finalVehicle,
      driver: finalDriver,
      support: finalSupport,
      sector: finalSector,
      code: finalCode,
      date: formData.date,
      initialTime: formData.initialTime,
      observation: formData.observation,
      media: mediaFiles.map((f) => f.name),
    };

    setOpenOccurrence(newRecord);
    setFinalTime("");
  };

  const handleFinalizeOccurrence = () => {
    if (!openOccurrence) {
      toast.error("Nenhuma ocorrência aberta");
      return;
    }

    if (!finalTime) {
      toast.error("Preencha a HORA FINAL");
      return;
    }

    console.log({
      ...openOccurrence,
      finalTime: finalTime,
    });

    toast.success("Ocorrência finalizada com sucesso!");
    setOpenOccurrence(null);
    setFinalTime("");
    setFormData({
      vehicle: "",
      vehicleCustom: "",
      driver: "",
      driverCustom: "",
      support: "",
      supportCustom: "",
      sector: "",
      sectorCustom: "",
      code: "",
      codeCustom: "",
      date: new Date().toISOString().split("T")[0],
      initialTime: new Date().toTimeString().slice(0, 5),
      observation: "",
    });
    setMediaFiles([]);
  };

  if (openOccurrence) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
        <Card className="w-full border-0 rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="sticky top-0 bg-card border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg uppercase font-bold">Finalizar Ocorrência</CardTitle>
                <CardDescription>Código: {openOccurrence.code}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenOccurrence(null)}
                className="p-0 h-auto"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Dados da Ocorrência */}
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h3 className="font-semibold uppercase text-sm">Dados da Ocorrência</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-foreground/60 text-xs">Viatura</p>
                  <p className="font-semibold">{openOccurrence.vehicle}</p>
                </div>
                <div>
                  <p className="text-foreground/60 text-xs">Condutor</p>
                  <p className="font-semibold">{openOccurrence.driver}</p>
                </div>
                <div>
                  <p className="text-foreground/60 text-xs">Apoio</p>
                  <p className="font-semibold">{openOccurrence.support}</p>
                </div>
                <div>
                  <p className="text-foreground/60 text-xs">Setor</p>
                  <p className="font-semibold">{openOccurrence.sector}</p>
                </div>
                <div>
                  <p className="text-foreground/60 text-xs">Data</p>
                  <p className="font-semibold">{openOccurrence.date}</p>
                </div>
                <div>
                  <p className="text-foreground/60 text-xs">Hora Inicial</p>
                  <p className="font-semibold">{openOccurrence.initialTime}</p>
                </div>
              </div>
            </div>

            {/* Observação */}
            {openOccurrence.observation && (
              <div className="bg-card border border-border p-4 rounded-lg">
                <p className="text-xs text-foreground/60 uppercase font-semibold mb-2">Observação</p>
                <p className="text-sm">{openOccurrence.observation}</p>
              </div>
            )}

            {/* Hora Final */}
            <div className="space-y-4">
              <h3 className="font-semibold uppercase text-sm">Finalizar Ocorrência</h3>
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
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3 pb-6">
              <Button
                onClick={handleFinalizeOccurrence}
                className="w-full h-12 text-base font-semibold uppercase bg-accent hover:bg-accent/90 rounded-lg"
              >
                Finalizar Ocorrência
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpenOccurrence(null)}
                className="w-full h-12 text-base font-semibold uppercase rounded-lg"
              >
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

          {/* Local (Setor) */}
          <div className="space-y-2">
            <Label htmlFor="sector" className="font-semibold uppercase text-sm">
              Local
            </Label>
            <Select value={formData.sector} onValueChange={(val) => handleSelectChange("sector", val)}>
              <SelectTrigger id="sector" className="h-12">
                <SelectValue placeholder="Selecione o setor" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {SECTOR_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.sector === "Outros" && (
              <Input
                placeholder="Especifique o local"
                value={formData.sectorCustom}
                onChange={(e) => handleInputChange("sectorCustom", e.target.value)}
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

          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="date" className="font-semibold uppercase text-sm">
              Data
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className="h-12"
            />
          </div>

          {/* Hora Inicial */}
          <div className="space-y-2">
            <Label htmlFor="initialTime" className="font-semibold uppercase text-sm">
              Hora Inicial
            </Label>
            <Input
              id="initialTime"
              type="time"
              value={formData.initialTime}
              onChange={(e) => handleInputChange("initialTime", e.target.value)}
              className="h-12"
            />
          </div>

          {/* Observação */}
          <div className="space-y-2">
            <Label htmlFor="observation" className="font-semibold uppercase text-sm">
              Observação
            </Label>
            <Textarea
              id="observation"
              placeholder="Descreva detalhes da ocorrência"
              value={formData.observation}
              onChange={(e) => handleInputChange("observation", e.target.value)}
              className="min-h-24 text-base rounded-lg"
            />
          </div>

          {/* Fotos e Vídeos */}
          <div className="space-y-2">
            <Label htmlFor="media" className="font-semibold uppercase text-sm">
              Fotos e Vídeos
            </Label>
            <div className="relative">
              <Input
                id="media"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="h-12 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/90"
              />
            </div>
            {mediaFiles.length > 0 && (
              <div className="text-sm text-foreground/60">
                {mediaFiles.length} arquivo(s) selecionado(s)
              </div>
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
