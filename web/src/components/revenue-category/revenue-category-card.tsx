import React from "react";
import { type Team } from "~/types/team";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useQuery } from "@tanstack/react-query";
import { revenueCategoriesRequest } from "~/requests/revenue-category";
import Show from "../utils/show";
import RevenueCategoryTable from "./revenue-category-table";
import { AddRevenueCategoryDialog } from "./add-revenue-category-dialog";
import { Loading } from "../ui/loading";

const RevenueCategoryCard: React.FC<{ team: Team; date: string }> = ({
  team,
  date,
}) => {
  const {
    data: revenueCategories,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["revenue-categories", { teamId: team.id, date }],
    queryFn: async () =>
      await revenueCategoriesRequest.listByTeam({
        teamId: team.id,
        date
      }),
  });

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <CardTitle className="w-full">Categorias de receitas</CardTitle>
        <AddRevenueCategoryDialog team={team} />
      </CardHeader>
      <Show
        when={isPending}
        component={
          <CardContent>
            <Loading />
          </CardContent>
        }
      />
      <Show
        when={isError}
        component={<CardContent>Erro ao carregar receitas</CardContent>}
      />
      <Show
        when={Boolean(revenueCategories)}
        component={
          <CardContent>
            <RevenueCategoryTable team={team} data={revenueCategories!} />
          </CardContent>
        }
      />
    </Card>
  );
};

export default RevenueCategoryCard;
