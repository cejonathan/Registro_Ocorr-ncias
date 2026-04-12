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

export default function VehicleRegister() {
  const [formData, setFormData] = useState({
    vehicle: "",
    vehicleCustom: "",
    driver: "",
    driverCustom: "",
    support: "",
    supportCustom: "",
    date: "",
    initialKm: "",
    initialTime: "",
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

    if (
      !formData.vehicle ||
      !formData.driver ||
      !formData.support ||
      !formData.date ||
      !formData.initialKm ||
      !formData.initialTime
    ) {
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

    console.log({
      vehicle: finalVehicle,
      driver: finalDriver,
      support: finalSupport,
      date: formData.date,
      initialKm: formData.initialKm,
      initialTime: formData.initialTime,
    });

    toast.success("Viatura registrada com sucesso!");
    setFormData({
      vehicle: "",
      vehicleCustom: "",
      driver: "",
      driverCustom: "",
      support: "",
      supportCustom: "",
      date: "",
      initialKm: "",
      initialTime: "",
    });
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg uppercase font-bold">Registrar KM</CardTitle>
        <CardDescription>Registre a abertura de quilometragem da viatura</CardDescription>
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
              placeholder="0"
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
            Registrar KM
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
