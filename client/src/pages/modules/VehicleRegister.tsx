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
import { X, Edit2, Save } from "lucide-react";

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

interface VehicleRecord {
  id: string;
  vehicle: string;
  driver: string;
  support: string;
  date: string;
  initialKm: string;
  initialTime: string;
}

export default function VehicleRegister() {
  const [formData, setFormData] = useState({
    vehicle: "",
    vehicleCustom: "",
    driver: "",
    driverCustom: "",
    support: "",
    supportCustom: "",
    date: new Date().toISOString().split("T")[0],
    initialKm: "",
    initialTime: new Date().toTimeString().slice(0, 5),
  });

  const [openRecord, setOpenRecord] = useState<VehicleRecord | null>(null);
  const [finalKm, setFinalKm] = useState("");
  const [finalTime, setFinalTime] = useState("");
  const [isEditingOpen, setIsEditingOpen] = useState(false);
  const [editData, setEditData] = useState<Partial<VehicleRecord>>({});

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

    if (!formData.vehicle || !formData.driver || !formData.support || !formData.initialKm) {
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

    const finalVehicle = formData.vehicle === "Outros" ? formData.vehicleCustom : formData.vehicle;
    const finalDriver = formData.driver === "Outros" ? formData.driverCustom : formData.driver;
    const finalSupport = formData.support === "Outros" ? formData.supportCustom : formData.support;

    const newRecord: VehicleRecord = {
      id: Date.now().toString(),
      vehicle: finalVehicle,
      driver: finalDriver,
      support: finalSupport,
      date: formData.date,
      initialKm: formData.initialKm,
      initialTime: formData.initialTime,
    };

    setOpenRecord(newRecord);
    setFinalKm("");
    setFinalTime("");
    setIsEditingOpen(false);
  };

  const handleEditToggle = () => {
    if (!openRecord) return;
    if (!isEditingOpen) {
      setEditData(openRecord);
    }
    setIsEditingOpen(!isEditingOpen);
  };

  const handleEditChange = (field: keyof VehicleRecord, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = () => {
    if (!openRecord) return;
    setOpenRecord({
      ...openRecord,
      ...editData,
    });
    setIsEditingOpen(false);
    toast.success("Dados atualizados com sucesso!");
  };

  const handleFinalize = () => {
    if (!openRecord) {
      toast.error("Nenhuma viatura aberta");
      return;
    }

    if (!finalKm || !finalTime) {
      toast.error("Preencha KM FINAL e HORA FINAL");
      return;
    }

    const initialKmNum = parseInt(openRecord.initialKm);
    const finalKmNum = parseInt(finalKm);

    if (finalKmNum < initialKmNum) {
      toast.error("KM FINAL não pode ser menor que KM INICIAL");
      return;
    }

    const kmDifference = finalKmNum - initialKmNum;

    console.log({
      vehicle: openRecord.vehicle,
      driver: openRecord.driver,
      support: openRecord.support,
      date: openRecord.date,
      initialKm: openRecord.initialKm,
      initialTime: openRecord.initialTime,
      finalKm: finalKm,
      finalTime: finalTime,
      kmDifference: kmDifference,
    });

    toast.success(`Viatura finalizada! KM percorridos: ${kmDifference}`);
    setOpenRecord(null);
    setFinalKm("");
    setFinalTime("");
    setFormData({
      vehicle: "",
      vehicleCustom: "",
      driver: "",
      driverCustom: "",
      support: "",
      supportCustom: "",
      date: new Date().toISOString().split("T")[0],
      initialKm: "",
      initialTime: new Date().toTimeString().slice(0, 5),
    });
  };

  if (openRecord) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
        <Card className="w-full border-0 rounded-t-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="sticky top-0 bg-card border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg uppercase font-bold">Fechar KM</CardTitle>
                <CardDescription>Viatura: {openRecord.vehicle}</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpenRecord(null)}
                className="p-0 h-auto"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Dados da Abertura */}
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h3 className="font-semibold uppercase text-sm">Dados da Abertura</h3>

              {isEditingOpen ? (
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
                    <p className="font-semibold">{openRecord.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-xs">Condutor</p>
                    <p className="font-semibold">{openRecord.driver}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-xs">Apoio</p>
                    <p className="font-semibold">{openRecord.support}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-xs">Data</p>
                    <p className="font-semibold">{openRecord.date}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-xs">KM Inicial</p>
                    <p className="font-semibold">{openRecord.initialKm}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-xs">Hora Inicial</p>
                    <p className="font-semibold">{openRecord.initialTime}</p>
                  </div>
                </div>
              )}

              <Button
                variant="outline"
                onClick={handleEditToggle}
                className="w-full h-10 uppercase font-semibold text-sm"
              >
                {isEditingOpen ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar Edição
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Editar Dados
                  </>
                )}
              </Button>
            </div>

            {/* Dados de Finalização */}
            <div className="space-y-4">
              <h3 className="font-semibold uppercase text-sm">Fechar Viatura</h3>

              {/* KM Final */}
              <div className="space-y-2">
                <Label htmlFor="finalKm" className="font-semibold uppercase text-sm">
                  KM Final
                </Label>
                <Input
                  id="finalKm"
                  type="number"
                  placeholder={openRecord.initialKm}
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
                    {parseInt(finalKm) - parseInt(openRecord.initialKm)} km
                  </p>
                </div>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="space-y-3 pb-6">
              <Button
                onClick={handleFinalize}
                className="w-full h-12 text-base font-semibold uppercase bg-accent hover:bg-accent/90 rounded-lg flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Fechar Viatura
              </Button>
              <Button
                variant="outline"
                onClick={() => setOpenRecord(null)}
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
        <CardTitle className="text-lg uppercase font-bold">Registrar KM</CardTitle>
        <CardDescription>Abra uma nova viatura registrando o KM inicial</CardDescription>
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

          {/* KM Inicial */}
          <div className="space-y-2">
            <Label htmlFor="initialKm" className="font-semibold uppercase text-sm">
              KM Inicial
            </Label>
            <Input
              id="initialKm"
              type="number"
              placeholder="Ex: 15000"
              value={formData.initialKm}
              onChange={(e) => handleInputChange("initialKm", e.target.value)}
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

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold uppercase bg-accent hover:bg-accent/90 rounded-lg"
          >
            Abrir Viatura
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
