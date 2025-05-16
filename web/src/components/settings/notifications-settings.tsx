import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { Separator } from "~/components/ui/separator";

export function NotificationsSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações de Notificações</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie como você recebe notificações
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Notificações por Email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="expenses-due">Despesas a vencer</Label>
              <Switch id="expenses-due" />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="expenses-overdue">Despesas vencidas</Label>
              <Switch id="expenses-overdue" />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="new-team-member">Novo membro no time</Label>
              <Switch id="new-team-member" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notificações no Navegador</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="browser-notifications">
                Ativar notificações no navegador
              </Label>
              <Switch id="browser-notifications" />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="sound-notifications">Som nas notificações</Label>
              <Switch id="sound-notifications" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumos e Relatórios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="weekly-summary">Resumo semanal</Label>
              <Switch id="weekly-summary" />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="monthly-report">Relatório mensal</Label>
              <Switch id="monthly-report" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 