import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useParams } from "next/navigation";

export function TeamSettings() {
  const { ["team-id"]: teamId }: { ["team-id"]: string } = useParams();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações do Time</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie as configurações do seu time
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Time</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="team-name">Nome do Time</Label>
              <Input id="team-name" placeholder="Nome do time" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="team-description">Descrição</Label>
              <Input id="team-description" placeholder="Descrição do time" />
            </div>
            <Button>Salvar Alterações</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Membros do Time</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>João Silva</TableCell>
                  <TableCell>joao@exemplo.com</TableCell>
                  <TableCell>Administrador</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm">
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
                {/* Adicione mais linhas conforme necessário */}
              </TableBody>
            </Table>
            <div className="mt-4">
              <Button>Adicionar Membro</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Zona de Perigo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button variant="destructive">Excluir Time</Button>
              <p className="mt-2 text-sm text-muted-foreground">
                Esta ação é irreversível e excluirá todas as informações do
                time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
