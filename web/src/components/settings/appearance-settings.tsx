import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações de Aparência</h3>
        <p className="text-sm text-muted-foreground">
          Personalize a aparência do aplicativo
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tema</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              defaultValue={theme}
              onValueChange={(value: string) => setTheme(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light">Claro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="dark" id="dark" />
                <Label htmlFor="dark">Escuro</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">Sistema</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="animations">Animações</Label>
              <Switch id="animations" defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="compact-mode">Modo compacto</Label>
              <Switch id="compact-mode" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabelas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="dense-tables">Modo denso</Label>
              <Switch id="dense-tables" />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="row-hover">
                Destacar linha ao passar o mouse
              </Label>
              <Switch id="row-hover" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
