"use client";
import { Users, ArrowRight, TrendingUp, Receipt } from "lucide-react";
import React from "react";
import { type Team } from "~/types/team";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useRouter } from "next/navigation";

interface TeamCardProps {
  team: Required<Team>;
  viewMode?: "grid" | "list";
}

export function TeamCard({ team, viewMode = "grid" }: TeamCardProps) {
  const router = useRouter();

  if (viewMode === "list") {
    return (
      <Card className="transition-all hover:bg-accent/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 sm:h-12 sm:w-12">
                <Users className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{team.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {team.teamMembers.length} membro
                  {team.teamMembers.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 sm:gap-8">
              <div>
                <p className="text-sm font-medium">Saldo Total</p>
                <p className="text-base font-bold sm:text-lg">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(team.balance / 100)}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Transações</p>
                <p className="text-base font-bold sm:text-lg">
                  {team.qtTransactions}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push(`/app/teams/${team.id}`)}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all hover:bg-accent/50">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center justify-between text-base sm:text-lg">
          <span className="truncate">{team.name}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/app/teams/${team.id}`)}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 p-4 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium leading-none">Membros</p>
            <p className="text-sm text-muted-foreground">
              {team.teamMembers.length} membro
              {team.teamMembers.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium leading-none">Saldo Total</p>
            <p className="text-sm text-muted-foreground">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(team.balance / 100)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <Receipt className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium leading-none">Transações</p>
            <p className="text-sm text-muted-foreground">
              {team.qtTransactions} no total
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
