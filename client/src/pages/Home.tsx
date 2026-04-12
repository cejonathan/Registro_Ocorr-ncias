import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Truck, AlertCircle, BarChart3, Plus, History } from "lucide-react";
import { getLoginUrl } from "@/const";
import { useState } from "react";
import VehicleRegister from "@/pages/modules/VehicleRegister";
import VehicleHistory from "@/pages/modules/VehicleHistory";
import OccurrenceRegister from "@/pages/modules/OccurrenceRegister";
import OccurrenceHistory from "@/pages/modules/OccurrenceHistory";
import ReportGenerate from "@/pages/modules/ReportGenerate";
import ReportHistory from "@/pages/modules/ReportHistory";
import Dashboard from "@/pages/modules/Dashboard";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activeSubTab, setActiveSubTab] = useState<Record<string, string>>({
    viatura: "register",
    occurrences: "register",
    reports: "register",
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-border border-t-accent rounded-full animate-spin mx-auto" />
          <p className="text-foreground/60">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-card px-4">
        <div className="text-center space-y-8 max-w-md w-full">
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
                <Truck className="w-8 h-8 text-accent-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Traffic Agent</h1>
            <p className="text-lg text-foreground/70">Gestão Operacional de Segurança</p>
          </div>

          <div className="space-y-4 pt-8">
            <p className="text-foreground/60 text-sm leading-relaxed">
              Registre viaturas, ocorrências e gere relatórios com facilidade. Tudo sincronizado com Google Sheets.
            </p>
            <Button
              onClick={() => window.location.href = getLoginUrl()}
              size="lg"
              className="w-full h-14 text-base font-semibold rounded-xl bg-accent hover:bg-accent/90"
            >
              Entrar com Google
            </Button>
          </div>

          <div className="pt-8 space-y-3 text-xs text-foreground/50">
            <p>✓ Login seguro com Google</p>
            <p>✓ Sincronização automática com Google Sheets</p>
            <p>✓ Interface otimizada para mobile</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="container max-w-full px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Traffic Agent</h1>
              <p className="text-xs text-foreground/60">{user?.name || "Agente"}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="text-foreground/70 hover:text-foreground"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-full px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <Dashboard />
          </TabsContent>

          {/* Viatura Tab */}
          <TabsContent value="viatura" className="space-y-6">
            <Tabs
              value={activeSubTab.viatura}
              onValueChange={(val) => setActiveSubTab({ ...activeSubTab, viatura: val })}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg">
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Registrar</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">Histórico</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="register" className="space-y-4">
                <VehicleRegister />
              </TabsContent>
              <TabsContent value="history" className="space-y-4">
                <VehicleHistory />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Ocorrências Tab */}
          <TabsContent value="occurrences" className="space-y-6">
            <Tabs
              value={activeSubTab.occurrences}
              onValueChange={(val) => setActiveSubTab({ ...activeSubTab, occurrences: val })}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg">
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Registrar</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">Histórico</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="register" className="space-y-4">
                <OccurrenceRegister />
              </TabsContent>
              <TabsContent value="history" className="space-y-4">
                <OccurrenceHistory />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Relatórios Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Tabs
              value={activeSubTab.reports}
              onValueChange={(val) => setActiveSubTab({ ...activeSubTab, reports: val })}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg">
                <TabsTrigger value="register" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Gerar</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  <span className="hidden sm:inline">Histórico</span>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="register" className="space-y-4">
                <ReportGenerate />
              </TabsContent>
              <TabsContent value="history" className="space-y-4">
                <ReportHistory />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Tab List - Bottom Navigation */}
          <TabsList className="grid w-full grid-cols-4 fixed bottom-0 left-0 right-0 rounded-none border-t border-border bg-card h-16 p-0">
            <TabsTrigger
              value="dashboard"
              className="flex flex-col items-center gap-1 rounded-none data-[state=active]:bg-transparent"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Painel</span>
            </TabsTrigger>
            <TabsTrigger
              value="viatura"
              className="flex flex-col items-center gap-1 rounded-none data-[state=active]:bg-transparent"
            >
              <Truck className="w-5 h-5" />
              <span className="text-xs">Viatura</span>
            </TabsTrigger>
            <TabsTrigger
              value="occurrences"
              className="flex flex-col items-center gap-1 rounded-none data-[state=active]:bg-transparent"
            >
              <AlertCircle className="w-5 h-5" />
              <span className="text-xs">Ocorrências</span>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="flex flex-col items-center gap-1 rounded-none data-[state=active]:bg-transparent"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Relatórios</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
