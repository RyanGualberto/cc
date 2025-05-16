"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { NotificationsSettings } from "~/components/settings/notifications-settings";
import { AccountSettings } from "~/components/settings/account-settings";
import { AppearanceSettings } from "~/components/settings/appearance-settings";
import { useUserContext } from "~/hooks/use-user-context";

export default function SettingsPage() {
  const { user } = useUserContext();

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="account" className="space-y-4">
            <TabsList>
              <TabsTrigger value="account">Conta</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="appearance">Aparência</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <AccountSettings user={user} />
            </TabsContent>
            <TabsContent value="notifications">
              <NotificationsSettings />
            </TabsContent>
            <TabsContent value="appearance">
              <AppearanceSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
