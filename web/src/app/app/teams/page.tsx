"use client";
import React from "react";
import AddTeamDialog from "~/components/team/add-team-dialog";
import { TeamCard } from "~/components/team/team-card";
import { useUserContext } from "~/hooks/use-user-context";
import { Input } from "~/components/ui/input";
import { Search, Grid2x2, List, TrendingUp } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function Page() {
  const { teams, loadingTeams } = useUserContext();
  const [view, setView] = React.useState<"grid" | "list">("grid");
  const [search, setSearch] = React.useState("");
  const [sort, setSort] = React.useState("name-asc");

  const filteredTeams = React.useMemo(() => {
    return teams
      .filter((team) =>
        team.name.toLowerCase().includes(search.toLowerCase()),
      )
      .sort((a, b) => {
        switch (sort) {
          case "name-asc":
            return a.name.localeCompare(b.name);
          case "name-desc":
            return b.name.localeCompare(a.name);
          case "balance-asc":
            return (a.balance ?? 0) - (b.balance ?? 0);
          case "balance-desc":
            return (b.balance ?? 0) - (a.balance ?? 0);
          case "transactions-desc":
            return (b.qtTransactions ?? 0) - (a.qtTransactions ?? 0);
          default:
            return 0;
        }
      });
  }, [teams, search, sort]);

  const totalBalance = React.useMemo(() => {
    return teams.reduce((acc, team) => acc + (team.balance ?? 0), 0);
  }, [teams]);

  const totalTransactions = React.useMemo(() => {
    return teams.reduce((acc, team) => acc + (team.qtTransactions ?? 0), 0);
  }, [teams]);

  return (
    <main className="flex h-full flex-1 flex-col gap-6 px-8 py-6">
      <header className="flex flex-col justify-between gap-3 md:flex-row">
        <div>
          <h2 className="text-xl font-semibold md:text-2xl">
            Meus espaços financeiros
          </h2>
          <p className="font-light opacity-80">
            Veja o resumo de todos os seus espaços financeiros.
          </p>
        </div>
        <AddTeamDialog />
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total em Todos os Times
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(totalBalance / 100)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalTransactions} transações no total
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar times..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
              <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
              <SelectItem value="balance-desc">Maior saldo</SelectItem>
              <SelectItem value="balance-asc">Menor saldo</SelectItem>
              <SelectItem value="transactions-desc">Mais transações</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-md border">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <Grid2x2 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <section className="flex h-full w-full flex-1 flex-col">
        {filteredTeams.length > 0 && (
          <div
            className={
              view === "grid"
                ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col gap-4"
            }
          >
            {filteredTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={{
                  ...team,
                  balance: team.balance ?? 0,
                  qtTransactions: team.qtTransactions ?? 0,
                }}
                viewMode={view}
              />
            ))}
          </div>
        )}
        {filteredTeams.length === 0 && !loadingTeams && (
          <div className="flex h-full flex-1 items-center justify-center">
            <p className="opacity-70">
              {search
                ? "Nenhum time encontrado com este termo."
                : "Você ainda não possui nenhum espaço financeiro."}
            </p>
          </div>
        )}
        {loadingTeams && (
          <div className="flex h-full flex-1 items-center justify-center">
            <p className="opacity-70">Carregando espaços financeiros...</p>
          </div>
        )}
      </section>
    </main>
  );
}
