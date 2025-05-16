"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { LogOut } from "lucide-react";
import { useUserContext } from "~/hooks/use-user-context";

export default function ProfilePage() {
  const { user } = useUserContext();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-8">
            <Avatar className="h-24 w-24">
              <AvatarFallback>
                {user?.firstName

                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-lg font-medium">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Informações da Conta</h4>
                  <p className="text-sm text-muted-foreground">
                    Gerencie suas informações pessoais
                  </p>
                </div>

                <div className="grid gap-2">
                  <div>
                    <label className="text-sm font-medium">Nome</label>
                    <p className="text-sm text-muted-foreground">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Button
                  variant="destructive"
                  // onClick={() => void signOut()}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
